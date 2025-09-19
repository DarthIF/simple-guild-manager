import { type MemberTypeV3, type TeamTypeV2, type AuditLogDetailsV2, type DatabaseJsonType, UNDEFINED_TEAM } from '$lib/common/database/database-types'
import { Actions, CommissionState, GameEvents } from '$lib/common/database/enums'
import type { LocalDatabase } from '$lib/common/database/guild-database'
import { findMemberOf, findMemberIndex, findMemberWithIndex, forEachEvent, getEventTeam, hasTeamForEvent, getTeamForEvent, changeMemberCount } from '$lib/common/database/utils'
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
        const find = findMemberWithIndex(ReactiveDB, memberId)
        if (!find)
            return false

        const { index, member } = find

        // Primeiro atualizar os times que o membro estava
        changeMemberCount(getTeamForEvent(ReactiveDB, member, GameEvents.WORLD_TREE), -1)
        changeMemberCount(getTeamForEvent(ReactiveDB, member, GameEvents.MINES_IN_DUNGEON), -1)
        changeMemberCount(getTeamForEvent(ReactiveDB, member, GameEvents.CLOUD_KINGDOM), -1)
        changeMemberCount(getTeamForEvent(ReactiveDB, member, GameEvents.CASSINO_ON_YACHT), -1)

        // Remover o membro do banco de dados
        ReactiveDB.members.splice(index, 1)

        // Adicionar ao registro de auditoria, salvamento automático
        await this.addAuditLog(Actions.REMOVED_MEMBER, { name: member.name }, true)

        return true
    }

    editMember(memberId: string, newName: string, newPower: number, userName?: string): Promise<boolean> {
        throw new Error('Method not implemented.')
    }
    findMember(memberId: string): Promise<MemberTypeV3 | null> {
        throw new Error('Method not implemented.')
    }
    createTeam(gameEvent: GameEvents, name: string, userName?: string): Promise<boolean> {
        throw new Error('Method not implemented.')
    }
    deleteTeam(gameEvent: GameEvents, teamId: string, userName?: string): Promise<boolean> {
        throw new Error('Method not implemented.')
    }
    listTeams(gameEvent: GameEvents): Promise<TeamTypeV2[]> {
        throw new Error('Method not implemented.')
    }
    addMemberToTeam(gameEvent: GameEvents, teamId: string, memberId: string, userName?: string): Promise<boolean> {
        throw new Error('Method not implemented.')
    }
    removeMemberFromTeam(gameEvent: GameEvents, teamId: string, memberId: string, userName?: string): Promise<boolean> {
        throw new Error('Method not implemented.')
    }
    listFreeMembersForEvent(gameEvent: GameEvents): Promise<MemberTypeV3[]> {
        throw new Error('Method not implemented.')
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