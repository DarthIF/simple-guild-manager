import type { AuditLogDetails, MemberType, TeamType } from './database-types'


export interface GuildDatabase {

    addMember(name: string, power: number): void

    deleteMember(member: MemberType, index: number): void


    createTeam(gameEvent: GameEvents, name: string): void

    deleteTeam(gameEvent: GameEvents, team: TeamType): void

    deleteTeamByIndex(gameEvent: GameEvents, index: number): void


    addMemberToTeam(gameEvent: GameEvents, teamId: string, memberId: string): void

    removeMemberFromTeamV2(gameEvent: GameEvents, teamId: string, memberId: string): void


    setOrganizationName(newName: string): void


    findMember(id: string | undefined): MemberType | undefined

    editMember(id: string, newName: string, newPower: number | string): boolean


    listFreeMembersForEvent(gameEvent: GameEvents): MemberType[]

    listCommissionAvailableMembers(): MemberType[]

    listCommissionClosedMembers(): MemberType[]

    listCommissionInactiveMembers(): MemberType[]


    setCommissionState(member: MemberType, state: CommissionState, time: boolean): void

    resetCommissionCycle(): void


    importData(file: File): void

    exportData(): void


    loadData(): void

    saveData(): void


    addAuditLog(action: Actions, details: AuditLogDetails, autoSave: boolean, userName?: string): void

}


export enum Actions {
    CHANGE_ORGANIZATION_NAME = 'con',

    ADD_MEMBER = 'am',
    REMOVED_MEMBER = 'rm',
    EDITED_MEMBER = 'em',

    CREATE_TEAM = 'ct',
    DELETE_TEAM = 'dt',
    ADD_MEMBER_TO_TEAM = 'amt',
    REMOVE_MEMBER_FROM_TEAM = 'rmt',

    COMMISSION_SET_STATE = 'css',
    COMMISSION_RESET_CYCLE = 'crc',
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