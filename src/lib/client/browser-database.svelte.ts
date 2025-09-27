import type { LocalDatabase } from '$lib/common/database/database-interfaces'
import { UNDEFINED_TEAM, validadeDatabaseJson, type MemberTypeV3, type DatabaseJsonType, type AuditLogDetailsV3, type EventTeamType } from '$lib/common/database/constants-and-types'
import { Actions, CommissionState, GameEvents } from '$lib/common/database/enums'
import { findMemberByID, getMemberTeam, modifyTeamCount, setMemberTeamId, getMemberTeamId, isUndefinedTeamID, findMemberIndexByID, getEventTeams, findEventTeamIndex, getEventTeam } from '$lib/common/database/utils'
import { currentUnixTime } from '$lib/utils/time-util'
import { createDefaultData, ReactiveDB } from './reactive-database.svelte'
import { downloadJsonFile, readFileAsString } from '$lib/utils/file-utils'
import { getAppropriatedString } from '$lib/strings'
import { database_strings } from '$lib/strings/strings'
import { LOCAL_STORAGE_KEY_V1, updateOldVersions } from '$lib/common/database/updater'


class BrowserDatabaseImpl implements LocalDatabase {

    public async loadData(): Promise<boolean> {
        // Atualizar as versões antigas
        updateOldVersions()

        const DEFAULT = createDefaultData()
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY_V1)
        const data: DatabaseJsonType = localData ? JSON.parse(localData) : DEFAULT

        // Carregar as informações de cada variável
        ReactiveDB.version = data.version || DEFAULT.version
        ReactiveDB.definitions = data.definitions || DEFAULT.definitions
        ReactiveDB.members = data.members || DEFAULT.members
        ReactiveDB.events = data.events || DEFAULT.events
        ReactiveDB.auditLog = data.auditLog || DEFAULT.auditLog

        return true
    }

    public async saveData(): Promise<boolean> {
        const backup = JSON.stringify(ReactiveDB)

        // Salvar o backup
        localStorage.setItem(LOCAL_STORAGE_KEY_V1, backup)

        return true
    }



    public async setGuildName(newName: string): Promise<boolean> {
        if (ReactiveDB.definitions.guild === newName)
            return false

        // Atualizar o nome
        const oldName = ReactiveDB.definitions.guild
        ReactiveDB.definitions.guild = newName

        // Adicionar ao registro de auditoria, salvamento automático
        await this.addAuditLog(Actions.SET_GUILD_NAME, { oldName, newName })

        return true
    }



    public async addMember(name: string, power: number): Promise<boolean> {
        if (!name || isNaN(power))
            return false

        // Adicionar o membro
        const id = currentUnixTime().toString()
        ReactiveDB.members.push({
            id,
            name,
            power,

            state: CommissionState.AVAILABLE,
            time: 0,
            missed: 0,

            worldTree: UNDEFINED_TEAM,
            minesInDungeon: UNDEFINED_TEAM,
            cloudKingdom: UNDEFINED_TEAM,
            cassinoOnYacht: UNDEFINED_TEAM,
        })

        // Adicionar ao registro de auditoria, salvamento automático
        await this.addAuditLog(Actions.ADD_MEMBER, { memberId: id, name, power })

        return true
    }

    public async deleteMember(memberId: string): Promise<boolean> {
        const index = findMemberIndexByID(ReactiveDB, memberId)
        if (index < 0)
            return false

        const member = ReactiveDB.members[index]

        // Primeiro atualizar os times que o membro estava
        modifyTeamCount(getMemberTeam(ReactiveDB, member, GameEvents.WORLD_TREE), -1)
        modifyTeamCount(getMemberTeam(ReactiveDB, member, GameEvents.MINES_IN_DUNGEON), -1)
        modifyTeamCount(getMemberTeam(ReactiveDB, member, GameEvents.CLOUD_KINGDOM), -1)
        modifyTeamCount(getMemberTeam(ReactiveDB, member, GameEvents.CASSINO_ON_YACHT), -1)

        // Remover o membro do banco de dados
        ReactiveDB.members.splice(index, 1)

        // Adicionar ao registro de auditoria, salvamento automático
        await this.addAuditLog(Actions.DELETE_MEMBER, { name: member.name })

        return true
    }

    public async editMember(memberId: string, newName: string, newPower: number): Promise<boolean> {
        const member = findMemberByID(ReactiveDB, memberId)
        if (!member)
            return false

        // Salvar os valores anteriores
        const oldName = member.name
        const oldPower = member.power

        // Atualizar a informação
        member.name = newName
        member.power = newPower

        // Adicionar ao registro de auditoria, salvamento automático
        await this.addAuditLog(Actions.EDIT_MEMBER, { memberId, oldName, oldPower, newName, newPower })

        return true
    }

    public async findMember(memberId: string): Promise<MemberTypeV3 | null> {
        const member = findMemberByID(ReactiveDB, memberId)
        return member ? member : null
    }



    public async createTeam(gameEvent: GameEvents, name: string): Promise<boolean> {
        if (!name || name.length < 0)
            return false

        // Adicionar o novo time
        const id = currentUnixTime().toString()
        ReactiveDB.events.push({
            event: gameEvent,
            id,
            name,
            count: 0,
            size: 4
        })

        // Adicionar ao registro de auditoria, salvamento automático
        await this.addAuditLog(Actions.CREATE_TEAM, { gameEvent, teamId: id, teamName: name })

        return true
    }

    public async deleteTeam(gameEvent: GameEvents, teamId: string): Promise<boolean> {
        const index = findEventTeamIndex(ReactiveDB, gameEvent, teamId)

        if (index < 0)
            return false

        // Deletar o time
        ReactiveDB.events.splice(index, 1)

        // Adicionar ao registro de auditoria, salvamento automático
        await this.addAuditLog(Actions.DELETE_TEAM, { gameEvent, teamId })

        return true
    }

    public async listTeams(gameEvent: GameEvents): Promise<EventTeamType[]> {
        return getEventTeams(ReactiveDB, gameEvent)
    }

    public async addMemberToTeam(gameEvent: GameEvents, teamId: string, memberId: string): Promise<boolean> {
        const team = getEventTeam(ReactiveDB, gameEvent, teamId)
        const member = findMemberByID(ReactiveDB, memberId)

        // Membro ou equipe inválidos
        if (!team || !member)
            return false

        // A equipe está cheia
        if (team.count >= team.size)
            return false

        // Atualizar a informação
        team.count++
        setMemberTeamId(member, gameEvent, teamId)

        // Adicionar ao registro de auditoria, salvamento automático
        await this.addAuditLog(Actions.ADD_MEMBER_TO_TEAM, { gameEvent, teamId, memberId })

        return true
    }

    public async removeMemberFromTeam(gameEvent: GameEvents, teamId: string, memberId: string, userName?: string): Promise<boolean> {
        const team = getEventTeam(ReactiveDB, gameEvent, teamId)
        const member = findMemberByID(ReactiveDB, memberId)

        // O membro não foi encontrado???
        if (!member)
            return false

        // Remover o membro do time
        setMemberTeamId(member, gameEvent, UNDEFINED_TEAM)

        // Reduzir a quantia de membros do time
        if (team)
            team.count--

        // Adicionar ao registro de auditoria, salvamento automático
        await this.addAuditLog(Actions.REMOVE_MEMBER_FROM_TEAM, { gameEvent, teamId, memberId })

        return true
    }

    public async listFreeMembersForEvent(gameEvent: GameEvents): Promise<MemberTypeV3[]> {
        const freeMembers = new Array<MemberTypeV3>()

        for (const member of ReactiveDB.members) {
            const teamId = getMemberTeamId(member, gameEvent)

            if (isUndefinedTeamID(teamId))
                freeMembers.push(member)
        }

        return freeMembers
    }



    public async setCommissionState(memberId: string, state: CommissionState, updateTime: boolean): Promise<boolean> {
        const member = findMemberByID(ReactiveDB, memberId)

        if (!member)
            return false

        member.state = state

        if (updateTime)
            member.time = currentUnixTime()


        // Adicionar ao registro de auditoria, salvamento automático
        await this.addAuditLog(Actions.COMMISSION_SET_STATE, { memberId, state })

        return true
    }

    public async resetCommissionCycle(): Promise<boolean> {
        for (const member of ReactiveDB.members) {
            if (member.state !== CommissionState.AVAILABLE && member.state !== CommissionState.CLOSED)
                continue

            member.state = CommissionState.AVAILABLE
            member.time = 0
        }

        // Adicionar ao registro de auditoria, salvamento automático
        await this.addAuditLog(Actions.COMMISSION_RESET_CYCLE, {})

        return true
    }

    public async listCommissionMembers(state: CommissionState): Promise<MemberTypeV3[]> {
        const result = new Array<MemberTypeV3>()
        for (const member of ReactiveDB.members) {
            if (member.state === state)
                result.push(member)
        }

        return result
    }



    public async importData(file: File): Promise<boolean> {
        try {
            const content = await readFileAsString(file)
            if (!content)
                return false

            const data: DatabaseJsonType = JSON.parse(content)

            // Validação básica
            if (!validadeDatabaseJson(data)) {
                console.error('Formato de arquivo invalido')
                return false
            }

            // Atualizar os dados
            if (confirm(getAppropriatedString(database_strings.import_message))) {
                ReactiveDB.version = data.version
                ReactiveDB.definitions = data.definitions
                ReactiveDB.members = data.members
                ReactiveDB.events = data.events
                ReactiveDB.auditLog = data.auditLog

                // Salvar os dados importados
                return await this.saveData()
            }
        } catch (e) {
            console.error(e)
        }

        return false
    }

    public exportData(): boolean {
        const fileName = '.json'
        const jsonFile = JSON.stringify(ReactiveDB, null, 4)

        downloadJsonFile(fileName, jsonFile)

        return true
    }



    public async addAuditLog(action: Actions, details: AuditLogDetailsV3): Promise<boolean> {
        const unixTime = currentUnixTime()

        ReactiveDB.auditLog.push({ unixTime, action, details })

        // Salvamento automático
        this.saveData()

        return true
    }

}


export const BrowserDatabase = new BrowserDatabaseImpl()