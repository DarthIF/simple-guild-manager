import type { LocalDatabase } from '$lib/common/database/guild-database'
import { type MemberTypeV3, type TeamTypeV2, type AuditLogDetailsV2, type DatabaseJsonType, UNDEFINED_TEAM } from '$lib/common/database/database-types'
import { Actions, CommissionState, GameEvents } from '$lib/common/database/enums'
import { findMemberByID, findMemberAndIndex, getTeamOfMember, changeMemberCount, getEventTeamsArray, setTeamForMember, getTeamIdOfMember, isUndefinedTeamID } from '$lib/common/database/utils'
import { currentUnixTime } from '$lib/utils/time-util'
import { createDefaultData, ReactiveDB } from './reactive-database.svelte'


const LOCAL_STORAGE_KEY_V0 = 'team-creator'
const LOCAL_STORAGE_KEY_V1 = 'guild-manager-local'


// Remover as versões antigas
localStorage.removeItem(LOCAL_STORAGE_KEY_V0)


class BrowserDatabaseImpl implements LocalDatabase {

    public async loadData(): Promise<boolean> {
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
        await this.addAuditLog(Actions.SET_GUILD_NAME, { oldName, newName }, true)

        return true
    }



    public async addMember(name: string, power: number): Promise<boolean> {
        if (!name || isNaN(power))
            return false

        // Adicionar o membro
        ReactiveDB.members.push({
            id: currentUnixTime().toString(),
            name: name,
            power: power,

            state: CommissionState.AVAILABLE,
            time: 0,
            missed: 0,

            worldTree: UNDEFINED_TEAM,
            minesInDungeon: UNDEFINED_TEAM,
            cloudKingdom: UNDEFINED_TEAM,
            cassinoOnYacht: UNDEFINED_TEAM,
        })

        // Adicionar ao registro de auditoria, salvamento automático
        await this.addAuditLog(Actions.ADD_MEMBER, { name, power }, true)

        return true
    }

    public async deleteMember(memberId: string): Promise<boolean> {
        const find = findMemberAndIndex(ReactiveDB, memberId)
        if (!find)
            return false

        const { index, member } = find

        // Primeiro atualizar os times que o membro estava
        changeMemberCount(getTeamOfMember(ReactiveDB, member, GameEvents.WORLD_TREE), -1)
        changeMemberCount(getTeamOfMember(ReactiveDB, member, GameEvents.MINES_IN_DUNGEON), -1)
        changeMemberCount(getTeamOfMember(ReactiveDB, member, GameEvents.CLOUD_KINGDOM), -1)
        changeMemberCount(getTeamOfMember(ReactiveDB, member, GameEvents.CASSINO_ON_YACHT), -1)

        // Remover o membro do banco de dados
        ReactiveDB.members.splice(index, 1)

        // Adicionar ao registro de auditoria, salvamento automático
        await this.addAuditLog(Actions.REMOVED_MEMBER, { name: member.name }, true)

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
        await this.addAuditLog(Actions.EDITED_MEMBER, { memberId, oldName, oldPower, newName, newPower }, true)

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
        getEventTeamsArray(ReactiveDB, gameEvent).push({
            id,
            name,
            count: 0,
            size: 4
        })

        // Adicionar ao registro de auditoria, salvamento automático
        await this.addAuditLog(Actions.CREATE_TEAM, { gameEvent, teamId: id, teamName: name }, true)

        return true
    }

    public async deleteTeam(gameEvent: GameEvents, teamId: string): Promise<boolean> {
        const teams = getEventTeamsArray(ReactiveDB, gameEvent)
        const index = teams.findIndex(team => team.id === teamId)

        if (index < 0)
            return false

        // Salvar a referencia
        const team = teams[index]

        // Deletar o time 
        teams.splice(index, 1)

        // Adicionar ao registro de auditoria, salvamento automático
        await this.addAuditLog(Actions.DELETE_TEAM, { teamName: team.name }, true)

        return true
    }

    public async listTeams(gameEvent: GameEvents): Promise<TeamTypeV2[]> {
        return getEventTeamsArray(ReactiveDB, gameEvent)
    }

    public async addMemberToTeam(gameEvent: GameEvents, teamId: string, memberId: string): Promise<boolean> {
        const teams = getEventTeamsArray(ReactiveDB, gameEvent)
        const team = teams.find(t => t.id === teamId)
        const member = findMemberByID(ReactiveDB, memberId)

        if (!team || !member)
            return false

        if (team.count >= team.size)
            return false

        team.count++
        setTeamForMember(member, gameEvent, teamId)

        return true
    }

    public async removeMemberFromTeam(gameEvent: GameEvents, teamId: string, memberId: string, userName?: string): Promise<boolean> {
        const teams = getEventTeamsArray(ReactiveDB, gameEvent)
        const team = teams.find(t => t.id === teamId)
        const member = findMemberByID(ReactiveDB, memberId)

        if (member) {
            // Remover o membro do time
            setTeamForMember(member, gameEvent, UNDEFINED_TEAM)

            // Reduzir a quantia de membros do time
            if (team)
                team.count--

            return true
        }

        // O membro não foi encontrado???
        return false
    }

    public async listFreeMembersForEvent(gameEvent: GameEvents): Promise<MemberTypeV3[]> {
        const freeMembers = new Array<MemberTypeV3>()

        for (const member of ReactiveDB.members) {
            const teamId = getTeamIdOfMember(member, gameEvent)

            if (isUndefinedTeamID(teamId))
                freeMembers.push(member)
        }

        return freeMembers
    }



    setCommissionState(memberId: string, state: CommissionState, updateTime: boolean, userName?: string): Promise<boolean> {
        throw new Error('Method not implemented.')
    }
    resetCommissionCycle(userName?: string): Promise<boolean> {
        throw new Error('Method not implemented.')
    }
    listCommissionMembers(state: CommissionState): Promise<MemberTypeV3[]> {
        throw new Error('Method not implemented.')
    }
    importData(file: File): Promise<boolean> {
        throw new Error('Method not implemented.')
    }
    exportData(): Promise<boolean> {
        throw new Error('Method not implemented.')
    }
    addAuditLog(action: Actions, details: AuditLogDetailsV2, autoSave: boolean, userName?: string): Promise<boolean> {
        throw new Error('Method not implemented.')
    }
}


export const BrowserDatabase = new BrowserDatabaseImpl()