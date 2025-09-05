import type { RequestHandler } from './$types'
import { findUser } from '$lib/server/database/simple-guild-database'
import { RemoteDatabase } from '$lib/server/database/database-server.svelte'


// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status


export const GET = (async ({ request, cookies }) => {
    return new Response('Unauthorized', { status: 401 })
}) satisfies RequestHandler

export const POST = (async ({ request, cookies }) => {
    const token = cookies.get('session')
    const user = await findUser(token)
    if (user === null)
        return new Response('Unauthorized', { status: 401 })

    const data = await request.json()
    if (!data || typeof data.name !== 'string' || typeof data.power !== 'number')
        return new Response('Bad Request', { status: 400 })

    const added = await RemoteDatabase.addMember(data.name, data.power)
    if (added)
        return new Response('Created', { status: 201 })
    else
        return new Response('Bad Gateway', { status: 502 })
}) satisfies RequestHandler