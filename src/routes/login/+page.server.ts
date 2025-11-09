import type { PageServerLoad } from './$types'
import { error, fail, redirect, type Actions } from '@sveltejs/kit'
import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { ErrorMessages } from '$lib/common/login/error-messages'
import { RemoteDatabase } from '$lib/server/database/server-database.svelte'


// https://github.com/Michael-Obele/Svelte-MiniApps-sv4/blob/92d451abb5a741a12eba806d31341cd5dc564b89/src/routes/(auth)/login/%2Bpage.server.ts


export const load = (async (event) => {
    const sessionID = event.cookies.get('session')
    const session = undefined // await event.locals.auth()

    if (sessionID || session) {
        return redirect(StatusCodes.SEE_OTHER, '/app')
    }

    return {
        ENABLE_USER_REGISTRATION: process.env.ENABLE_USER_REGISTRATION === 'yes'
    }
}) satisfies PageServerLoad


export const actions = {
    login: async ({ cookies, request }) => {
        // Obter os dados do formulário da solicitação
        const data = await request.formData()
        const username = data.get('username')
        const password = data.get('password')

        // Verifique se o nome de usuário ou a senha são inválidos ou estão ausentes
        if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
            // Retornar um erro 400 com uma mensagem inválida
            return fail(StatusCodes.BAD_REQUEST, { username, message: ErrorMessages.INVALID })
        }

        // Encontre um usuário correspondente
        const user = await RemoteDatabase.findUser(username)
        if (!user) {
            // Retornar um erro 406 com a mensagem de nome de usuário e credenciais
            return fail(StatusCodes.NOT_ACCEPTABLE, { username, message: ErrorMessages.INCORRECT })
        }

        // Verifique se o usuário possui um hash de senha
        if (user.hash) {
            // Compare a senha fornecida com o hash da senha do usuário
            const userPassword = bcrypt.compareSync(password, user.hash)

            // Verifique se a senha está incorreta
            if (!userPassword) {
                // Retornar um erro 406 com a mensagem de nome de usuário e credenciais
                return fail(StatusCodes.NOT_ACCEPTABLE, { username, message: ErrorMessages.INCORRECT })
            }
        } else {
            // Usuário sem senha definida, retornar erro 406 com a mensagem de credenciais
            return fail(StatusCodes.NOT_ACCEPTABLE, { username, message: ErrorMessages.INCORRECT })
        }

        // Atualizar o campo userAuthToken do usuário com um UUID gerado aleatoriamente
        const newToken = await RemoteDatabase.createSession(username)
        if (!newToken) {
            // Retornar erro 500, Isso realmente pode acontecer?
            return fail(StatusCodes.INTERNAL_SERVER_ERROR, { username, message: ErrorMessages.CREATE_SESSION })
        }

        cookies.set('session', newToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 31 // set to 1 month
        })

        console.log('Usuário(a) autenticado: ', username, newToken)

        // Redirecionar para o aplicativo logado
        return redirect(StatusCodes.SEE_OTHER, '/app')
    }
} satisfies Actions