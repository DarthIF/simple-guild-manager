import type { AuditLogDetails, AuditLogType, DatabaseType, DatabaseTypeV2, MemberType, TeamType } from '$lib/common/database/database-types'
import type { GuildDatabase } from '$lib/common/database/guild-database'



const DATA_TEMPLATE: DatabaseTypeV2 = {
    organization: 'Guild Name 🎈',
    members: [],
    events: {
        worldTree: [],
        minesInDungeon: [],
        cloudKingdom: [],
        cassinoOnYacht: []
    },
    commissions: {
        closed: [],
        inactive: []
    },
    auditLog: []
}

function createDefaultData(): DatabaseTypeV2 {
    return JSON.parse(JSON.stringify(DATA_TEMPLATE))
}



// Banco de dados desconstruído
export let organization: string = $state('')
export let members: MemberType[] = $state([])
export let worldTree: TeamType[] = $state([])
export let minesInDungeon: TeamType[] = $state([])
export let cloudKingdom: TeamType[] = $state([])
export let cassinoOnYacht: TeamType[] = $state([])
export let auditLog: AuditLogType[] = $state([])


class Database implements GuildDatabase {

    public async addMember(name: string, power: number): Promise<boolean> {
        const response = await fetch('/app/mu/', {
            method: 'POST',
            body: JSON.stringify({ name, power })
        })

        if (response.status === 200) {

        } else {

        }
    }

}


export const ReactiveDB: DatabaseTypeV2 = $state(createDefaultData())

export const ClientDatabase = new Database()