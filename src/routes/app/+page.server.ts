import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { RemoteDatabase } from '$lib/server/database/server-database.svelte';

export const load = (async ({ cookies }) => {
    const session = cookies.get('session')

    if (!session)
        // Usuário sem um token de seção, redireciona-lo para o login
        redirect(303, '/login')

    const result = await RemoteDatabase.findSession(session)
    if (!result.user) {
        // Apagar o cookie invalido
        cookies.delete('session', { path: '/' })

        // Redirecionar para o login
        redirect(303, '/login')
    }

    return {
        name: result.user.name,
        icon: result.user.icon,
        token: session
    }
}) satisfies PageServerLoad