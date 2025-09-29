import type { AuditLogDetailsV3, EventTeamType, MemberTypeV3 } from './constants-and-types'
import type { Actions, CommissionState, GameEvents } from './enums'


/**
 * Interface com as funções básicas envolvendo membros da guilda
 */
export interface DatabaseOperations {

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
    addMember(name: string, power: number, userName?: string): Promise<MemberTypeV3 | null>
    /**
     * Remove o membro da guilda
     * 
     * @param memberId 
     * @param userName 
     */
    deleteMember(memberId: string, userName?: string): Promise<boolean>
    /**
     * Edita o nome e o poder de um membro
     * 
     * @param memberId 
     * @param newName 
     * @param newPower 
     * @param userName 
     */
    editMember(memberId: string, newName: string, newPower: number, userName?: string): Promise<MemberTypeV3 | null>
    /**
     * Procura por um membro que tenha o id fornecido
     * 
     * @param id 
     */
    findMember(memberId: string): Promise<MemberTypeV3 | null>


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
     * Lista todos os times do evento em uma **NOVA** lista
     * 
     * @param gameEvent 
     */
    listTeams(gameEvent: GameEvents): Promise<EventTeamType[]>
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
    /**
     * Retorna uma lista com os membros que estão com o {@link CommissionState} fornecido
     * 
     * @param state 
     */
    listCommissionMembers(state: CommissionState): Promise<MemberTypeV3[]>

}

/**
 * Funções de importar e exportar o banco de dados
 */
export interface DatabaseEditor {

    importData(file: File): Promise<boolean>

    exportData(): boolean

}

/**
 * Usado por um banco de dados que registra as alterações
 */
export interface DatabaseAuditLog {

    addAuditLog(action: Actions, details: AuditLogDetailsV3, userName?: string): Promise<boolean>

}


/**
 * Interface para a execução do banco de dados dentro do navegador
 */
export interface LocalDatabase extends DatabaseOperations, DatabaseEditor, DatabaseAuditLog {

    loadData(): Promise<boolean>

    saveData(): Promise<boolean>

}  