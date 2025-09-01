import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'


export interface User {
    // Autenticação
    name: string
    hash: string
    token: string

    // Personalização
    icon: string
}


const MONGO_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}`
const DATABASE_NAME = 'simple-guild-manager'
const COLLECTION_USERS = 'users'
const COLLECTION_GUILD = 'tempest'
const client = new MongoClient(MONGO_URI)
const db = client.db(DATABASE_NAME)


export async function createUser(username: string, password: string) {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        const collection = db.collection<User>(COLLECTION_USERS)

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

export async function findUser(name: string): Promise<User | null> {
    try {
        const collection = db.collection<User>(COLLECTION_USERS)
        const find = await collection.findOne({ name })

        return find
    } catch (e) {
        console.error(e)
    }

    return null
}


export async function createSession(name: string): Promise<string | null> {
    try {
        const newToken: string = crypto.randomUUID()
        const collection = db.collection<User>(COLLECTION_USERS)

        await collection.updateOne(
            { name },
            { $set: { token: newToken } }
        )

        return newToken
    } catch (e) {
        console.error(e)
    }

    return null
}

export async function findSession(token: string): Promise<User | null> {
    try {
        const collection = db.collection<User>(COLLECTION_USERS)
        const find = await collection.findOne({ token })

        return find
    } catch (e) {
        console.error(e)
    }

    return null
}