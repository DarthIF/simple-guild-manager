import { Base64 } from "js-base64"

/**
 * Converte um {@link Object} em Json e depois em Base64
 * 
 * @param obj 
 * @returns 
 */
export function packetEncode(toEncode: any) {
    const str = JSON.stringify(toEncode)
    return Base64.encode(str)
        .replaceAll('\n', ' ')
        .trim()
}

/**
 * Analisa uma string Base64 para converte-la em um JSON e depois 
 * em um {@link Object} javascript 
 * 
 * @param b64Str 
 * @returns 
 */
export function packetDecode(toDecode: any) {
    if (toDecode === undefined)
        return undefined

    if (toDecode === null || typeof toDecode !== 'string' || toDecode === '')
        return null

    try {
        const str = Base64.decode(toDecode)
        return JSON.parse(str)
    } catch (error) {
        console.error(error)
        return null
    }
}
