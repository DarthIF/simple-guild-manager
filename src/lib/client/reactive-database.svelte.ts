import { DATA_STRUCTURE_TEMPLATE, type DatabaseTypeV2 } from '$lib/common/database/database-types'

function createDefaultData(): DatabaseTypeV2 {
    return JSON.parse(JSON.stringify(DATA_STRUCTURE_TEMPLATE))
}

export const ReactiveDB: DatabaseTypeV2 = $state(createDefaultData())