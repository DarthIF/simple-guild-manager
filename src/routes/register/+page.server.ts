import type { PageServerLoad } from './$types'
import { error, fail, redirect, type Actions } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import { ErrorMessages } from '$lib/common/login/error-messages'
import { RemoteDatabase } from '$lib/server/database/server-database.svelte';
import { fancyLog } from '$lib/server/util/server-log'


const TAG = '+page.server'


// https://github.com/Michael-Obele/Svelte-MiniApps-sv4/blob/92d451abb5a741a12eba806d31341cd5dc564b89/src/routes/(auth)/login/%2Bpage.server.ts


export const load = (async (event) => {
    const sessionID = event.cookies.get('session')
    const session = undefined // await event.locals.auth()

    if (sessionID || session) {
        return redirect(303, '/app')
    }

    return {
        ENABLE_USER_REGISTRATION: process.env.ENABLE_USER_REGISTRATION === 'yes'
    }
}) satisfies PageServerLoad


export const actions = {
    register: async ({ cookies, request }) => {
        // Obter os dados do formulário da solicitação
        const data = await request.formData()
        const username = data.get('username')
        const password_1 = data.get('password_1')
        const password_2 = data.get('password_2')


        // Verifique se o nome de usuário ou a senha são inválidos ou estão ausentes
        if (typeof username !== 'string'
            || typeof password_1 !== 'string'
            || typeof password_2 !== 'string'
            || password_1 !== password_2) {
            // Retornar um erro 400 com uma mensagem inválida
            return fail(StatusCodes.BAD_REQUEST, { username, message: ErrorMessages.INVALID })
        }

        fancyLog(TAG, `Recebido um pedido para registar um novo usuário: ${username}`)

        // Encontre um usuário correspondente
        const existingUser = await RemoteDatabase.findUser(username)
        if (existingUser.exists) {
            fancyLog(TAG, `O usuário [${username}] já está registrado!`)

            // Retornar um erro 409 com a mensagem de que o usuário ja existe
            return fail(StatusCodes.CONFLICT, { username, message: ErrorMessages.USER_ALREADY_EXISTS })
        }

        // Chama a função createUser para criar um novo usuário com as informações fornecidas
        const createdUser = await RemoteDatabase.createUser(username, password_1)
        if (!createdUser) {
            fancyLog(TAG, 'Erro ao registar o usuário no banco de dados.')

            // Retornar erro 500, Isso realmente pode acontecer?
            return fail(StatusCodes.INTERNAL_SERVER_ERROR, { username, message: ErrorMessages.CREATE_USER })
        }

        fancyLog(TAG, `O usuário [${username}] foi registrado com sucesso!`)

        // Redirecionar para a tela de login
        return redirect(StatusCodes.SEE_OTHER, '/login')
    }
} satisfies Actions