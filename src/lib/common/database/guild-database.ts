import type { AuditLogDetailsV2, MemberTypeV3 } from './database-types'
import type { Actions, CommissionState, GameEvents } from './enums'


export interface GuildDatabase {

    /**
     * Muda o nome da Guilda
     * 
     * @param newName 
     * @param userName 
     */
    setGuildName(newName: string, userName?: string): Promise<boolean>


    /**
     * Adiciona um membro a guilda
     * 
     * @param name 
     * @param power 
     * @param userName 
     */
    addMember(name: string, power: number, userName?: string): Promise<boolean>
    /**
     * Remove o membro da guilda
     * 
     * @param memberId 
     * @param userName 
     */
    deleteMember(memberId: string, userName?: string): Promise<boolean>


    /**
     * Cria uma equipe para um evento
     * 
     * @param gameEvent 
     * @param name 
     * @param userName 
     */
    createTeam(gameEvent: GameEvents, name: string, userName?: string): Promise<boolean>
    /**
     * Apaga a equipe de um evento
     * 
     * @param gameEvent 
     * @param teamId 
     * @param userName 
     */
    deleteTeam(gameEvent: GameEvents, teamId: string, userName?: string): Promise<boolean>
    /**
     * Adiciona um membro a uma equipe de um evento
     * 
     * @param gameEvent 
     * @param teamId 
     * @param memberId 
     * @param userName 
     */
    addMemberToTeam(gameEvent: GameEvents, teamId: string, memberId: string, userName?: string): Promise<boolean>
    /**
     * Remove um membro de uma equipe de um evento
     * 
     * @param gameEvent 
     * @param teamId 
     * @param memberId 
     * @param userName 
     */
    removeMemberFromTeam(gameEvent: GameEvents, teamId: string, memberId: string, userName?: string): Promise<boolean>
    /**
     * Lista os membros sem equipes para um evento
     * 
     * @param gameEvent 
     */
    listFreeMembersForEvent(gameEvent: GameEvents): Promise<MemberTypeV3[]>


    /**
     * Define em qual grupo de comissão o membro está
     * 
     * @param memberId 
     * @param state 
     * @param updateTime 
     * @param userName 
     */
    setCommissionState(memberId: string, state: CommissionState, updateTime: boolean, userName?: string): Promise<boolean>
    /**
     * Reinicia o ciclo de comissões
     * 
     * @param userName 
     */
    resetCommissionCycle(userName?: string): Promise<boolean>

    listCommissionAvailableMembers(): Promise<MemberTypeV3[]>
    listCommissionClosedMembers(): Promise<MemberTypeV3[]>
    listCommissionInactiveMembers(): Promise<MemberTypeV3[]>


    findMember(id: string | undefined): Promise<MemberTypeV3 | undefined>
    editMember(id: string, newName: string, newPower: number | string, userName?: string): Promise<boolean>

}

export interface DatabaseEditor {

    importData(file: File): Promise<boolean>
    exportData(): Promise<boolean>

    loadData(): Promise<boolean>
    saveData(): Promise<boolean>

}

export interface DatabaseAuditLog {

    addAuditLog(action: Actions, details: AuditLogDetailsV2, autoSave: boolean, userName?: string): Promise<boolean>

}
