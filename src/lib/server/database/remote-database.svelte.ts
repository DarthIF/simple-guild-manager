import type { AuditLogDetails, AuditLogType, MemberType, TeamType } from '$lib/common/database/database-types'
import type { GuildDatabase } from '$lib/common/database/guild-database'
import { CommissionState, GameEvents } from '$lib/common/database/enums'
import { currentUnixTime } from '$lib/utils/date-util'
import { Collection, Db, MongoClient } from 'mongodb'


export interface User {
    // Autenticação
    name: string
    hash: string
    token: string

    // Personalização
    icon: string
}


const DATABASE_NAME = 'simple-guild-manager'
const COLLECTION_USERS = 'users'
const COLLECTION_MEMBERS = 'guild-members'
const COLLECTION_EVENT_WORLD_TREE = 'guild-event-tree'
const COLLECTION_EVENT_MINES_IN_DUNGEON = 'guild-event-mines'
const COLLECTION_EVENT_CLOUD_KINGDOM = 'guild-event-cloud'
const COLLECTION_EVENT_CASSINO_ON_YACHT = 'guild-event-yacht'
const COLLECTION_COMMISSION_CLOSED = 'guild-commission-closed' // Precisa disso ??
const COLLECTION_COMMISSION_EXCLUDED = 'guild-commission-excluded' // Precisa disso ???
const COLLECTION_AUDIT_LOG = 'guild-audit-log'


async function getCollectionOf(db: Db, gameEvent: GameEvents): Promise<Collection<TeamType>> {
    switch (gameEvent) {
        case GameEvents.WORLD_TREE:
            return db.collection<TeamType>(COLLECTION_EVENT_WORLD_TREE)

        case GameEvents.MINES_IN_DUNGEON:
            return db.collection<TeamType>(COLLECTION_EVENT_MINES_IN_DUNGEON)

        case GameEvents.CLOUD_KINGDOM:
            return db.collection<TeamType>(COLLECTION_EVENT_CLOUD_KINGDOM)

        case GameEvents.CASSINO_ON_YACHT:
            return db.collection<TeamType>(COLLECTION_EVENT_CASSINO_ON_YACHT)
        default:
            throw new Error('Erro ao iniciar a coleção para o evento: ' + gameEvent)
    }
}



class RemoteDatabaseImpl implements GuildDatabase {
    private mongoURI: string | null = null
    private client: MongoClient | null = null
    private db: Db | null = null


    public setMongoUri(uri: string): RemoteDatabaseImpl {
        if (this.db)
            throw new Error('O mongoURI não pode ser definido, pois esse banco de dados ja foi inicializado.')

        this.mongoURI = uri

        return this
    }

    public setMongoUriFrom(user: string, password: string, cluster: string): RemoteDatabaseImpl {
        return this.setMongoUri(`mongodb+srv://${user}:${password}@${cluster}`)
    }

    public async initialize(): Promise<Db> {
        if (this.db)
            return this.db

        if (!this.mongoURI)
            throw new Error('Erro ao iniciar o banco de dados, mongoUri não foi definido')

        try {
            this.client = new MongoClient(this.mongoURI)
            this.db = this.client.db(DATABASE_NAME)

            return this.db
        } catch (error) {
            this.client?.close()

            this.client = null
            this.db = null

            console.error(error)

            throw new Error('Erro ao iniciar o banco de dados, ' + error)
        }
    }


    // ------------------------------------------


    public async addMember(name: string, power: number): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collection = db.collection<MemberType>(COLLECTION_MEMBERS)

            if (isNaN(power))
                power = 0

            const result = await collection.insertOne({
                id: currentUnixTime().toString(),
                name: name,
                power: power,
                commissions: {
                    state: CommissionState.AVAILABLE,
                    time: 0,
                    missed: 0
                }
            })

            return (result.acknowledged && result.insertedId) ? true : false
        } catch (error) {
            return false
        }
    }

    public async deleteMember(member: MemberType): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collection = db.collection<MemberType>(COLLECTION_MEMBERS)

            const result = await collection.deleteOne({ id: member.id })

            return (result.acknowledged && result.deletedCount) ? true : false
        } catch (error) {
            return false
        }
    }


    public async createTeam(gameEvent: GameEvents, name: string): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collection = await getCollectionOf(db, gameEvent)

            // Adicionar o novo time
            const result = await collection.insertOne({
                id: currentUnixTime().toString(),
                name,
                members: []
            })

            return (result.acknowledged && result.insertedId) ? true : false
        } catch (error) {
            return false
        }
    }

    public async deleteTeam(gameEvent: GameEvents, team: TeamType, userName?: string): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collection = await getCollectionOf(db, gameEvent)

            // Deletar o time
            const result = await collection.deleteOne({ id: team.id })

            return (result.acknowledged && result.deletedCount) ? true : false
        } catch (error) {
            return false
        }
    }

    public async addMemberToTeam(gameEvent: GameEvents, teamId: string, memberId: string, userName?: string): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collection = await getCollectionOf(db, gameEvent)

            // Procurar o time
            const team = await collection.findOne({ id: teamId })

            // Time não encontrado ou cheio
            if (!team || team.members.length >= 4)
                return false

            // Adicionar o membro ao time
            const result = await collection.updateOne({ id: team.id }, { $push: { members: memberId } })

            return (result.acknowledged && result.modifiedCount) ? true : false
        } catch (error) {
            return false
        }
    }

    public async removeMemberFromTeam(gameEvent: GameEvents, teamId: string, memberId: string, userName?: string): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collection = await getCollectionOf(db, gameEvent)

            // Procurar o time
            const team = await collection.findOne({ id: teamId })

            // Time não encontrado
            if (!team)
                return false

            // Remover o membro do time
            const result = await collection.updateOne({ id: team.id }, { $pull: { members: memberId } })

            return (result.acknowledged && result.modifiedCount) ? true : false
        } catch (error) {
            return false
        }
    }

}

export const RemoteDatabase = new RemoteDatabaseImpl()
