import type { RequestHandler } from './$types'
import type { Undefinable } from '$lib/utils/types'
import { produce } from 'sveltekit-sse'
import { fancyLog } from '$lib/server/util/server-log'
import { packetEncode } from '$lib/common/packets/utils'
import { nextPacket, type ServerPacketType } from '$lib/server/packets'
import { setUserOnline } from '$lib/server/online'

const TAG = 'sync+server.ts'
const WAIT_DELAY = 2000
const SENDED_DELAY = 100


function delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, milliseconds)
    })
}


export const POST = (({ request }) => {
    let token = request.headers.get('session')
    let isConnected = false
    let packet: Undefinable<ServerPacketType> = undefined

    if (!token)
        token = 'null'

    return produce(async (connection) => {
        fancyLog(TAG, `Nova conexão estabelecida para token: ${token}`)

        // Definir o usuário como online
        setUserOnline(token, true)

        // Loop para atualizar os pacotes para esse cliente
        isConnected = true
        while (isConnected) {
            try {
                // Aguardar um tempo para surgir um pacote
                await delay(packet ? SENDED_DELAY : WAIT_DELAY)

                // Usuário está desconectado
                if (!isConnected)
                    break

                // Ler o pacote pendente
                packet = nextPacket()

                // Não tem um pacote, pular para o proximo loop
                if (!packet) {
                    fancyLog(TAG, `Sem pacotes para: ${token}`)
                    continue
                }

                // Ignorar o pacote se estiver sendo enviado para o autor
                if (packet.author === token) {
                    fancyLog(TAG, `Pacote ignorado para ${token}`)
                    continue
                }

                // Enviar o pacote para o cliente
                const { error } = connection.emit('message', packetEncode(packet.send))

                // Parar o loop em caso de erro
                if (error) {
                    fancyLog(TAG, `Erro ao enviar mensagem ${token} ➜ `, error?.message)
                    isConnected = false
                    break
                }

                // A mensagem foi enviada para o cliente
                fancyLog(TAG, `Mensagem enviada para ${token}`)
            } catch (error) {
                fancyLog(TAG, `Erro inesperado para ${token} ➜ `, error)
                isConnected = false
                break
            }
        }

        // Finalizar a conexão
        connection.lock.set(false)
    }, {
        ping: 5_000,
        stop: () => {
            setUserOnline(token, false)
            isConnected = false
        }
    })

}) satisfies RequestHandler
