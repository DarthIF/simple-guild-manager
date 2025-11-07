import type { NullableU } from "$lib/utils/types"

export enum Actions {
    UNDEFINED = 'undefined',

    SET_GUILD_NAME = 'con',

    ADD_MEMBER = 'am',
    DELETE_MEMBER = 'dm',
    EDIT_MEMBER = 'em',

    CREATE_TEAM = 'ct',
    DELETE_TEAM = 'dt',
    ADD_MEMBER_TO_TEAM = 'amt',
    REMOVE_MEMBER_FROM_TEAM = 'rmt',

    COMMISSION_SET_STATE = 'css',
    COMMISSION_RESET_CYCLE = 'crc',


    SYNC_ONLY_DATABASE_LOAD = 'dbl',

    SYNC_ONLY_LIST_COMMISSION_MEMBERS = 'lcm',
    SYNC_ONLY_LIST_FREE_MEMBERS_FOR_EVENT = 'lfm',
}

export enum GameEvents {
    WORLD_TREE = 'world_tree',
    MINES_IN_DUNGEON = 'mines_in_dungeon',
    CLOUD_KINGDOM = 'cloud_kingdom',
    CASSINO_ON_YACHT = 'cassino_on_yacht',
    INFERNO_RALLY = 'inferno_rally',
}

export enum CommissionState {
    AVAILABLE = 0,
    CLOSED = 1,
    INACTIVE = 2,
}

export enum Role {
    MEMBER = 0,
    ELITE = 1,
    VICE_PRESIDENT = 2,
    PRESIDENT = 3,
}


export function parseActions(str: NullableU<string>): Actions {
    for (const action of Object.values(Actions)) {
        if (action === str)
            return action
    }

    return Actions.UNDEFINED
}
