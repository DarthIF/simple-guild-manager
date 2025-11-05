import { StatusCodes } from 'http-status-codes'
import type { PostAddMemberToTeamType, PostAddMemberType, PostCreateTeamType, PostDeleteMemberType, PostDeleteTeamType, PostEditMemberType, PostRemoveMemberFromTeamType, PostResetCommissionCycleType, PostSetCommissionSateType, PostSetGuildNameType, PostSyncOnlyListCommissionMembersType, PostSyncOnlyListFreeMembersForEvent, PostTypes } from '$lib/common/database/post-types'
import type { Nullable } from '$lib/utils/types'
import type { User } from './user'
import { ActionResolverBase } from './ar'
import { Actions } from '$lib/common/database/enums'
import { send } from '$lib/utils/http-util'
import { includePacket } from '../packets'


export class ServerActionResolver extends ActionResolverBase<Response> {

    protected async defaultResolve(): Promise<Response> {
        return send(StatusCodes.SERVICE_UNAVAILABLE)
    }


    public async setGuildName(user: Nullable<User>, data: PostSetGuildNameType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.newName !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Atualizar o nome
        const updated = await this.db.setGuildName(data.newName, user?.name)
        if (updated) {
            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.SET_GUILD_NAME, data)

            return send(StatusCodes.OK, data)
        }

        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }


    public async addMember(user: Nullable<User>, data: PostAddMemberType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.name !== 'string' || typeof data.power !== 'number')
            return send(StatusCodes.BAD_REQUEST)

        // Adicionar o membro ao banco de dados
        const member = await this.db.addMember(data.name, data.power, user?.name)
        if (member) {
            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.ADD_MEMBER, member)

            return send(StatusCodes.OK, member)
        }

        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }

    public async deleteMember(user: Nullable<User>, data: PostDeleteMemberType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.memberId !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Remover o membro do banco de dados
        const deleted = await this.db.deleteMember(data.memberId, user?.name)
        if (deleted) {
            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.DELETE_MEMBER, data)

            return send(StatusCodes.OK, data)
        }

        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }

    public async editMember(user: Nullable<User>, data: PostEditMemberType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.memberId !== 'string' || typeof data.newName !== 'string' || typeof data.newPower !== 'number')
            return send(StatusCodes.BAD_REQUEST)

        // Editar o membro
        const member = await this.db.editMember(data.memberId, data.newName, data.newPower, user?.name)
        if (member) {
            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.EDIT_MEMBER, member)

            return send(StatusCodes.OK, member)
        }

        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }


    public async createTeam(user: Nullable<User>, data: PostCreateTeamType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.gameEvent !== 'string' || typeof data.name !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Criar a equipe
        const team = await this.db.createTeam(data.gameEvent, data.name, user?.name)
        if (team) {
            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.CREATE_TEAM, team)

            return send(StatusCodes.OK, team)
        }

        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }

    public async deleteTeam(user: Nullable<User>, data: PostDeleteTeamType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.gameEvent !== 'string' || typeof data.teamId !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Deletar a equipe
        const deleted = await this.db.deleteTeam(data.gameEvent, data.teamId, user?.name)
        if (deleted) {
            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.DELETE_TEAM, data)

            return send(StatusCodes.OK, data)
        }

        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }

    public async addMemberToTeam(user: Nullable<User>, data: PostAddMemberToTeamType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.gameEvent !== 'string' || typeof data.teamId !== 'string' || typeof data.memberId !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Adicionar o membro a equipe
        const added = await this.db.addMemberToTeam(data.gameEvent, data.teamId, data.memberId, user?.name)
        if (added) {
            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.ADD_MEMBER_TO_TEAM, data)

            return send(StatusCodes.OK, data)
        }

        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }

    public async removeMemberFromTeam(user: Nullable<User>, data: PostRemoveMemberFromTeamType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.gameEvent !== 'string' || typeof data.teamId !== 'string' || typeof data.memberId !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Remover o membro da equipe
        const removed = await this.db.removeMemberFromTeam(data.gameEvent, data.teamId, data.memberId, user?.name)
        if (removed) {
            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.REMOVE_MEMBER_FROM_TEAM, data)

            return send(StatusCodes.OK, data)
        }


        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }


    public async setCommissionState(user: Nullable<User>, data: PostSetCommissionSateType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.memberId !== 'string' || typeof data.state !== 'number' || typeof data.updateTime !== 'boolean')
            return send(StatusCodes.BAD_REQUEST)

        // Atualizar o membro
        const updated = await this.db.setCommissionState(data.memberId, data.state, data.updateTime, user?.name)
        if (updated) {
            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.COMMISSION_SET_STATE, data)

            return send(StatusCodes.OK, data)
        }

        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }

    public async resetCommissionCycle(user: Nullable<User>, data: PostResetCommissionCycleType): Promise<Response> {
        const reset = await this.db.resetCommissionCycle(user?.name)
        if (reset) {
            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.COMMISSION_RESET_CYCLE, {})

            return send(StatusCodes.OK)
        }

        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }


    public async syncListCommissionMembers(user: Nullable<User>, data: PostSyncOnlyListCommissionMembersType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.state !== 'number')
            return send(StatusCodes.BAD_REQUEST)

        // Listar os membros
        const members = await this.db.listCommissionMembers(data.state)

        // Adicionar um pacote pendente se for pertinente
        includePacket(user?.token, Actions.SYNC_ONLY_LIST_COMMISSION_MEMBERS, members)

        return send(StatusCodes.OK, members)
    }

    public async syncListFreeMembersForEvent(user: Nullable<User>, data: PostSyncOnlyListFreeMembersForEvent): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.gameEvent !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Listar os membros
        const members = await this.db.listFreeMembersForEvent(data.gameEvent)

        // Adicionar um pacote pendente se for pertinente
        includePacket(user?.token, Actions.SYNC_ONLY_LIST_FREE_MEMBERS_FOR_EVENT, members)

        return send(StatusCodes.OK, members)
    }

}
