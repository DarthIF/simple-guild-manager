import type { Nullable } from '$lib/utils/types'
import type { PostSetGuildNameType, PostAddMemberType, PostDeleteMemberType, PostEditMemberType, PostCreateTeamType, PostDeleteTeamType, PostAddMemberToTeamType, PostRemoveMemberFromTeamType, PostSetCommissionSateType, PostResetCommissionCycleType, PostSyncOnlyListCommissionMembersType, PostSyncOnlyListFreeMembersForEvent, PostTypes } from '$lib/common/database/post-types'
import type { User } from './user'
import type { DatabaseOperations } from '$lib/common/database/database-interfaces'
import { Actions } from '$lib/common/database/enums'


export interface ActionResolver<T> {

    resolve(action: Actions, user: Nullable<User>, data: PostTypes): Promise<T>


    setGuildName(user: Nullable<User>, data: PostSetGuildNameType): Promise<T>


    addMember(user: Nullable<User>, data: PostAddMemberType): Promise<T>
    deleteMember(user: Nullable<User>, data: PostDeleteMemberType): Promise<T>
    editMember(user: Nullable<User>, data: PostEditMemberType): Promise<T>


    createTeam(user: Nullable<User>, data: PostCreateTeamType): Promise<T>
    deleteTeam(user: Nullable<User>, data: PostDeleteTeamType): Promise<T>
    addMemberToTeam(user: Nullable<User>, data: PostAddMemberToTeamType): Promise<T>
    removeMemberFromTeam(user: Nullable<User>, data: PostRemoveMemberFromTeamType): Promise<T>


    setCommissionState(user: Nullable<User>, data: PostSetCommissionSateType): Promise<T>
    resetCommissionCycle(user: Nullable<User>, data: PostResetCommissionCycleType): Promise<T>


    syncListCommissionMembers(user: Nullable<User>, data: PostSyncOnlyListCommissionMembersType): Promise<T>
    syncListFreeMembersForEvent(user: Nullable<User>, data: PostSyncOnlyListFreeMembersForEvent): Promise<T>

}

export abstract class ActionResolverBase<T> implements ActionResolver<T> {
    protected db: DatabaseOperations

    public constructor(database: DatabaseOperations) {
        this.db = database
    }


    public resolve(action: Actions, user: Nullable<User>, data: PostTypes): Promise<T> {
        switch (action) {
            case Actions.SET_GUILD_NAME:
                return this.setGuildName(user, data)


            case Actions.ADD_MEMBER:
                return this.addMember(user, data)
            case Actions.DELETE_MEMBER:
                return this.deleteMember(user, data)
            case Actions.EDIT_MEMBER:
                return this.editMember(user, data)


            case Actions.CREATE_TEAM:
                return this.createTeam(user, data)
            case Actions.DELETE_TEAM:
                return this.deleteTeam(user, data)
            case Actions.ADD_MEMBER_TO_TEAM:
                return this.addMemberToTeam(user, data)
            case Actions.REMOVE_MEMBER_FROM_TEAM:
                return this.removeMemberFromTeam(user, data)


            case Actions.COMMISSION_SET_STATE:
                return this.setCommissionState(user, data)
            case Actions.COMMISSION_RESET_CYCLE:
                return this.resetCommissionCycle(user, data)


            case Actions.SYNC_ONLY_LIST_COMMISSION_MEMBERS:
                return this.syncListCommissionMembers(user, data)
            case Actions.SYNC_ONLY_LIST_FREE_MEMBERS_FOR_EVENT:
                return this.syncListFreeMembersForEvent(user, data)
        }
    }


    abstract setGuildName(user: Nullable<User>, data: PostSetGuildNameType): Promise<T>


    abstract addMember(user: Nullable<User>, data: PostAddMemberType): Promise<T>

    abstract deleteMember(user: Nullable<User>, data: PostDeleteMemberType): Promise<T>

    abstract editMember(user: Nullable<User>, data: PostEditMemberType): Promise<T>


    abstract createTeam(user: Nullable<User>, data: PostCreateTeamType): Promise<T>

    abstract deleteTeam(user: Nullable<User>, data: PostDeleteTeamType): Promise<T>

    abstract addMemberToTeam(user: Nullable<User>, data: PostAddMemberToTeamType): Promise<T>

    abstract removeMemberFromTeam(user: Nullable<User>, data: PostRemoveMemberFromTeamType): Promise<T>


    abstract setCommissionState(user: Nullable<User>, data: PostSetCommissionSateType): Promise<T>

    abstract resetCommissionCycle(user: Nullable<User>, data: PostResetCommissionCycleType): Promise<T>


    abstract syncListCommissionMembers(user: Nullable<User>, data: PostSyncOnlyListCommissionMembersType): Promise<T>

    abstract syncListFreeMembersForEvent(user: Nullable<User>, data: PostSyncOnlyListFreeMembersForEvent): Promise<T>

}
