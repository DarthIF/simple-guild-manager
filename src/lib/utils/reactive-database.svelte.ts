import type { LocalizedString } from "$lib/strings"
import { basic, database_strings } from "$lib/strings/strings"
import { formatNumberCompact, parseCompactNumber } from "./number-util"


export type DatabaseType = {
    organization: string
    members: MemberType[]
    events: EventsType
    auditLog: AuditLogType[]
}

export type MemberType = {
    id: string
    name: string
    power: number
    commissions: {
        state: CommissionState
        time: number
        missed: number
    }
}

export type TeamType = {
    id: string
    name: string
    members: string[]
}

export type EventsType = {
    worldTree: TeamType[]
    minesInDungeon: TeamType[]
    cloudKingdom: TeamType[]
    cassinoOnYacht: TeamType[]
}

export type CommissionsType = {
    closed: string[]
    inactive: string[]
}

export type AuditLogType = {
    timestamp: string
    action: string
    details: AuditLogDetails
}

export type AuditLogDetails = {
    name?: string
    power?: number

    gameEvent?: string
    teamName?: string
    memberId?: string

    oldName?: string
    newName?: string

    state?: number
}

export enum Actions {
    CHANGE_ORGANIZATION_NAME = 'change_org_name',

    ADD_MEMBER = 'add_member',
    REMOVED_MEMBER = 'removed_member',
    EDITED_MEMBER = 'edited_member',

    CREATE_TEAM = 'create_team',
    DELETE_TEAM = 'delete_team',
    ADD_MEMBER_TO_TEAM = 'add_member_to_team',
    REMOVE_MEMBER_FROM_TEAM = 'remove_member_from_team',

    COMMISSION_SET_STATE = 'commission_set_state',
    COMMISSION_RESET_CYCLE = 'commission_reset_cycle',
}

export enum GameEvents {
    WORLD_TREE = 'world_tree',
    MINES_IN_DUNGEON = 'mines_in_dungeon',
    CLOUD_KINGDOM = 'cloud_kingdom',
    CASSINO_ON_YACHT = 'cassino_on_yacht'
}

export enum CommissionState {
    AVAILABLE = 0,
    CLOSED = 1,
    INACTIVE = 2,
}


function print(...message: any[]) {
    console.log(...message)
}

function createDefaultData(): DatabaseType {
    return JSON.parse(JSON.stringify(DEFAULT_DATA))
}

function getExportFileName(): string {
    const org = ReactiveData.organization.replace(/\s+/g, '_')
    return `${org}_backup.json`
}


function forEachEvent(callback: (eventTeams: TeamType[]) => void) {
    callback(ReactiveData.events.worldTree)
    callback(ReactiveData.events.minesInDungeon)
    callback(ReactiveData.events.cloudKingdom)
    callback(ReactiveData.events.cassinoOnYacht)
}


function currentUnixTime(): number {
    return Date.now()
}


export function calculateTeamPower(team: TeamType): number {
    let total = 0
    team.members.forEach(memberId => {
        const member = Database.findMember(memberId)
        if (member)
            total += member.power
    })

    return total
}

export function calculateTeamPowerToDisplay(team: TeamType): string {
    const power = calculateTeamPower(team)
    return formatNumberCompact(power)
}

export function getCommissionStateString(state: CommissionState | number | undefined): LocalizedString {
    switch (state) {
        case CommissionState.AVAILABLE:
            return database_strings.commission_state_available
        case CommissionState.CLOSED:
            return database_strings.commission_state_closed
        case CommissionState.INACTIVE:
            return database_strings.commission_state_inactive
    }

    return basic.undefined
}


const LOCAL_STORAGE_KEY = 'team-creator'
const DEFAULT_DATA: DatabaseType = {
    organization: 'Guild Name 🎈',
    members: [],
    events: {
        worldTree: [],
        minesInDungeon: [],
        cloudKingdom: [],
        cassinoOnYacht: []
    },
    auditLog: []
}


/**
 * Banco de dados reativo, utilize apenas para acessar os valores.
 * Faça a manipulação de dados usando a classe Database
 */
export const ReactiveData: DatabaseType = $state(createDefaultData())

/**
 * Classe usada para manipular os dados do ReactiveData
 */
export class Database {

    private constructor() { }


    public static loadData() {
        const DEFAULT = createDefaultData()
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
        const data: DatabaseType = savedData ? JSON.parse(savedData) : DEFAULT

        ReactiveData.organization = data.organization || DEFAULT.organization
        ReactiveData.members = data.members || DEFAULT.members
        ReactiveData.events = data.events || DEFAULT.events
        ReactiveData.auditLog = data.auditLog || DEFAULT.auditLog
    }

    public static saveData() {
        const value = JSON.stringify(ReactiveData)

        localStorage.setItem(LOCAL_STORAGE_KEY, value)
    }


    public static addAuditLog(action: Actions, details: AuditLogDetails, autoSave: boolean = true) {
        const timestamp = new Date().toISOString()

        // Atualizar o registro de auditoria
        ReactiveData.auditLog = [{ timestamp, action, details }, ...ReactiveData.auditLog]

        if (autoSave)
            Database.saveData()
    }

    public static addMember(name: string, power: number): boolean {
        if (!name || isNaN(power)) {
            print('Erro ao adicionar membro.', { name, power })
            return false
        }

        // Adicionar o membro
        ReactiveData.members = [...ReactiveData.members, {
            id: currentUnixTime().toString(),
            name,
            power,
            commissions: {
                state: CommissionState.AVAILABLE,
                time: 0,
                missed: 0,
            }
        }]

        // Adicionar ao registro de auditoria, salvamento automático
        Database.addAuditLog(Actions.ADD_MEMBER, { name, power })

        print('Membro adicionado com sucesso!', { name, power })

        return true
    }

    public static deleteMemberV2(member: MemberType, index: number = -1) {
        // Procurar o índice
        if (index < 0)
            index = ReactiveData.members.indexOf(member)

        // Primeiro remover o membro dos times
        forEachEvent(eventTeams => {
            eventTeams.forEach(team => {
                const memberIndex = team.members.indexOf(member.id)
                if (memberIndex !== -1) {
                    // Remove o membro do time
                    team.members.splice(memberIndex, 1)

                    // Adicionar o registro de auditoria
                    Database.addAuditLog(Actions.REMOVE_MEMBER_FROM_TEAM, { teamName: team.name, memberId: member.id }, false)
                }
            })
        })

        // Remover o membro do banco de dados
        if (index > -1)
            ReactiveData.members.splice(index, 1)

        // Adicionar ao registro de auditoria, salvamento automático
        Database.addAuditLog(Actions.REMOVED_MEMBER, { name: member.name })

        print('Membro removido com sucesso!', member)
    }


    public static addTeam(gameEvent: GameEvents, name: string): boolean {
        if (!name)
            return false

        // Adicionar o novo time
        Database.getEventTeams(gameEvent).push({
            id: Date.now().toString(),
            name,
            members: []
        })

        // Adicionar ao registro de auditoria, salvamento automático
        Database.addAuditLog(Actions.CREATE_TEAM, { gameEvent, name })

        print('Equipe criada com sucesso!')

        return true
    }

    public static deleteTeamByIndex(gameEvent: GameEvents, index: number) {
        const teams = Database.getEventTeams(gameEvent)
        const team = teams[index]

        // Deletar o time 
        teams.splice(index, 1)

        // Adicionar ao registro de auditoria, salvamento automático
        Database.addAuditLog(Actions.DELETE_TEAM, { name: team.name })

        print('Equipe removida com sucesso!')
    }

    public static deleteTeam(gameEvent: GameEvents, team: TeamType): boolean {
        const teams = Database.getEventTeams(gameEvent)
        const index = teams.indexOf(team)

        if (index < 0)
            return false

        Database.deleteTeamByIndex(gameEvent, index)
        return true
    }


    public static addMemberToTeamV2(gameEvent: GameEvents, teamId: string, memberId: string) {
        const teams = Database.getEventTeams(gameEvent)
        const team = teams.find(t => t.id === teamId)

        // Time não encontrado ou cheio
        if (!team || team.members.length >= 4)
            return false

        // Adicionar o membro ao time
        team.members.push(memberId)

        // Adicionar ao registro de auditoria, salvamento automático
        Database.addAuditLog(Actions.ADD_MEMBER_TO_TEAM, { teamName: team.name, memberId })

        print('Membro adicionado à equipe com sucesso!')

        return true
    }

    public static removeMemberFromTeamV2(gameEvent: GameEvents, teamId: string, memberId: string) {
        const teams = Database.getEventTeams(gameEvent)
        const team = teams.find(t => t.id === teamId)

        // Time não encontrado
        if (!team)
            return false

        // Procurar o índice
        const memberIndex = team.members.indexOf(memberId)
        if (memberIndex < 0)
            return false

        // Remover o membro do time
        team.members.splice(memberIndex, 1)

        // Adicionar ao registro de auditoria, salvamento automático
        Database.addAuditLog(Actions.REMOVE_MEMBER_FROM_TEAM, { teamName: team.name, memberId })

        print('Membro removido da equipe com sucesso!')
    }


    public static setOrganizationName(newName: string): boolean {
        if (ReactiveData.organization === newName)
            return false

        // Atualizar o nome
        const oldName = ReactiveData.organization
        ReactiveData.organization = newName

        // Adicionar ao registro de auditoria, salvamento automático
        Database.addAuditLog(Actions.CHANGE_ORGANIZATION_NAME, { oldName, newName })

        print('Nome da organização alterado com sucesso!')

        return true
    }


    public static exportData() {
        const dataStr = JSON.stringify(ReactiveData, null, 4)
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
        const exportFileDefaultName = getExportFileName()

        // Executar o download
        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
    }

    public static importData(file: File) {
        const reader = new FileReader()
        reader.onload = function (e) {
            try {
                // @ts-ignore
                const importedData: DatabaseType = JSON.parse(e.target.result)

                // Validação básica
                if (!importedData.organization

                    || !Array.isArray(importedData.members)

                    || !importedData.events
                    || !Array.isArray(importedData.events.worldTree)
                    || !Array.isArray(importedData.events.minesInDungeon)
                    || !Array.isArray(importedData.events.cloudKingdom)
                    || !Array.isArray(importedData.events.cassinoOnYacht)

                    || !Array.isArray(importedData.auditLog)) {
                    throw new Error('Formato de arquivo inválido')
                }

                // Atualizar os dados
                if (confirm('Isso substituirá todos os dados atuais. Continuar?')) {
                    // Atualizar a partir da instancia
                    ReactiveData.organization = importedData.organization
                    ReactiveData.members = importedData.members
                    ReactiveData.events = importedData.events
                    ReactiveData.auditLog = importedData.auditLog

                    // Salvar os dados importados
                    Database.saveData()

                    print('Dados importados com sucesso!')
                }
            } catch (error: any) {
                const msg = 'Erro ao importar dados: ' + error.message

                console.error(msg)
                alert(msg)
            }
        }
        reader.readAsText(file)
    }


    public static getEventTeams(gameEvent: GameEvents): TeamType[] {
        switch (gameEvent) {
            case GameEvents.WORLD_TREE:
                return ReactiveData.events.worldTree
            case GameEvents.MINES_IN_DUNGEON:
                return ReactiveData.events.minesInDungeon
            case GameEvents.CLOUD_KINGDOM:
                return ReactiveData.events.cloudKingdom
            case GameEvents.CASSINO_ON_YACHT:
                return ReactiveData.events.cassinoOnYacht
            default:
                throw new Error('REACTIVE DATABASE ERROR: getEventTeams(), gameEvent invalido!', gameEvent)
        }
    }


    public static findMember(id: string | undefined): MemberType | undefined {
        if (!id)
            return undefined

        return ReactiveData.members.find(member => member.id === id)
    }

    public static findMemberToDisplay(id: string | undefined): string {
        const notFound = '404 - not found'
        if (!id)
            return notFound

        const member = Database.findMember(id)
        if (!member)
            return notFound

        return `${member.name} (${formatNumberCompact(member.power)})`
    }


    public static listFreeMembers(gameEvent: GameEvents): MemberType[] {
        const freeMembers = [...ReactiveData.members]
        const teams = Database.getEventTeams(gameEvent)

        for (const team of teams) {
            for (const teamMember of team.members) {

                for (let i = 0; i < freeMembers.length; i++) {
                    const member = freeMembers[i]

                    // Esse membro está disponível
                    if (member.id !== teamMember)
                        continue

                    // Remover o membro da array
                    freeMembers.splice(i, 1)
                }

            }
        }

        return freeMembers
    }


    public static listCommissionAvailableMembers(): MemberType[] {
        return [...ReactiveData.members].filter(member => {
            const state = member.commissions.state
            return state !== CommissionState.CLOSED && state !== CommissionState.INACTIVE
        })
    }

    public static listCommissionClosedMembers(): MemberType[] {
        return [...ReactiveData.members].filter(member => {
            const state = member.commissions.state
            return state === CommissionState.CLOSED
        })
    }

    public static listCommissionInactiveMembers(): MemberType[] {
        return [...ReactiveData.members].filter(member => {
            const state = member.commissions.state
            return state === CommissionState.INACTIVE
        })
    }


    public static setCommissionState(member: MemberType, state: CommissionState, time: boolean = true) {
        // Atualizar as informações
        member.commissions.state = state
        member.commissions.time = time ? currentUnixTime() : 0

        // Adicionar ao registro de auditoria, salvamento automático
        Database.addAuditLog(Actions.COMMISSION_SET_STATE, { memberId: member.id, name: member.name, state })
    }

    public static resetCommissionCycle() {
        for (const member of ReactiveData.members) {
            // Ignorar
            if (member.commissions.state === CommissionState.INACTIVE)
                continue

            member.commissions.state = CommissionState.AVAILABLE
            member.commissions.time = currentUnixTime()
        }

        // Adicionar ao registro de auditoria, salvamento automático
        Database.addAuditLog(Actions.COMMISSION_RESET_CYCLE, {})
    }



    public static editMember(id: string, newName: string, newPower: number | string): boolean {
        if (typeof newPower === 'string')
            newPower = parseCompactNumber(newPower)

        const member = Database.findMember(id)
        if (!member)
            return false

        member.name = newName
        member.power = newPower

        // Adicionar ao registro de auditoria, salvamento automático
        Database.addAuditLog(Actions.EDITED_MEMBER, { memberId: member.id, name: member.name, power: member.power })

        return true
    }

}