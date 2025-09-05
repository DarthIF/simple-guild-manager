import type { AuditLogDetails, MemberType, TeamType } from './database-types'
import type { Actions, CommissionState, GameEvents } from './enums'


export interface GuildDatabase {

    addMember(name: string, power: number, userName?:string): Promise<boolean>
    deleteMember(member: MemberType, userName?:string): Promise<boolean>

    createTeam(gameEvent: GameEvents, name: string, userName?:string): Promise<boolean>
    deleteTeam(gameEvent: GameEvents, team: TeamType, userName?:string): Promise<boolean>
    addMemberToTeam(gameEvent: GameEvents, teamId: string, memberId: string, userName?:string): Promise<boolean>
    removeMemberFromTeam(gameEvent: GameEvents, teamId: string, memberId: string, userName?:string): Promise<boolean>

    setOrganizationName(newName: string, userName?:string): Promise<boolean>

    findMember(id: string | undefined ): Promise<MemberType | undefined>
    editMember(id: string, newName: string, newPower: number | string, userName?:string): Promise<boolean>

    listFreeMembersForEvent(gameEvent: GameEvents): Promise<MemberType[]>
    listCommissionAvailableMembers(): Promise<MemberType[]>
    listCommissionClosedMembers(): Promise<MemberType[]>
    listCommissionInactiveMembers(): Promise<MemberType[]>

    setCommissionState(member: MemberType, state: CommissionState, time: boolean, userName?:string): Promise<boolean>
    resetCommissionCycle(  userName?:string): Promise<boolean>

    importData(file: File): Promise<boolean>
    exportData(): Promise<boolean>

    loadData(): Promise<boolean>
    saveData(): Promise<boolean>

    addAuditLog(action: Actions, details: AuditLogDetails, autoSave: boolean, userName?: string): Promise<boolean>

}
