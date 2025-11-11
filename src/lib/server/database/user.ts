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

    fundUserByToken(token: string | null | undefined): Promise<User | null>

    createSession(name: string): Promise<string | null>

    findSession(token: string): Promise<User | null>

}