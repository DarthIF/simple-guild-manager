import { Actions, Database, type AuditLogType, type MemberType } from "./reactive-database.svelte";

export function auditToString(log: AuditLogType): string {
    const member = Database.findMember(log.details.memberId)
    const displayName = member ? member.name : 'Desconhecido'

    switch (log.action) {
        case Actions.CHANGE_ORGANIZATION_NAME:
            return `Nome da organização alterado de "${log.details.oldName}" para "${log.details.newName}"`
        case Actions.ADD_MEMBER:
            return `Membro adicionado: ${log.details.name} (Poder: ${log.details.power})`
        case Actions.REMOVE_MEMBER:
            return `Membro removido: ${log.details.name}`
        case Actions.CREATE_TEAM:
            return `Equipe criada: ${log.details.name}`
        case Actions.DELETE_TEAM:
            return `Equipe apagada: ${log.details.name}`
        case Actions.ADD_MEMBER_TO_TEAM:
            return `Membro ${displayName} adicionado à equipe ${log.details.teamName}`
        case Actions.REMOVE_MEMBER_FROM_TEAM:
            return `Membro ${displayName} removido da equipe ${log.details.teamName}`
        case Actions.COMMISSION_ADD_CLOSED:
            return `Membro ${displayName} fechou as comissões diárias`
        case Actions.COMMISSION_REMOVE_CLOSED:
            return `Membro ${displayName} foi removido da lista de comissões fechadas`
        case Actions.COMMISSION_ADD_EXCLUDED:
            return `Membro ${displayName} foi removido da fila para fechar as comissões`
        case Actions.COMMISSION_REMOVE_EXCLUDED:
            return `Membro ${displayName} foi incluído novamente na fila para fechar as comissões`
        case Actions.COMMISSION_RESET_CYCLE:
            return `O ciclo das comissões foi reiniciado.`
    }

    return JSON.stringify(log)
}