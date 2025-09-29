import type { RequestHandler } from './$types'
import type { PostTypes } from '$lib/common/database/post-types'
import { RemoteDatabase } from '$lib/server/database/server-database.svelte'
import { StatusCodes } from 'http-status-codes'
import { send } from '$lib/utils/http-util'
import { createActionResolver } from '$lib/common/database/action-resolver'


const ActionResolver = createActionResolver(RemoteDatabase)


export const GET = (async ({ request, cookies }) => {
    return send(StatusCodes.UNAUTHORIZED)
}) satisfies RequestHandler


export const POST = (async ({ request, cookies, params }) => {
    const token = cookies.get('session')
    const user = await RemoteDatabase.findUser(token)


    // Verificar o usuário
    if (user === null)
        return send(StatusCodes.UNAUTHORIZED)


    // Ler o conteúdo do post
    const data: PostTypes = await request.json()
    const resolver = ActionResolver.get(params.action)

    if (data && resolver)
        return await resolver(user, data)


    // Ação invalida
    return send(StatusCodes.BAD_REQUEST)

}) satisfies RequestHandler