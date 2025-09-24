import { Collection, Db, FindCursor, MongoClient, type WithId } from 'mongodb'
import bcrypt from 'bcryptjs'
import { DEFINITIONS_DEFAULT_ID, type AuditLogDetailsV2, type AuditLogTypeV2, type MemberTypeV3, type TeamTypeV2, type DefinitionsType, UNDEFINED_TEAM } from '$lib/common/database/constants-and-types'
import { type GuildDatabase } from '$lib/common/database/guild-database'
import { CommissionState, GameEvents } from '$lib/common/database/enums'
import { currentUnixTime } from '$lib/utils/time-util'
import { forEachGameEvent, getTeamIdOfMember, isUndefinedTeamID, setTeamForMember } from '$lib/common/database/utils'


export interface User {
    // Autenticação
    name: string
    hash: string
    token: string

    // Personalização
    icon: string
}

export interface UserDatabase {

    createUser(username: string, password: string): Promise<boolean>

    findUser(name: string | null | undefined): Promise<User | null>

    createSession(name: string): Promise<string | null>

    findSession(token: string): Promise<User | null>

}


const DATABASE_NAME = 'simple-guild-manager'
const COLLECTION_USERS = 'users'
const COLLECTION_DEFINITIONS = 'guild-definitions'
const COLLECTION_MEMBERS = 'guild-members'
const COLLECTION_EVENT_WORLD_TREE = 'guild-event-tree'
const COLLECTION_EVENT_MINES_IN_DUNGEON = 'guild-event-mines'
const COLLECTION_EVENT_CLOUD_KINGDOM = 'guild-event-cloud'
const COLLECTION_EVENT_CASSINO_ON_YACHT = 'guild-event-yacht'
const COLLECTION_AUDIT_LOG = 'guild-audit-log'


function getCollectionOf(db: Db, gameEvent: GameEvents): Collection<TeamTypeV2> {
    switch (gameEvent) {
        case GameEvents.WORLD_TREE:
            return db.collection<TeamTypeV2>(COLLECTION_EVENT_WORLD_TREE)

        case GameEvents.MINES_IN_DUNGEON:
            return db.collection<TeamTypeV2>(COLLECTION_EVENT_MINES_IN_DUNGEON)

        case GameEvents.CLOUD_KINGDOM:
            return db.collection<TeamTypeV2>(COLLECTION_EVENT_CLOUD_KINGDOM)

        case GameEvents.CASSINO_ON_YACHT:
            return db.collection<TeamTypeV2>(COLLECTION_EVENT_CASSINO_ON_YACHT)

        default:
            throw new Error('Erro ao iniciar a coleção para o evento: ' + gameEvent)
    }
}

function findMembersOfTeam(db: Db, gameEvent: GameEvents, teamId: string): FindCursor<WithId<MemberTypeV3>> {
    const collection = db.collection<MemberTypeV3>(COLLECTION_MEMBERS)
    switch (gameEvent) {
        case GameEvents.WORLD_TREE:
            return collection.find({ worldTree: teamId })

        case GameEvents.MINES_IN_DUNGEON:
            return collection.find({ minesInDungeon: teamId })

        case GameEvents.CLOUD_KINGDOM:
            return collection.find({ cloudKingdom: teamId })

        case GameEvents.CASSINO_ON_YACHT:
            return collection.find({ cassinoOnYacht: teamId })

        default:
            throw new Error('Evento invalido: ' + gameEvent)
    }
}




class RemoteDatabaseImpl implements UserDatabase, GuildDatabase {
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



    public async createUser(username: string, password: string): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collection = db.collection<User>(COLLECTION_USERS)
            const passwordHash = await bcrypt.hash(password, 10)

            await collection.insertOne({
                // Autenticação
                name: username,
                hash: passwordHash,
                token: crypto.randomUUID(),

                // Personalização
                icon: ''
            })

            return true
        } catch (e) {
            console.error(e)
        }

        return false
    }

    public async findUser(name: string | null | undefined): Promise<User | null> {
        if (typeof name !== 'string')
            return null

        try {
            const db = await this.initialize()
            const collection = db.collection<User>(COLLECTION_USERS)

            const find = await collection.findOne({ name })

            return find
        } catch (e) {
            console.error(e)
        }

        return null
    }

    public async createSession(name: string): Promise<string | null> {
        try {
            const db = await this.initialize()
            const collection = db.collection<User>(COLLECTION_USERS)
            const newToken: string = crypto.randomUUID()

            const result = await collection.updateOne({ name }, { $set: { token: newToken } })

            return result.acknowledged ? newToken : null
        } catch (e) {
            console.error(e)
        }

        return null

    }

    public async findSession(token: string): Promise<User | null> {
        try {
            const db = await this.initialize()
            const collection = db.collection<User>(COLLECTION_USERS)

            const find = await collection.findOne({ token })

            return find
        } catch (e) {
            console.error(e)
        }

        return null
    }



    // ------------------------------------------



    public async setGuildName(newName: string, userName?: string): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collection = db.collection<DefinitionsType>(COLLECTION_DEFINITIONS)

            // Atualizar o nome da guilda
            const result = await collection.updateOne(
                { id: DEFINITIONS_DEFAULT_ID },
                {
                    $set: {
                        id: DEFINITIONS_DEFAULT_ID,
                        guild: newName
                    }
                },
                { upsert: true }
            )

            return result.acknowledged
        } catch (error) {
            return false
        }
    }



    public async addMember(name: string, power: number, userName?: string): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collection = db.collection<MemberTypeV3>(COLLECTION_MEMBERS)

            if (isNaN(power))
                power = 0

            // Adicionar o membro
            const result = await collection.insertOne({
                id: currentUnixTime().toString(),
                name: name,
                power: power,

                // Comissões
                state: CommissionState.AVAILABLE,
                time: 0,
                missed: 0,

                // Eventos
                worldTree: UNDEFINED_TEAM,
                minesInDungeon: UNDEFINED_TEAM,
                cloudKingdom: UNDEFINED_TEAM,
                cassinoOnYacht: UNDEFINED_TEAM
            })

            return result.acknowledged
        } catch (error) {
            return false
        }
    }

    public async deleteMember(memberId: string, userName?: string): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collection = db.collection<MemberTypeV3>(COLLECTION_MEMBERS)

            // Apagar o membro
            const member = await collection.findOneAndDelete({ id: memberId })
            if (!member)
                return false

            // Remover o membro dos times
            await forEachGameEvent(async (gameEvent) => {
                // @ts-expect-error
                const teamId: string = getTeamIdOfMember(member, gameEvent)

                // Verificar se é uma equipe indefinida
                if (isUndefinedTeamID(teamId))
                    return

                // Atualizar os times
                const collectionTeams = getCollectionOf(db, gameEvent)
                await collectionTeams.updateOne({ id: teamId }, { $inc: { count: 1 } })
            })

            return true
        } catch (error) {
            return false
        }
    }

    public async editMember(memberId: string, newName: string, newPower: number, userName?: string): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collection = db.collection<MemberTypeV3>(COLLECTION_MEMBERS)

            // Alterar o nome e o poder
            const result = await collection.updateOne({ id: memberId }, { $set: { name: newName, power: newPower } })

            return result.acknowledged
        } catch (error) {
            return false
        }
    }

    public async findMember(memberId: string): Promise<MemberTypeV3 | null> {
        try {
            const db = await this.initialize()
            const collection = db.collection<MemberTypeV3>(COLLECTION_MEMBERS)

            const result = await collection.findOne({ id: memberId })

            return result
        } catch (error) {
            return null
        }
    }



    public async createTeam(gameEvent: GameEvents, name: string): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collection = getCollectionOf(db, gameEvent)

            // Cria um novo time
            const result = await collection.insertOne({
                id: currentUnixTime().toString(),
                name,
                count: 0,
                size: 4
            })

            return result.acknowledged
        } catch (error) {
            return false
        }
    }

    public async deleteTeam(gameEvent: GameEvents, teamId: string, userName?: string): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collection = getCollectionOf(db, gameEvent)

            // Deletar o time
            const result = await collection.deleteOne({ id: teamId })

            return result.acknowledged
        } catch (error) {
            return false
        }
    }

    public async listTeams(gameEvent: GameEvents): Promise<TeamTypeV2[]> {
        try {
            const db = await this.initialize()
            const collection = getCollectionOf(db, gameEvent)

            // Listar todos os times do evento
            const result = new Array<TeamTypeV2>()
            const cursor = collection.find()
            while (cursor.hasNext()) {
                const team = await cursor.next()

                if (team)
                    result.push(team)
            }

            return result
        } catch (error) {
            return []
        }
    }

    public async addMemberToTeam(gameEvent: GameEvents, teamId: string, memberId: string, userName?: string): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collectionMembers = db.collection<MemberTypeV3>(COLLECTION_MEMBERS)
            const collectionTeams = getCollectionOf(db, gameEvent)

            // Verificar o membro
            const member = await collectionMembers.findOne({ id: memberId })
            if (!member)
                return false

            // Verificar a equipe
            const team = await collectionTeams.findOne({ id: teamId })
            if (!team || team.count >= team.size)
                return false

            // Definir o novo time em que o membro está para esse evento
            setTeamForMember(member, gameEvent, teamId)

            // Atualizar as informações do membro e do time
            const resultA = await collectionMembers.updateOne({ id: memberId }, { $set: member })
            const resultB = await collectionTeams.updateOne({ id: team.id }, { $inc: { count: 1 } })

            return (resultA.acknowledged && resultB.acknowledged)
        } catch (error) {
            return false
        }
    }

    public async removeMemberFromTeam(gameEvent: GameEvents, teamId: string, memberId: string, userName?: string): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collectionMembers = db.collection<MemberTypeV3>(COLLECTION_MEMBERS)
            const collectionTeams = getCollectionOf(db, gameEvent)

            // Verificar o membro
            const member = await collectionMembers.findOne({ id: memberId })
            if (!member)
                return false

            // Verificar a equipe
            const team = await collectionTeams.findOne({ id: teamId })
            if (!team || team.count >= team.size)
                return false

            // Definir o novo time em que o membro está para esse evento
            setTeamForMember(member, gameEvent, UNDEFINED_TEAM)

            // Atualizar as informações do membro e do time 
            const resultA = await collectionMembers.updateOne({ id: memberId }, { $set: member })
            const resultB = await collectionTeams.updateOne({ id: team.id }, { $inc: { count: -1 } })

            return (resultA.acknowledged && resultB.acknowledged)
        } catch (error) {
            return false
        }
    }

    public async listFreeMembersForEvent(gameEvent: GameEvents): Promise<MemberTypeV3[]> {
        try {
            const db = await this.initialize()

            // Listar os membros iterando o cursor
            const result = new Array<MemberTypeV3>()
            const cursor = findMembersOfTeam(db, gameEvent, UNDEFINED_TEAM)
            while (cursor.hasNext()) {
                const member = await cursor.next()

                if (member)
                    result.push(member)
            }

            return result
        } catch (error) {
            return []
        }
    }



    public async setCommissionState(memberId: string, state: CommissionState, updateTime: boolean, userName?: string): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collection = db.collection<MemberTypeV3>(COLLECTION_MEMBERS)

            // Atualizar a comissão do membro
            const time = updateTime ? currentUnixTime() : 0
            const result = await collection.updateOne({ id: memberId }, { $set: { state, time } })

            return result.acknowledged
        } catch (error) {
            return false
        }
    }

    public async resetCommissionCycle(userName?: string): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collection = db.collection<MemberTypeV3>(COLLECTION_MEMBERS)

            // Reiniciar a comissão do membro
            const RESET_COMMISSION = { $set: { state: CommissionState.AVAILABLE, time: 0 } }
            const resultA = await collection.updateMany({ state: CommissionState.AVAILABLE }, RESET_COMMISSION)
            const resultB = await collection.updateMany({ state: CommissionState.CLOSED }, RESET_COMMISSION)

            return (resultA.acknowledged && resultB.acknowledged)
        } catch (error) {
            return false
        }
    }

    public async listCommissionMembers(state: CommissionState): Promise<MemberTypeV3[]> {
        try {
            const db = await this.initialize()
            const collection = db.collection<MemberTypeV3>(COLLECTION_MEMBERS)

            // Listar os membros iterando o cursor
            const result = new Array<MemberTypeV3>()
            const cursor = collection.find({ state })
            while (cursor.hasNext()) {
                const member = await cursor.next()

                if (member)
                    result.push(member)
            }

            return result
        } catch (error) {
            return []
        }
    }

}

export const RemoteDatabase = new RemoteDatabaseImpl()
