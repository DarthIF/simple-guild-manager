import type { PageServerLoad } from './$types'
import { error, fail, redirect, type Actions } from '@sveltejs/kit'
import bcrypt from 'bcryptjs'
import * as database from '$lib/server/database/simple-guild-database'


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
    login: async ({ cookies, request }) => {
        // Get the form data from the request
        const data = await request.formData()
        const username = data.get('username')
        const password = data.get('password')

        // Check if the username or password is invalid or missing
        if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
            // Return a 400 error with an invalid message
            return fail(400, { invalid: true })
        }

        // Find a user with the provided username
        const user = await database.findUser(username)

        // Check if the user exists
        if (!user) {
            // Return a 400 error with the username and credentials message
            return fail(400, { username, credentials: true, test: 'usuário não encontrado' })
        }

        // Check if the user has a password hash
        if (user.hash) {
            // Compare the provided password with the user's password hash
            const userPassword = bcrypt.compareSync(password, user.hash)

            // Check if the password is incorrect
            if (!userPassword) {
                // Return a 400 error with the username and credentials message
                return fail(400, { username, credentials: true })
            }
        } else {
            // Return a 400 error with the username and credentials message
            return fail(400, { username, credentials: true })
        }

        // Update the user's userAuthToken field with a randomly generated UUID
        const newToken = await database.createSession(username)
        if (!newToken) {
            return fail(400, { username, session: true })
        }

        cookies.set('session', newToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 31 // set to 1 month
        })

        console.log('Usuário(a) autenticado: ', username, newToken)

        return redirect(302, '/app')
    },
    register: async ({ cookies, request }) => {
        // Get the form data from the request
        const data = await request.formData()
        const username = data.get('username')
        const password = data.get('password')

        // Checks if the username and password are valid strings and not empty
        if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
            // Returns a 400 error if the username or password is invalid
            return error(400, 'Username and Password must be a string')
        }

        // Checks if a user with the same username already exists in the database
        const existingUser = await database.findUser(username)

        // If a user with the same username already exists
        if (existingUser) {
            // Returns a 400 error with the username and user flag
            return fail(400, { username, user: true })
        }

        // Calls the createUser function to create a new user with the provided information
        const createdUser = await database.createUser(username, password)

        // If an error occurred 
        if (!createdUser) {
            return fail(400, { error: 'Something Unexpected happened!' })
        }

        // Redirects the user to the login page
        return redirect(303, '/auth')
    }
} satisfies Actions