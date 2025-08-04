import { formatNumberCompact } from "./number-util"


export type DatabaseType = {
    organization: string
    members: MemberType[]
    events: EventsType
    commissions: CommissionsType
    auditLog: AuditLogType[]
}

export type MemberType = {
    id: string
    name: string
    power: number
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
    excluded: string[]
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
}

export enum Actions {
    ADD_MEMBER = 'add_member',
    REMOVE_MEMBER = 'remove_member',
    CREATE_TEAM = 'create_team',
    DELETE_TEAM = 'delete_team',
    ADD_MEMBER_TO_TEAM = 'add_member_to_team',
    REMOVE_MEMBER_FROM_TEAM = 'remove_member_from_team',
    CHANGE_ORGANIZATION_NAME = 'change_org_name',
}

export enum GameEvents {
    WORLD_TREE = 'world_tree',
    MINES_IN_DUNGEON = 'mines_in_dungeon',
    CLOUD_KINGDOM = 'cloud_kingdom',
    CASSINO_ON_YACHT = 'cassino_on_yacht'
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
    commissions: {
        excluded: [],
        closed: []
    },
    auditLog: [],
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
        ReactiveData.commissions = data.commissions || DEFAULT.commissions
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
            this.saveData()
    }

    public static addMember(name: string, power: number): boolean {
        if (!name || isNaN(power)) {
            print('Erro ao adicionar membro.', { name, power })
            return false
        }

        // Adicionar o membro
        ReactiveData.members = [...ReactiveData.members, {
            id: Date.now().toString(),
            name,
            power
        }]

        // Adicionar ao registro de auditoria, salvamento automático
        this.addAuditLog(Actions.ADD_MEMBER, { name, power })

        print('Membro adicionado com sucesso!', { name, power })

        return true
    }

    public static deleteMember(index: number) {
        const member = ReactiveData.members[index]

        // Primeiro remover o membro dos times
        forEachEvent(eventTeams => {
            eventTeams.forEach(team => {
                const memberIndex = team.members.indexOf(member.id)
                if (memberIndex !== -1) {
                    // Remove o membro do time
                    team.members.splice(memberIndex, 1)

                    // Adicionar o registro de auditoria
                    this.addAuditLog(Actions.REMOVE_MEMBER_FROM_TEAM, { teamName: team.name, memberId: member.id }, false)
                }
            })
        })

        // Remover o membro do banco de dados
        ReactiveData.members.splice(index, 1)

        // Adicionar ao registro de auditoria, salvamento automático
        this.addAuditLog(Actions.REMOVE_MEMBER, { name: member.name })

        print('Membro removido com sucesso!', member)
    }


    public static addTeam(gameEvent: GameEvents, name: string): boolean {
        if (!name)
            return false

        // Adicionar o novo time
        this.getEventTeams(gameEvent).push({
            id: Date.now().toString(),
            name,
            members: []
        })

        // Adicionar ao registro de auditoria, salvamento automático
        this.addAuditLog(Actions.CREATE_TEAM, { gameEvent, name })

        print('Equipe criada com sucesso!')

        return true
    }

    public static deleteTeamByIndex(gameEvent: GameEvents, index: number) {
        const teams = this.getEventTeams(gameEvent)
        const team = teams[index]

        // Deletar o time 
        teams.splice(index, 1)

        // Adicionar ao registro de auditoria, salvamento automático
        this.addAuditLog(Actions.DELETE_TEAM, { name: team.name })

        print('Equipe removida com sucesso!')
    }

    public static deleteTeam(gameEvent: GameEvents, team: TeamType): boolean {
        const teams = this.getEventTeams(gameEvent)
        const index = teams.indexOf(team)

        if (index < 0)
            return false

        Database.deleteTeamByIndex(gameEvent, index)
        return true
    }


    public static addMemberToTeamV2(gameEvent: GameEvents, teamId: string, memberId: string) {
        const teams = this.getEventTeams(gameEvent)
        const team = teams.find(t => t.id === teamId)

        // Time não encontrado ou cheio
        if (!team || team.members.length >= 4)
            return false

        // Adicionar o membro ao time
        team.members.push(memberId)

        // Adicionar ao registro de auditoria, salvamento automático
        this.addAuditLog(Actions.ADD_MEMBER_TO_TEAM, { teamName: team.name, memberId })

        print('Membro adicionado à equipe com sucesso!')

        return true
    }

    public static removeMemberFromTeamV2(gameEvent: GameEvents, teamId: string, memberId: string) {
        const teams = this.getEventTeams(gameEvent)
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
        this.addAuditLog(Actions.REMOVE_MEMBER_FROM_TEAM, { teamName: team.name, memberId })

        print('Membro removido da equipe com sucesso!')
    }


    public static setOrganizationName(newName: string): boolean {
        if (ReactiveData.organization === newName)
            return false

        // Atualizar o nome
        const oldName = ReactiveData.organization
        ReactiveData.organization = newName

        // Adicionar ao registro de auditoria, salvamento automático
        this.addAuditLog(Actions.CHANGE_ORGANIZATION_NAME, { oldName, newName })

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

    public static importData(file: any) {
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

                    || !importedData.commissions
                    || !Array.isArray(importedData.commissions.excluded)
                    || !Array.isArray(importedData.commissions.closed)

                    || !Array.isArray(importedData.auditLog)) {
                    throw new Error('Formato de arquivo inválido')
                }

                // Atualizar os dados
                if (confirm('Isso substituirá todos os dados atuais. Continuar?')) {
                    // Atualizar a partir da instancia
                    ReactiveData.organization = importedData.organization
                    ReactiveData.members = importedData.members
                    ReactiveData.events = importedData.events
                    ReactiveData.commissions = importedData.commissions
                    ReactiveData.auditLog = importedData.auditLog

                    print('Dados importados com sucesso!')
                }
            } catch (error: any) {
                console.error('Erro ao importar dados: ' + error.message)
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


    public static findMember(id: string | undefined) {
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
        const teams = this.getEventTeams(gameEvent)

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
            const closed = ReactiveData.commissions.closed.includes(member.id)
            const excluded = ReactiveData.commissions.excluded.includes(member.id)

            return !closed && !excluded
        })
    }

    public static listCommissionClosedMembers(): MemberType[] {
        return [...ReactiveData.members].filter(member => {
            return ReactiveData.commissions.closed.includes(member.id)
        })
    }

    public static listCommissionExcludedMembers(): MemberType[] {
        return [...ReactiveData.members].filter(member => {
            return ReactiveData.commissions.excluded.includes(member.id)
        })
    }




}