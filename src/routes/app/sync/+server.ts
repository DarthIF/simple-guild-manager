import type { RequestHandler } from './$types'
import type { Nullable } from '$lib/utils/types'
import type { PacketType } from '$lib/common/packets/type'
import { produce, type Connection } from 'sveltekit-sse'
import { fancyLog } from '$lib/server/util/server-log'
import { packetEncode } from '$lib/common/packets/utils'
import { nextPacket, type ServerPacketType } from '$lib/server/packets'
import { setUserOnline } from '$lib/server/online'
import { RemoteDatabase } from '$lib/server/database/server-database.svelte'
import { Actions } from '$lib/common/database/enums'

const TAG = 'sync+server.ts'
const WAIT_DELAY = 2000
const SENDED_DELAY = 100


function delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, milliseconds)
    })
}

async function sendDatabase(connection: Connection, token: string) {
    const exportedDB = await RemoteDatabase.createExportableDatabase({
        definitions: true,
        members: true,
        events: true
    })

    const packet: PacketType = {
        action: Actions.SYNC_ONLY_DATABASE_LOAD,
        exported: exportedDB
    }

    const { error } = connection.emit('message', packetEncode(packet))
    if (error) {
        fancyLog(TAG, `Erro ao enviar o banco de dados para ${token} ➜ `, error?.message)
    }
}


export const POST = (({ request }) => {
    let token = request.headers.get('session')
    let isConnected = false
    let packet: Nullable<ServerPacketType> = null

    return produce(async (connection) => {
        // Token invalido
        if (!token)
            return


        // Validar o token primeiro


        // Usuário valido
        fancyLog(TAG, `Nova conexão estabelecida para token: ${token}`)

        // Definir o usuário como online
        setUserOnline(token, true)

        // Enviar o banco de dados para o cliente
        sendDatabase(connection, token)

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
                packet = nextPacket(token)

                // Não tem um pacote, pular para o proximo loop
                if (!packet) {
                    // fancyLog(TAG, `Sem pacotes para: ${token}`)
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
                    fancyLog(TAG, `Erro ao enviar pacote para ${token} ➜ `, error?.message)
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
        ping: 5000,
        stop: () => {
            isConnected = false

            if (token)
                setUserOnline(token, false)
        }
    })

}) satisfies RequestHandler
