import { DATA_STRUCTURE_TEMPLATE, type DatabaseJsonType } from '$lib/common/database/constants-and-types'

export function createDefaultData(): DatabaseJsonType {
    return JSON.parse(JSON.stringify(DATA_STRUCTURE_TEMPLATE))
}

export const ReactiveDB: DatabaseJsonType = $state(createDefaultData())