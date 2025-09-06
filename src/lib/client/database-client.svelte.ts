import { DATA_STRUCTURE_TEMPLATE, type DatabaseTypeV2 } from '$lib/common/database/database-types'
import { Actions } from '$lib/common/database/enums'
import type { GuildDatabase } from '$lib/common/database/guild-database'


function createDefaultData(): DatabaseTypeV2 {
    return JSON.parse(JSON.stringify(DATA_STRUCTURE_TEMPLATE))
}

function api(action: Actions, postContent: any): Promise<Response> {
    return fetch(`/app/mu/${action}`, {
        method: 'POST',
        body: JSON.stringify(postContent)
    })
}


class ClientDatabaseImpl {

    public async addMember(name: string, power: number): Promise<boolean> {
        const response = await api(Actions.ADD_MEMBER, { name, power })

        if (response.status === 200) {

        } else {

        }
    }

}


export const ReactiveDB: DatabaseTypeV2 = $state(createDefaultData())

export const ClientDatabase = new ClientDatabaseImpl()