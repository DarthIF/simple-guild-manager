import type { Nullable } from '$lib/utils/types'
import type { PostSetGuildNameType, PostAddMemberType, PostDeleteMemberType, PostEditMemberType, PostCreateTeamType, PostDeleteTeamType, PostAddMemberToTeamType, PostRemoveMemberFromTeamType, PostSetCommissionSateType, PostResetCommissionCycleType, PostSyncOnlyListCommissionMembersType, PostSyncOnlyListFreeMembersForEvent, PostTypes } from '$lib/common/database/post-types'
import type { UserV2 } from './user'
import type { DatabaseOperations } from '$lib/common/database/database-interfaces'
import { Actions } from '$lib/common/database/enums'


export interface ActionResolver<T> {

    resolve(action: Actions, user: Nullable<UserV2>, data: PostTypes): Promise<T>


    setGuildName(user: Nullable<UserV2>, data: PostSetGuildNameType): Promise<T>


    addMember(user: Nullable<UserV2>, data: PostAddMemberType): Promise<T>
    deleteMember(user: Nullable<UserV2>, data: PostDeleteMemberType): Promise<T>
    editMember(user: Nullable<UserV2>, data: PostEditMemberType): Promise<T>


    createTeam(user: Nullable<UserV2>, data: PostCreateTeamType): Promise<T>
    deleteTeam(user: Nullable<UserV2>, data: PostDeleteTeamType): Promise<T>
    addMemberToTeam(user: Nullable<UserV2>, data: PostAddMemberToTeamType): Promise<T>
    removeMemberFromTeam(user: Nullable<UserV2>, data: PostRemoveMemberFromTeamType): Promise<T>


    setCommissionState(user: Nullable<UserV2>, data: PostSetCommissionSateType): Promise<T>
    resetCommissionCycle(user: Nullable<UserV2>, data: PostResetCommissionCycleType): Promise<T>


    syncListCommissionMembers(user: Nullable<UserV2>, data: PostSyncOnlyListCommissionMembersType): Promise<T>
    syncListFreeMembersForEvent(user: Nullable<UserV2>, data: PostSyncOnlyListFreeMembersForEvent): Promise<T>

}

export abstract class ActionResolverBase<T> implements ActionResolver<T> {
    protected db: DatabaseOperations

    public constructor(database: DatabaseOperations) {
        this.db = database
    }


    public resolve(action: Actions, user: Nullable<UserV2>, data: PostTypes): Promise<T> {
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


            default:
                return this.defaultResolve()
        }
    }

    protected abstract defaultResolve(): Promise<T>



    abstract setGuildName(user: Nullable<UserV2>, data: PostSetGuildNameType): Promise<T>


    abstract addMember(user: Nullable<UserV2>, data: PostAddMemberType): Promise<T>

    abstract deleteMember(user: Nullable<UserV2>, data: PostDeleteMemberType): Promise<T>

    abstract editMember(user: Nullable<UserV2>, data: PostEditMemberType): Promise<T>


    abstract createTeam(user: Nullable<UserV2>, data: PostCreateTeamType): Promise<T>

    abstract deleteTeam(user: Nullable<UserV2>, data: PostDeleteTeamType): Promise<T>

    abstract addMemberToTeam(user: Nullable<UserV2>, data: PostAddMemberToTeamType): Promise<T>

    abstract removeMemberFromTeam(user: Nullable<UserV2>, data: PostRemoveMemberFromTeamType): Promise<T>


    abstract setCommissionState(user: Nullable<UserV2>, data: PostSetCommissionSateType): Promise<T>

    abstract resetCommissionCycle(user: Nullable<UserV2>, data: PostResetCommissionCycleType): Promise<T>


    abstract syncListCommissionMembers(user: Nullable<UserV2>, data: PostSyncOnlyListCommissionMembersType): Promise<T>

    abstract syncListFreeMembersForEvent(user: Nullable<UserV2>, data: PostSyncOnlyListFreeMembersForEvent): Promise<T>

}
