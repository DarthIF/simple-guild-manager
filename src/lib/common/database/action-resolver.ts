import { StatusCodes } from "http-status-codes"
import type { PostAddMemberType, PostDeleteMemberType, PostEditMemberType, PostTypes } from "./post-types"
import type { DatabaseOperations } from "./database-interfaces"
import type { User } from "$lib/server/database/server-database.svelte"
import { Actions } from "./enums"
import { send } from "$lib/utils/http-util"


type ActionResolverFunction = (user: User | null, data: PostTypes) => Promise<Response>


export function createActionResolver(database: DatabaseOperations) {
    const ActionResolver = new Map<string, ActionResolverFunction>()


    ActionResolver.set(Actions.ADD_MEMBER, async (user: User | null, data: PostAddMemberType) => {
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
    ActionResolver.set(Actions.DELETE_MEMBER, async (user: User | null, data: PostDeleteMemberType) => {
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
    ActionResolver.set(Actions.EDIT_MEMBER, async (user: User | null, data: PostEditMemberType) => {
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


    

    return ActionResolver
}
