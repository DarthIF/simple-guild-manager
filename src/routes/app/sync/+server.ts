import type { RequestHandler } from './$types'
import { produce } from 'sveltekit-sse'
import { fancyLog } from '$lib/server/util/server-log'
import { b64Stringify } from '$lib/common/packets/utils'

const TAG = 'sync+server.ts'
const DELAY_MS = 2000


function delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, milliseconds)
    })
}


export const POST = (({ request }) => {
    let token = request.headers.get('session')

    if (!token)
        token = 'null'

    return produce(async (connection) => {
        fancyLog(TAG, `Nova conexão estabelecida para token: ${token}`)

        let isConnected = true

        while (isConnected) {
            try {
                const packet = {
                    action: 'foo',
                    data: 'bar',
                    timestamp: new Date().toISOString()
                }
                const { error } = connection.emit('message', b64Stringify(packet))

                // Parar o loop em caso de erro
                if (error) {
                    fancyLog(TAG, `Erro ao enviar mensagem ${token} ➜ `, error?.message)
                    isConnected = false
                    return
                }

                // A mensagem foi enviada para o cliente
                fancyLog(TAG, `Mensagem enviada para ${token}`)

                // Aguardar
                await delay(DELAY_MS)
            } catch (error) {
                fancyLog(TAG, `Erro inesperado para ${token} ➜ `, error)
                isConnected = false
                return
            }
        }
    }, { ping: 5000 })

}) satisfies RequestHandler
