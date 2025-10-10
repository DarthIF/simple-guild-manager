import { Collection, Db, FindCursor, MongoClient, type WithId } from 'mongodb'
import bcrypt from 'bcryptjs'
import type { DatabaseAuditLog, DatabaseOperations } from '$lib/common/database/database-interfaces'
import { DEFINITIONS_DEFAULT_ID, UNDEFINED_TEAM, type DefinitionsType, type MemberTypeV3, type EventTeamType, type AuditLogTypeV3, type AuditLogDetailsV3 } from '$lib/common/database/constants-and-types'
import { Actions, CommissionState, GameEvents, Role } from '$lib/common/database/enums'
import { currentUnixTime } from '$lib/utils/time-util'
import { forEachGameEvent, getMemberTeamId, isUndefinedTeamID, setMemberTeamId } from '$lib/common/database/utils'


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
const COLLECTION_EVENTS = 'guild-events'
const COLLECTION_AUDIT_LOG = 'guild-audit-log'


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


class RemoteDatabaseImpl implements UserDatabase, DatabaseOperations, DatabaseAuditLog {
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
            throw new Error('Erro ao iniciar o banco de dados, mongoUri não foi definido.')

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

            const result = await collection.insertOne({
                // Autenticação
                name: username,
                hash: passwordHash,
                token: crypto.randomUUID(),

                // Personalização
                icon: ''
            })

            return result.acknowledged
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

            // Verificar o nome atual
            const definitions = await collection.findOne({ id: DEFINITIONS_DEFAULT_ID })
            const oldName = definitions?.guild

            // Atualizar o nome da guilda
            const updateResult = await collection.updateOne(
                { id: DEFINITIONS_DEFAULT_ID },
                {
                    $set: {
                        id: DEFINITIONS_DEFAULT_ID,
                        guild: newName
                    }
                },
                { upsert: true } // Cria o documento com as definições se não existir
            )

            if (!updateResult.acknowledged)
                return false

            // Adicionar ao registro de auditoria de forma assincrônica
            this.addAuditLog(Actions.SET_GUILD_NAME, { oldName, newName }, userName)

            return true
        } catch (error) {
            return false
        }
    }



    public async addMember(name: string, power: number, userName?: string): Promise<MemberTypeV3 | null> {
        try {
            const db = await this.initialize()
            const collection = db.collection<MemberTypeV3>(COLLECTION_MEMBERS)

            if (isNaN(power))
                power = 0

            // Adicionar o membro
            const id = currentUnixTime().toString()
            const member: MemberTypeV3 = {
                id,
                name,
                power,
                role: Role.MEMBER,
                offline: 0,

                // Comissões
                state: CommissionState.AVAILABLE,
                time: 0,
                missed: 0,

                // Eventos
                worldTree: UNDEFINED_TEAM,
                minesInDungeon: UNDEFINED_TEAM,
                cloudKingdom: UNDEFINED_TEAM,
                cassinoOnYacht: UNDEFINED_TEAM
            }

            const result = await collection.insertOne(member)
            if (!result.acknowledged)
                return null

            // Adicionar ao registro de auditoria de forma assincrônica
            this.addAuditLog(Actions.ADD_MEMBER, { memberId: id, name, power }, userName)

            // Retornar a instancia do membro
            return member
        } catch (error) {
            return null
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

            // Remover o membro das equipes
            await forEachGameEvent(async (gameEvent) => {
                const teamId = getMemberTeamId(member, gameEvent)

                // Verificar se é uma equipe indefinida
                if (isUndefinedTeamID(teamId))
                    return

                // Atualizar as equipes
                const collectionEvents = db.collection<EventTeamType>(COLLECTION_EVENTS)
                await collectionEvents.updateOne({ event: gameEvent, id: teamId }, { $inc: { count: -1 } })
            })

            // Adicionar ao registro de auditoria de forma assincrônica
            this.addAuditLog(Actions.DELETE_MEMBER, { name: member.name }, userName)

            return true
        } catch (error) {
            return false
        }
    }

    public async editMember(memberId: string, newName: string, newPower: number, userName?: string): Promise<MemberTypeV3 | null> {
        try {
            const db = await this.initialize()
            const collection = db.collection<MemberTypeV3>(COLLECTION_MEMBERS)

            // Verificar o membro atual
            const member = await collection.findOne({ id: memberId })
            if (!member)
                return null

            // Salva as informações antigas
            const oldName = member.name
            const oldPower = member.power

            // Atualizar o membro
            const updateResult = await collection.updateOne({ id: memberId }, { $set: { name: newName, power: newPower } })
            if (!updateResult.acknowledged)
                return null

            // Adicionar ao registro de auditoria de forma assincrônica
            this.addAuditLog(Actions.EDIT_MEMBER, { memberId, oldName, oldPower, newName, newPower }, userName)

            return member
        } catch (error) {
            return null
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



    public async createTeam(gameEvent: GameEvents, name: string, userName?: string): Promise<EventTeamType | null> {
        try {
            const db = await this.initialize()
            const collection = db.collection<EventTeamType>(COLLECTION_EVENTS)

            // Criar um novo time
            const id = currentUnixTime().toString()
            const team = {
                event: gameEvent,
                id,
                name,
                count: 0,
                size: 4
            }
            
            const result = await collection.insertOne(team)
            if (!result.acknowledged)
                return null

            // Adicionar ao registro de auditoria de forma assincrônica
            this.addAuditLog(Actions.CREATE_TEAM, { gameEvent, teamId: id, teamName: name }, userName)

            return team
        } catch (error) {
            return null
        }
    }

    public async deleteTeam(gameEvent: GameEvents, teamId: string, userName?: string): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collectionMembers = db.collection<MemberTypeV3>(COLLECTION_MEMBERS)
            const collectionEvents = db.collection<EventTeamType>(COLLECTION_EVENTS)


            // Remover os membros da equipe
            const toUpdate = new Array<MemberTypeV3>()
            const cursor = collectionMembers.find()
            while (await cursor.hasNext()) {
                const member = await cursor.next()
                const currentMemberTeam = getMemberTeamId(member, gameEvent)

                if (member && currentMemberTeam && currentMemberTeam === teamId) {
                    setMemberTeamId(member, gameEvent, UNDEFINED_TEAM)

                    toUpdate.push(member)
                }
            }

            // Atualizar os membros no banco de dados
            for (const member of toUpdate) {
                await collectionMembers.updateOne(
                    { id: member.id },
                    {
                        $set: {
                            worldTree: member.worldTree,
                            minesInDungeon: member.minesInDungeon,
                            cloudKingdom: member.cloudKingdom,
                            cassinoOnYacht: member.cassinoOnYacht,
                        }
                    }
                )
            }

            // Deletar o time
            const deleteResult = await collectionEvents.deleteOne({ id: teamId })

            if (!deleteResult)
                return false

            // Adicionar ao registro de auditoria de forma assincrônica
            this.addAuditLog(Actions.DELETE_TEAM, { gameEvent, teamId }, userName)

            return true
        } catch (error) {
            return false
        }
    }

    public async listTeams(gameEvent: GameEvents): Promise<EventTeamType[]> {
        try {
            const db = await this.initialize()
            const collection = db.collection<EventTeamType>(COLLECTION_EVENTS)

            // Listar todos os times do evento
            const result = new Array<EventTeamType>()
            const cursor = collection.find({ event: gameEvent })
            while (await cursor.hasNext()) {
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
            const collectionEvents = db.collection<EventTeamType>(COLLECTION_EVENTS)

            // Verificar o membro
            const member = await collectionMembers.findOne({ id: memberId })
            if (!member)
                return false

            // Verificar a equipe
            const team = await collectionEvents.findOne({ id: teamId })
            if (!team || team.count >= team.size)
                return false

            // Definir o novo time em que o membro está para esse evento
            setMemberTeamId(member, gameEvent, teamId)

            // Atualizar as informações do membro e do time
            const resultA = await collectionMembers.updateOne({ id: memberId }, { $set: member })
            const resultB = await collectionEvents.updateOne({ id: team.id }, { $inc: { count: 1 } })


            if (!(resultA.acknowledged && resultB.acknowledged))
                return false

            // Adicionar ao registro de auditoria de forma assincrônica
            this.addAuditLog(Actions.ADD_MEMBER_TO_TEAM, { gameEvent, teamId, memberId }, userName)

            return true
        } catch (error) {
            return false
        }
    }

    public async removeMemberFromTeam(gameEvent: GameEvents, teamId: string, memberId: string, userName?: string): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collectionMembers = db.collection<MemberTypeV3>(COLLECTION_MEMBERS)
            const collectionEvents = db.collection<EventTeamType>(COLLECTION_EVENTS)

            // Verificar o membro
            const member = await collectionMembers.findOne({ id: memberId })
            if (!member)
                return false

            // Verificar a equipe
            const team = await collectionEvents.findOne({ id: teamId })
            if (!team || team.count >= team.size)
                return false

            // Definir o novo time em que o membro está para esse evento
            setMemberTeamId(member, gameEvent, UNDEFINED_TEAM)

            // Atualizar as informações do membro e do time 
            const resultA = await collectionMembers.updateOne({ id: memberId }, { $set: member })
            const resultB = await collectionEvents.updateOne({ id: team.id }, { $inc: { count: -1 } })

            if (!(resultA.acknowledged && resultB.acknowledged))
                return false

            // Adicionar ao registro de auditoria de forma assincrônica
            this.addAuditLog(Actions.REMOVE_MEMBER_FROM_TEAM, { gameEvent, teamId, memberId }, userName)

            return true
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

            if (!result.acknowledged)
                return false

            // Adicionar ao registro de auditoria de forma assincrônica
            this.addAuditLog(Actions.COMMISSION_SET_STATE, { memberId, state }, userName)

            return true
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

            if (!(resultA.acknowledged && resultB.acknowledged))
                return false

            // Adicionar ao registro de auditoria de forma assincrônica
            this.addAuditLog(Actions.COMMISSION_RESET_CYCLE, {}, userName)

            return true
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

    public listCommissionMembersSync(state: CommissionState): MemberTypeV3[] { 

        console.error('NAO IMPLEMENTADO listCommissionMembersSync')

        return []
    }



    public async addAuditLog(action: Actions, details: AuditLogDetailsV3, userName?: string): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collection = db.collection<AuditLogTypeV3>(COLLECTION_AUDIT_LOG)

            const time = currentUnixTime()
            const result = await collection.insertOne({
                user: userName,
                unixTime: time,
                action,
                details
            })

            return result.acknowledged
        } catch (error) {
            return false
        }
    }

}

export const RemoteDatabase = new RemoteDatabaseImpl()
