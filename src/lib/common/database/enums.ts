export enum Actions {
    CHANGE_ORGANIZATION_NAME = 'con',

    ADD_MEMBER = 'am',
    REMOVED_MEMBER = 'rm',
    EDITED_MEMBER = 'em',

    CREATE_TEAM = 'ct',
    DELETE_TEAM = 'dt',
    ADD_MEMBER_TO_TEAM = 'amt',
    REMOVE_MEMBER_FROM_TEAM = 'rmt',

    COMMISSION_SET_STATE = 'css',
    COMMISSION_RESET_CYCLE = 'crc',
}

export enum GameEvents {
    WORLD_TREE = 'world_tree',
    MINES_IN_DUNGEON = 'mines_in_dungeon',
    CLOUD_KINGDOM = 'cloud_kingdom',
    CASSINO_ON_YACHT = 'cassino_on_yacht'
}

export enum CommissionState {
    AVAILABLE = 0,
    CLOSED = 1,
    INACTIVE = 2,
}