import { StatusCodes } from 'http-status-codes';
import type { RequestHandler } from './$types'
import { error, fail, redirect, type Actions } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ cookies, request }) => {
    // Apagar o cookie da sessão
    cookies.delete('session', { path: '/' })

    // Redirecionar para a tela de login
    return redirect(StatusCodes.SEE_OTHER, '/login')
}
