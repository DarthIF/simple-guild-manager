/**
 * @deprecated
 */
export interface User {
    // Autenticação
    name: string
    hash: string
    token: string

    // Personalização
    icon: string
}

export interface UserV2 extends User {

    /**
     * Ids dos personagens desse usuário
     */
    characters: number[]

    /**
     * Se o usuário é Admin ou não, se for ignora as outras permissões
     */
    admin: boolean

    /**
     * Permissões desse usuário
     */
    permissions: UserPermission[]

}

/**
 * Permissões do Usuário
 */
export interface UserPermission {
    /**
     * Id da guilda
     */
    id: string

    /**
     * Permissão para gerenciar a guilda
     */
    manageGuild: boolean

    /**
     * Permissão para gerenciar equipes
     */
    manageTeams: boolean

    /**
     * Permissão para ver o registro de auditoria
     */
    auditLog: boolean
}

export interface UserDatabase {

    /**
     * Função para registrar um novo usuário
     * 
     * @param username 
     * @param password 
     */
    createUser(username: string, password: string): Promise<boolean>

    /**
     * Função para encontrar um usuário pelo nome
     * 
     * @param name 
     */
    findUser(name: string | null | undefined): Promise<FindUserResult>

    /**
     * Função para encontrar um usuário pelo token de seção
     * 
     * @param token 
     */
    fundUserByToken(token: string | null | undefined): Promise<FindUserResult>

    /**
     * Cria um novo token de seção para o usuário
     * 
     * @param name 
     */
    createSession(name: string): Promise<CreateSessionResult>

    /**
     * Procura um usuário pelo token de seção
     * 
     * @param token 
     */
    findSession(token: string): Promise<FindUserResult>

}

export interface CreateSessionResult {
    token: string
    success: boolean
    databaseError: boolean
}

export interface FindUserResult {
    user: UserV2|null
    databaseError: boolean
}
