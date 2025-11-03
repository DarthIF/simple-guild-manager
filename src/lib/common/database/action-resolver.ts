import type { DatabaseOperations } from './database-interfaces'
import type { User } from '$lib/server/database/user'
import type { PostTypes } from './post-types'


type ActionResolverFunction = (user: User | null, data: PostTypes) => Promise<Response>


/**
 * @deprecated
 */
export function createActionResolver(database: DatabaseOperations) {
    return new Map<string, ActionResolverFunction>()
}
