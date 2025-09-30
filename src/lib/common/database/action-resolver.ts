import { StatusCodes } from "http-status-codes"
import type { PostAddMemberToTeamType, PostAddMemberType, PostCreateTeamType, PostDeleteMemberType, PostDeleteTeamType, PostEditMemberType, PostRemoveMemberToTeamType, PostResetCommissionCycleType, PostSetCommissionSateType, PostSetGuildNameType, PostSyncOnlyListCommissionMembersType, PostSyncOnlyListFreeMembersForEvent, PostTypes } from "./post-types"
import type { DatabaseOperations } from "./database-interfaces"
import type { User } from "$lib/server/database/server-database.svelte"
import { Actions } from "./enums"
import { send } from "$lib/utils/http-util"


type ActionResolverFunction = (user: User | null, data: PostTypes) => Promise<Response>


export function createActionResolver(database: DatabaseOperations) {
    const map = new Map<string, ActionResolverFunction>()


    map.set(Actions.SET_GUILD_NAME, async (user: User | null, data: PostSetGuildNameType) => {
        // Validar os tipos antes
        if (typeof data.newName !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Atualizar o nome
        const updated = await database.setGuildName(data.newName, user?.name)
        if (updated)
            return send(StatusCodes.OK, data)


        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    })


    map.set(Actions.ADD_MEMBER, async (user: User | null, data: PostAddMemberType) => {
        // Validar os tipos antes
        if (typeof data.name !== 'string' || typeof data.power !== 'number')
            return send(StatusCodes.BAD_REQUEST)

        // Adicionar o membro ao banco de dados
        const member = await database.addMember(data.name, data.power, user?.name)
        if (member)
            return send(StatusCodes.OK, member)


        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    })
    map.set(Actions.DELETE_MEMBER, async (user: User | null, data: PostDeleteMemberType) => {
        // Validar os tipos antes
        if (typeof data.memberId !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Remover o membro do banco de dados
        const deleted = await database.deleteMember(data.memberId, user?.name)
        if (deleted)
            return send(StatusCodes.OK, data)


        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    })
    map.set(Actions.EDIT_MEMBER, async (user: User | null, data: PostEditMemberType) => {
        // Validar os tipos antes
        if (typeof data.memberId !== 'string' || typeof data.newName !== 'string' || typeof data.newPower !== 'number')
            return send(StatusCodes.BAD_REQUEST)

        // Editar o membro
        const member = await database.editMember(data.memberId, data.newName, data.newPower, user?.name)
        if (member)
            return send(StatusCodes.OK, member)


        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    })


    map.set(Actions.CREATE_TEAM, async (user: User | null, data: PostCreateTeamType) => {
        // Validar os tipos antes
        if (typeof data.gameEvent !== 'string' || typeof data.name !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Criar a equipe
        const team = await database.createTeam(data.gameEvent, data.name, user?.name)
        if (team)
            return send(StatusCodes.OK, team)


        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    })
    map.set(Actions.DELETE_TEAM, async (user: User | null, data: PostDeleteTeamType) => {
        // Validar os tipos antes
        if (typeof data.gameEvent !== 'string' || typeof data.teamId !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Deletar a equipe
        const deleted = await database.deleteTeam(data.gameEvent, data.teamId, user?.name)
        if (deleted)
            send(StatusCodes.OK, data)


        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)

    })
    map.set(Actions.ADD_MEMBER_TO_TEAM, async (user: User | null, data: PostAddMemberToTeamType) => {
        // Validar os tipos antes
        if (typeof data.gameEvent !== 'string' || typeof data.teamId !== 'string' || typeof data.memberId !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Adicionar o membro a equipe
        const added = await database.addMemberToTeam(data.gameEvent, data.teamId, data.memberId, user?.name)
        if (added)
            send(StatusCodes.OK, data)


        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    })
    map.set(Actions.REMOVE_MEMBER_FROM_TEAM, async (user: User | null, data: PostRemoveMemberToTeamType) => {
        // Validar os tipos antes
        if (typeof data.gameEvent !== 'string' || typeof data.teamId !== 'string' || typeof data.memberId !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Remover o membro da equipe
        const removed = await database.removeMemberFromTeam(data.gameEvent, data.teamId, data.memberId, user?.name)
        if (removed)
            send(StatusCodes.OK, data)


        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    })


    map.set(Actions.COMMISSION_SET_STATE, async (user: User | null, data: PostSetCommissionSateType) => {
        // Validar os tipos antes
        if (typeof data.memberId !== 'string' || typeof data.state !== 'number' || typeof data.updateTime !== 'boolean')
            return send(StatusCodes.BAD_REQUEST)

        // Atualizar o membro
        const updated = await database.setCommissionState(data.memberId, data.state, data.updateTime, user?.name)
        if (updated)
            send(StatusCodes.OK, data)


        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    })
    map.set(Actions.COMMISSION_RESET_CYCLE, async (user: User | null, data: PostResetCommissionCycleType) => {
        const reset = await database.resetCommissionCycle(user?.name)
        if (reset)
            send(StatusCodes.OK)


        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    })


    map.set(Actions.SYNC_ONLY_LIST_COMMISSION_MEMBERS, async (user: User | null, data: PostSyncOnlyListCommissionMembersType) => {
        // Validar os tipos antes
        if (typeof data.state !== 'number')
            return send(StatusCodes.BAD_REQUEST)

        // Listar os membros
        const members = await database.listCommissionMembers(data.state)
        return send(StatusCodes.OK, members)
    })
    map.set(Actions.SYNC_ONLY_LIST_FREE_MEMBERS_FOR_EVENT, async (user: User | null, data: PostSyncOnlyListFreeMembersForEvent) => {
        // Validar os tipos antes
        if (typeof data.gameEvent !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Listar os membros
        const members = await database.listFreeMembersForEvent(data.gameEvent)
        return send(StatusCodes.OK, members)
    })

    return map
}
