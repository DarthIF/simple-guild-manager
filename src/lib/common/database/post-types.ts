import type { CommissionState, GameEvents } from "./enums"

export type PostTypes = {}
    & PostSetGuildNameType
    & PostAddMemberType
    & PostDeleteMemberType
    & PostEditMemberType
    & PostCreateTeamType
    & PostDeleteTeamType
    & PostAddMemberToTeamType
    & PostRemoveMemberToTeamType
    & PostSetCommissionSateType
    & PostResetCommissionCycleType


export type PostSetGuildNameType = {
    newName?: string
}


export type PostAddMemberType = {
    name?: string
    power?: number
}

export type PostDeleteMemberType = {
    memberId?: string
}

export type PostEditMemberType = {
    memberId?: string
    newName?: string
    newPower?: number
}


export type PostCreateTeamType = {
    gameEvent?: GameEvents
    name?: string
}

export type PostDeleteTeamType = {
    gameEvent?: GameEvents
    teamId?: string
}

export type PostAddMemberToTeamType = {
    gameEvent?: GameEvents
    teamId?: string
    memberId?: string
}

export type PostRemoveMemberToTeamType = PostAddMemberToTeamType


export type PostSetCommissionSateType = {
    memberId?: string
    state?: CommissionState
    updateTime?: boolean
}

export type PostResetCommissionCycleType = {}