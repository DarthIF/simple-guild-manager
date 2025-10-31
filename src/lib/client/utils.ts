import type { EventTeamType, AuditLogTypeV3 } from '$lib/common/database/constants-and-types'
import { getMemberTeamId } from '$lib/common/database/utils'
import { formatNumberCompact } from '$lib/utils/number-util'
import { ReactiveDB } from './reactive-database.svelte'
import { CommissionState, Actions } from "$lib/common/database/enums"
import { basic, database_strings, fragment_commissions } from "$lib/strings/strings"
import { getAppropriatedString } from "$lib/strings"
import { Fragments, FragmentsParams, getNavigateURL } from "$lib/components/fragments/fragments"


export function calculateTeamPower(team: EventTeamType): number {
    let total = 0
    for (const member of ReactiveDB.members) {
        const memberTeam = getMemberTeamId(member, team.event)

        if (memberTeam && memberTeam === team.id)
            total += member.power
    }

    return total
}

export function calculateTeamPowerCompact(team: EventTeamType | null | undefined): string {
    if (!team)
        return '0'

    const power = calculateTeamPower(team)
    return formatNumberCompact(power)
}

export function getCommissionStateString(state: CommissionState) {
    switch (state) {
        case CommissionState.AVAILABLE:
            return database_strings.commission_state_available
        case CommissionState.CLOSED:
            return database_strings.commission_state_closed
        case CommissionState.INACTIVE:
            return database_strings.commission_state_inactive
        default:
            return basic.undefined
    }
}

export function getDateOrLastClosedString(state: CommissionState, time: number) {
    const dateString = new Date(time).toLocaleDateString()

    if (state === CommissionState.CLOSED)
        return getAppropriatedString(fragment_commissions.last_closed, dateString)

    return getAppropriatedString(fragment_commissions.date, dateString)
}



// AuditLog -------------------------------------


type AuditLogMessageResolverFunction = (item: AuditLogTypeV3) => string


export const AuditLogMessages = new Map<Actions, AuditLogMessageResolverFunction>()



function resolveUsername(item: AuditLogTypeV3) {
    if (item.user)
        return item.user

    return getAppropriatedString(basic.you)
}

function resolveMember(memberId: string | undefined) {
    if (!memberId)
        return undefined

    return ReactiveDB.members.find(m => m.id === memberId)
}

function resolveTeam(gameEvent: string | undefined, teamId: string | undefined) {
    if (!gameEvent || !teamId)
        return undefined

    return ReactiveDB.events.find(t => t.event === gameEvent && t.id === teamId)
}

function crateAnchor_ManageTeams(gameEvent: string | undefined) {
    if (!gameEvent)
        return '?'

    const base = gameEvent.replaceAll('_', ' ')
    const text = base[0].toUpperCase() + base.substring(1)
    const href = `#${Fragments.MANAGE_TEAMS}&${gameEvent}`

    return `<a href="${href}">${text}</a>`
}



AuditLogMessages.set(Actions.SET_GUILD_NAME, item => {
    const user = resolveUsername(item)

    return getAppropriatedString(database_strings.log_set_guild_name,
        // Variáveis para formatar 
        user, item.details.newName
    )
})


AuditLogMessages.set(Actions.ADD_MEMBER, item => {
    const user = resolveUsername(item)
    const memberName = item.details.name || '?'

    return getAppropriatedString(database_strings.log_add_member,
        // Variáveis para formatar 
        user,
        memberName
    )
})
AuditLogMessages.set(Actions.DELETE_MEMBER, item => {
    const user = resolveUsername(item)
    const memberName = item.details.name || '?'

    return getAppropriatedString(database_strings.log_delete_member,
        // Variáveis para formatar 
        user,
        memberName
    )
})
AuditLogMessages.set(Actions.EDIT_MEMBER, item => {
    const user = resolveUsername(item)
    const memberName = item.details.newName || '?'

    return getAppropriatedString(database_strings.log_edit_member,
        // Variáveis para formatar 
        user,
        memberName
    )
})


AuditLogMessages.set(Actions.CREATE_TEAM, item => {
    const user = resolveUsername(item)
    const team = item.details.teamName || '?'
    const eventAnchor = crateAnchor_ManageTeams(item.details.gameEvent)

    return getAppropriatedString(database_strings.log_create_team,
        // Variáveis para formatar 
        user, team, eventAnchor
    )
})
AuditLogMessages.set(Actions.DELETE_TEAM, item => {
    const user = resolveUsername(item)
    const eventAnchor = crateAnchor_ManageTeams(item.details.gameEvent)

    return getAppropriatedString(database_strings.log_delete_team,
        // Variáveis para formatar 
        user, eventAnchor
    )
})
AuditLogMessages.set(Actions.ADD_MEMBER_TO_TEAM, item => {
    const user = resolveUsername(item)
    const member = resolveMember(item.details.memberId)?.name || '?'
    const team = resolveTeam(item.details.gameEvent, item.details.teamId)?.name || '?'
    const eventAnchor = crateAnchor_ManageTeams(item.details.gameEvent)

    return getAppropriatedString(database_strings.log_add_member_to_team,
        // Variáveis para formatar 
        user,
        member,
        team,
        eventAnchor
    )
})
AuditLogMessages.set(Actions.REMOVE_MEMBER_FROM_TEAM, item => {
    const user = resolveUsername(item)
    const member = resolveMember(item.details.memberId)?.name || '?'
    const team = resolveTeam(item.details.gameEvent, item.details.teamId)?.name || '?'
    const eventAnchor = crateAnchor_ManageTeams(item.details.gameEvent)

    return getAppropriatedString(database_strings.log_remove_member_from_team,
        // Variáveis para formatar 
        user,
        member,
        team,
        eventAnchor
    )
})


AuditLogMessages.set(Actions.COMMISSION_SET_STATE, item => {
    const user = resolveUsername(item)
    const member = resolveMember(item.details.memberId)?.name || '?'
    const state = getCommissionStateString(item.details.state || CommissionState.AVAILABLE)

    return getAppropriatedString(database_strings.log_commission_set_state,
        // Variáveis para formatar
        user, member, state
    )
})
AuditLogMessages.set(Actions.COMMISSION_RESET_CYCLE, item => {
    const user = resolveUsername(item)

    return getAppropriatedString(database_strings.log_commission_reset_cycle,
        // Variáveis para formatar
        user
    )
})
