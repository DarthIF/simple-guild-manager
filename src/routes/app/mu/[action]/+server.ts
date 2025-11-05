import type { RequestHandler } from './$types'
import type { PostTypes } from '$lib/common/database/post-types'
import { RemoteDatabase } from '$lib/server/database/server-database.svelte'
import { StatusCodes } from 'http-status-codes'
import { send } from '$lib/utils/http-util'
import { fancyLog } from '$lib/server/util/server-log'
import { ServerActionResolver } from '$lib/server/database/server-actions-resolver'
import { parseActions } from '$lib/common/database/enums'


const TAG = 'mu+server.svelte'
const actionResolver = new ServerActionResolver(RemoteDatabase)


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

    fancyLog(TAG, `[${token}] post content ➜  `, data)

    const action = parseActions(params.action)
    return await actionResolver.resolve(action, user, data)
}) satisfies RequestHandler