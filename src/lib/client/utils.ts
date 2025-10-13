import type { EventTeamType, AuditLogTypeV3 } from '$lib/common/database/constants-and-types'
import { getMemberTeamId } from '$lib/common/database/utils'
import { formatNumberCompact } from '$lib/utils/number-util'
import { ReactiveDB } from './reactive-database.svelte'
import { CommissionState, Actions } from "$lib/common/database/enums";
import { basic, database_strings, fragment_commissions } from "$lib/strings/strings";
import { getAppropriatedString } from "$lib/strings";


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


function resolveUsername(item: AuditLogTypeV3) {
    if (item.user)
        return item.user

    return getAppropriatedString(basic.you)
}

function resolveMember(memberId: string | undefined) {
    return ReactiveDB.members.find(m => m.id === memberId)
}


export const AuditLogMessageResolvers = new Map<Actions, AuditLogMessageResolverFunction>()


AuditLogMessageResolvers.set(Actions.SET_GUILD_NAME, item => {
    const user = resolveUsername(item)

    return getAppropriatedString(database_strings.log_set_guild_name,
        // Variáveis para formatar 
        user, item.details.newName
    )
})





AuditLogMessageResolvers.set(Actions.COMMISSION_SET_STATE, item => { 
    const user = resolveUsername(item)
    const member = resolveMember(item.details.memberId)?.name || '?'
    const state = getCommissionStateString(item.details.state || CommissionState.AVAILABLE)

    return getAppropriatedString(database_strings.log_commission_set_state, 
        // Variáveis para formatar
        user, member, state
    )
})
AuditLogMessageResolvers.set(Actions.COMMISSION_RESET_CYCLE, item => {
    const user = resolveUsername(item)

    return getAppropriatedString(database_strings.log_commission_reset_cycle, 
        // Variáveis para formatar
        user 
    )
})
