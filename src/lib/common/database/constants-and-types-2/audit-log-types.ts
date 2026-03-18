import type { Actions } from '../enums'


export type AuditLogTypeV3 = {
    /**
     * Nome do usuário que fez que gerou o AuditLog.
     * Usado apenas na implementação para o Vercel.
     */
    user?: string

    unixTime: number
    action: Actions
    details: AuditLogDetailsV3
}

export type AuditLogDetailsV3 = {}
    & AuditLogDetails_SetGuildName
    & AuditLogDetails_AddMember
    & AuditLogDetails_DeleteMember
    & AuditLogDetails_EditMember
    & AuditLogDetails_CreateTeam
    & AuditLogDetails_DeleteTeam
    & AuditLogDetails_AddMemberToTeam
    & AuditLogDetails_RemoveMemberFromTeam
    & AuditLogDetails_SetCommissionState




type AuditLogDetails_SetGuildName = {
    oldName?: string
    newName?: string
}

type AuditLogDetails_AddMember = {
    memberId?: string
    name?: string
    power?: number
}

type AuditLogDetails_DeleteMember = {
    name?: string
}

type AuditLogDetails_EditMember = {
    memberId?: string
    oldName?: string
    oldPower?: number
    newName?: string
    newPower?: number
}

type AuditLogDetails_CreateTeam = {
    gameEvent?: string
    teamId?: string
    teamName?: string
}

type AuditLogDetails_DeleteTeam = {
    gameEvent?: string
    teamId?: string
}

type AuditLogDetails_AddMemberToTeam = {
    gameEvent?: string
    teamId?: string
    memberId?: string
}

type AuditLogDetails_RemoveMemberFromTeam = {} & AuditLogDetails_AddMemberToTeam

type AuditLogDetails_SetCommissionState = {
    memberId?: string
    state?: number
}
