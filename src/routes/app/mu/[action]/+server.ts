import type { RequestHandler } from './$types'
import type { PostTypes } from '$lib/common/database/post-types'
import { RemoteDatabase } from '$lib/server/database/server-database.svelte'
import { StatusCodes } from 'http-status-codes'
import { send } from '$lib/utils/http-util'
import { createActionResolver } from '$lib/common/database/action-resolver'
import { fancyLog } from '$lib/server/util/server-log'


const TAG = 'mu+server.svelte'
const ActionResolver = createActionResolver(RemoteDatabase)


export const GET = (async ({ request, cookies }) => {
    return send(StatusCodes.UNAUTHORIZED)
}) satisfies RequestHandler


export const POST = (async ({ request, cookies, params }) => {
    const token = cookies.get('session')
    const user = await RemoteDatabase.fundUserByToken(token)

    fancyLog(TAG, `[${token}] está acessando a API ➜  mu/${params.action}`)

    // Verificar o usuário
    if (user === null) {
        fancyLog(TAG, `[${token}] não foi autorizado`)
        return send(StatusCodes.UNAUTHORIZED)
    }

    // Ler o conteúdo do post
    const data: PostTypes = await request.json()
    const resolver = ActionResolver.get(params.action)

    fancyLog(TAG, `[${token}] post content ➜  `, data)

    if (data && resolver)
        return await resolver(user, data)


    // Ação invalida
    return send(StatusCodes.BAD_REQUEST)

}) satisfies RequestHandler