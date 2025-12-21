import { Collection, Db, FindCursor, MongoClient, type MongoClientOptions, type WithId } from 'mongodb'
import bcrypt from 'bcryptjs'
import type { DatabaseAuditLog, DatabaseOperationResult_SetCommissionState, DatabaseOperations } from '$lib/common/database/database-interfaces'
import type { CreateSessionResult, UserDatabase, UserV2 } from './user'
import { DEFINITIONS_DEFAULT_ID, UNDEFINED_TEAM, type DefinitionsType, type MemberTypeV3, type EventTeamType, type AuditLogTypeV3, type AuditLogDetailsV3, type DatabaseTypeV3, type DatabaseExportOptionsType } from '$lib/common/database/constants-and-types'
import { Actions, CommissionState, GameEvents, Role } from '$lib/common/database/enums'
import { currentUnixTime } from '$lib/utils/time-util'
import { forEachGameEvent, getGameEventField, getMemberTeamId, isUndefinedTeamID, setMemberTeamId } from '$lib/common/database/utils'
import { fancyLog } from '../util/server-log'
import { tryParseInt } from '$lib/utils/number-util'
import { FindResult } from '$lib/utils/database/find-result'


const TAG = 'ServerDatabase'


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

function getMongoOptions(): MongoClientOptions {
    if (process.env.ENABLE_VERCEL_MODE !== 'yes')
        return {}

    return {
        appName: 'devrel.vercel.integration',
        maxIdleTimeMS: 5000
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
        if (!this.mongoURI)
            throw new Error('Erro ao iniciar o banco de dados, mongoUri não foi definido.')

        try {
            // Criar um cliente
            if (!this.client) {
                const options = getMongoOptions()
                this.client = new MongoClient(this.mongoURI, options)
            }

            // Acessar o banco de dados
            if (!this.db)
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
            const saltRounds = tryParseInt(process.env.BCRYPT_SALT_ROUNDS, 10)
            const db = await this.initialize()
            const collection = db.collection<UserV2>(COLLECTION_USERS)
            const passwordHash = await bcrypt.hash(password, saltRounds)

            const result = await collection.insertOne({
                // Autenticação
                name: username,
                hash: passwordHash,
                token: crypto.randomUUID(),

                // Personalização
                icon: '',

                // Personagens
                characters: [],

                // Administração
                admin: false,
                permissions: []
            })

            return result.acknowledged
        } catch (e) {
            fancyLog(TAG, 'Erro inesperado: ', e)
        }

        return false
    }

    public async findUser(name: string | null | undefined): Promise<FindResult<UserV2>> {
        fancyLog(TAG, `Procurando pelo nome de usuário [${name}]`)

        if (typeof name !== 'string') {
            fancyLog(TAG, 'O nome de usuário não é uma string')
            return new FindResult<UserV2>(null, FindResult.STATUS_ERROR_FUNCTION_PARAMS)
        }

        try {
            const db = await this.initialize()
            const collection = db.collection<UserV2>(COLLECTION_USERS)

            const find = await collection.findOne({ name })

            fancyLog(TAG, 'Resultado da busca', find?.name)

            return new FindResult<UserV2>(find, FindResult.STATUS_OK)
        } catch (e) {
            fancyLog(TAG, 'Erro inesperado: ', e)
            return new FindResult<UserV2>(null, FindResult.STATUS_ERROR_DATABASE)
        }
    }

    public async fundUserByToken(token: string | null | undefined): Promise<FindResult<UserV2>> {
        fancyLog(TAG, `Procurando pelo token de usuário [${token}]`)

        if (typeof token !== 'string')
            return new FindResult<UserV2>(null, FindResult.STATUS_ERROR_FUNCTION_PARAMS)

        try {
            const db = await this.initialize()
            const collection = db.collection<UserV2>(COLLECTION_USERS)

            const find = await collection.findOne({ token })

            return new FindResult<UserV2>(find, FindResult.STATUS_OK)
        } catch (e) {
            fancyLog(TAG, 'Erro inesperado: ', e)
            return new FindResult<UserV2>(null, FindResult.STATUS_ERROR_DATABASE)
        }
    }

    public async createSession(name: string): Promise<CreateSessionResult> {
        try {
            const db = await this.initialize()
            const collection = db.collection<UserV2>(COLLECTION_USERS)
            const newToken: string = crypto.randomUUID()

            const result = await collection.updateOne({ name }, { $set: { token: newToken } })

            return {
                token: newToken,
                success: result.acknowledged,
                databaseError: false
            }
        } catch (e) {
            fancyLog(TAG, 'Erro inesperado: ', e)

            return {
                token: '',
                success: false,
                databaseError: true,
            }
        }
    }

    public async findSession(token: string): Promise<FindResult<UserV2>> {
        try {
            const db = await this.initialize()
            const collection = db.collection<UserV2>(COLLECTION_USERS)

            const find = await collection.findOne({ token })

            return new FindResult<UserV2>(find, FindResult.STATUS_OK)
        } catch (e) {
            fancyLog(TAG, 'Erro inesperado: ', e)
            return new FindResult<UserV2>(null, FindResult.STATUS_ERROR_DATABASE)
        }
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
            console.error(error)
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
                server: 0,
                name,
                earnings: 0,
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
                cassinoOnYacht: UNDEFINED_TEAM,
                infernoRally: UNDEFINED_TEAM,
            }

            const result = await collection.insertOne(member)
            if (!result.acknowledged)
                return null

            // Adicionar ao registro de auditoria de forma assincrônica
            this.addAuditLog(Actions.ADD_MEMBER, { memberId: id, name, power }, userName)

            // Retornar a instancia do membro
            return member
        } catch (error) {
            console.error(error)
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
            console.error(error)
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

            // Salva as informações antigas para o log
            const oldName = member.name
            const oldPower = member.power

            // Atualizar as informações para o objeto de retorno
            member.name = newName
            member.power = newPower

            // Atualizar o membro
            const updateResult = await collection.updateOne({ id: memberId }, { $set: { name: newName, power: newPower } })
            if (!updateResult.acknowledged)
                return null

            // Adicionar ao registro de auditoria de forma assincrônica
            this.addAuditLog(Actions.EDIT_MEMBER, { memberId, oldName, oldPower, newName, newPower }, userName)

            return member
        } catch (error) {
            console.error(error)
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
            console.error(error)
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
            console.error(error)
            return null
        }
    }

    public async deleteTeam(gameEvent: GameEvents, teamId: string, userName?: string): Promise<boolean> {
        try {
            const db = await this.initialize()
            const collectionMembers = db.collection<MemberTypeV3>(COLLECTION_MEMBERS)
            const collectionEvents = db.collection<EventTeamType>(COLLECTION_EVENTS)

            // Atualizar os membros no banco de dados
            const updateField = getGameEventField(gameEvent)
            await collectionMembers.updateMany(
                { [updateField]: teamId },
                { $set: { [updateField]: UNDEFINED_TEAM } }
            )

            // Deletar o time
            const deleteResult = await collectionEvents.deleteOne({ event: gameEvent, id: teamId })

            if (!deleteResult)
                return false

            // Adicionar ao registro de auditoria de forma assincrônica
            this.addAuditLog(Actions.DELETE_TEAM, { gameEvent, teamId }, userName)

            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    public async listTeams(gameEvent: GameEvents): Promise<EventTeamType[]> {
        try {
            const db = await this.initialize()
            const collection = db.collection<EventTeamType>(COLLECTION_EVENTS)

            // Listar todos os times do evento
            const result = new Array<EventTeamType>()
            const allEventTeams = await collection.find({ event: gameEvent }).toArray()
            for (const eventTeam of allEventTeams) {
                if (eventTeam)
                    result.push(eventTeam)
            }

            return result
        } catch (error) {
            console.error(error)
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
            console.error(error)
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

            // Atualizar as informações do membro para o evento
            const updateField = getGameEventField(gameEvent)
            const resultA = await collectionMembers.updateOne({ id: memberId }, { $set: { [updateField]: UNDEFINED_TEAM } })

            // Atualizar as informações do time 
            const resultB = await collectionEvents.updateOne({ id: teamId }, { $inc: { count: -1 } })

            if (!(resultA.acknowledged && resultB.acknowledged)) {
                return false
            }

            // Adicionar ao registro de auditoria de forma assincrônica
            this.addAuditLog(Actions.REMOVE_MEMBER_FROM_TEAM, { gameEvent, teamId, memberId }, userName)

            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    public async listFreeMembersForEvent(gameEvent: GameEvents): Promise<MemberTypeV3[]> {
        try {
            const db = await this.initialize()

            // Listar os membros iterando o cursor
            const result = new Array<MemberTypeV3>()
            const allMembers = await findMembersOfTeam(db, gameEvent, UNDEFINED_TEAM).toArray()

            for (const member of allMembers) {
                if (member)
                    result.push(member)
            }

            return result
        } catch (error) {
            console.error(error)
            return []
        }
    }



    public async setCommissionState(memberId: string, state: CommissionState, updateTime: boolean, userName?: string): Promise<DatabaseOperationResult_SetCommissionState> {
        try {
            const db = await this.initialize()
            const collection = db.collection<MemberTypeV3>(COLLECTION_MEMBERS)

            // Atualizar a comissão do membro
            const time = updateTime ? currentUnixTime() : 0
            const result = await collection.updateOne({ id: memberId }, { $set: { state, time } })

            if (!result.acknowledged)
                return { updated: false }

            // Adicionar ao registro de auditoria de forma assincrônica
            this.addAuditLog(Actions.COMMISSION_SET_STATE, { memberId, state }, userName)

            return {
                updated: true,
                memberId,
                state,
                time
            }
        } catch (error) {
            console.error(error)
            return { updated: false }
        }
    }

    public async resetCommissionCycle(userName?: string): Promise<boolean> {
        try {
            fancyLog(TAG, 'Tentando reiniciar o ciclo de comissões...')

            const db = await this.initialize()
            const collection = db.collection<MemberTypeV3>(COLLECTION_MEMBERS)

            // Reiniciar a comissão do membro
            const RESET_COMMISSION = { $set: { state: CommissionState.AVAILABLE, time: 0 } }
            const resultA = await collection.updateMany({ state: CommissionState.AVAILABLE }, RESET_COMMISSION)
            const resultB = await collection.updateMany({ state: CommissionState.CLOSED }, RESET_COMMISSION)

            if (!(resultA.acknowledged && resultB.acknowledged)) {
                console.warn(`Erro desconhecido durante a operação: resultA=${resultA.acknowledged} resultB=${resultB.acknowledged}`)
                return false
            }

            // Adicionar ao registro de auditoria de forma assincrônica
            this.addAuditLog(Actions.COMMISSION_RESET_CYCLE, {}, userName)

            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    public async listCommissionMembers(state: CommissionState): Promise<MemberTypeV3[]> {
        try {
            const db = await this.initialize()
            const collection = db.collection<MemberTypeV3>(COLLECTION_MEMBERS)

            // Listar os membros iterando o cursor
            const result = new Array<MemberTypeV3>()
            const members = await collection.find({ state }).toArray()
            for (const member of members) {
                if (member)
                    result.push(member)
            }

            return result
        } catch (error) {
            console.error(error)
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
            console.error(error)
            return false
        }
    }



    public async createExportableDatabase(exportOptions: DatabaseExportOptionsType): Promise<Partial<DatabaseTypeV3>> {
        console.log('  ➜  ExportableDatabase')

        const db = await this.initialize()
        const exportedDB: Partial<DatabaseTypeV3> = {}

        try {
            if (exportOptions.definitions) {
                try {
                    console.log('  ➜  ExportableDatabase: definitions')

                    const collection = db.collection<DefinitionsType>(COLLECTION_DEFINITIONS, { timeoutMS: 0 })
                    const definitions = await collection.findOne({ id: DEFINITIONS_DEFAULT_ID })

                    if (definitions) {
                        // @ts-ignore
                        delete definitions._id

                        exportedDB.definitions = definitions
                    }
                } catch (error) {
                    console.error(error)
                }
            }

            if (exportOptions.members) {
                try {
                    console.log('  ➜  ExportableDatabase: members')
                    exportedDB.members = []

                    const collection = db.collection<MemberTypeV3>(COLLECTION_MEMBERS, { timeoutMS: 0 })
                    const allMembers = await collection.find().toArray()

                    for (const member of allMembers) {
                        if (!member)
                            continue

                        // @ts-ignore
                        delete member._id

                        exportedDB.members.push(member)
                    }
                } catch (error) {
                    console.error(error)
                }
            }

            if (exportOptions.events) {
                try {
                    console.log('  ➜  ExportableDatabase: events')
                    exportedDB.events = []

                    const collection = db.collection<EventTeamType>(COLLECTION_EVENTS, { timeoutMS: 0 })
                    const allEventTeams = await collection.find().toArray()

                    for (const eventTeam of allEventTeams) {
                        if (!eventTeam)
                            continue

                        // @ts-ignore
                        delete eventTeam._id

                        exportedDB.events.push(eventTeam)
                    }

                } catch (error) {
                    console.error(error)
                }
            }

            if (exportOptions.auditLog) {
                try {
                    console.log('  ➜  ExportableDatabase: auditLog')
                    exportedDB.auditLog = []

                    const collection = db.collection<AuditLogTypeV3>(COLLECTION_AUDIT_LOG, { timeoutMS: 0 })
                    const allAuditLogs = await collection.find().toArray()

                    for (const auditLog of allAuditLogs) {
                        if (!auditLog)
                            continue

                        // @ts-ignore
                        delete auditLog._id

                        exportedDB.auditLog.push(auditLog)
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        } catch (error) {
            console.error(error)
        }

        return exportedDB
    }

}

export const RemoteDatabase = new RemoteDatabaseImpl()


// Adicionar o URL do banco de dados
if (process.env.ENABLE_VERCEL_MODE === 'yes') {
    // Url para o vercel
    if (!process.env.MONGODB_URI)
        throw new Error('Environment variable MONGODB_URI is not defined')

    RemoteDatabase.setMongoUri(process.env.MONGODB_URI)
} else {
    // Url para o modo local
    if (!process.env.MONGODB_LOCAL_URI)
        throw new Error('Environment variable MONGODB_LOCAL_URI is not defined')

    RemoteDatabase.setMongoUri(process.env.MONGODB_LOCAL_URI)
}
