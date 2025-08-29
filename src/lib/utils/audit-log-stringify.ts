import { getAppropriatedString } from "$lib/strings";
import { audit_logs } from "$lib/strings/strings";
import { Actions, Database, getCommissionStateString, type AuditLogType } from "./reactive-database.svelte";

export function auditToString(log: AuditLogType): string {
    const member = Database.findMember(log.details.memberId)
    const details = log.details
    const displayName = member ? member.name : details?.name || 'Desconhecido'



    switch (log.action) {
        case Actions.CHANGE_ORGANIZATION_NAME:
            return getAppropriatedString(audit_logs.change_organization_name, details.oldName, details.newName)

        case Actions.ADD_MEMBER:
            return getAppropriatedString(audit_logs.add_member, displayName, details.power)
        case Actions.REMOVED_MEMBER:
            return getAppropriatedString(audit_logs.removed_member, displayName)
        case Actions.EDITED_MEMBER:
            return getAppropriatedString(audit_logs.edited_member, displayName, details.power)

        case Actions.CREATE_TEAM:
            return getAppropriatedString(audit_logs.create_team, details.name)
        case Actions.DELETE_TEAM:
            return getAppropriatedString(audit_logs.delete_team, details.name)
        case Actions.ADD_MEMBER_TO_TEAM:
            return getAppropriatedString(audit_logs.add_member_to_team, displayName, details.teamName)
        case Actions.REMOVE_MEMBER_FROM_TEAM:
            return getAppropriatedString(audit_logs.remove_member_from_team, displayName, details.teamName)

        case Actions.COMMISSION_RESET_CYCLE:
            return getAppropriatedString(audit_logs.commission_reset_cycle)
        case Actions.COMMISSION_SET_STATE:
            const stateString = getCommissionStateString(details.state)
            return getAppropriatedString(audit_logs.commission_set_state, displayName, stateString)
    }

    return JSON.stringify(log)
}