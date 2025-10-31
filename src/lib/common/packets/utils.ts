import { Base64 } from "js-base64"

/**
 * Converte um {@link Object} em Json e depois em Base64
 * 
 * @param obj 
 * @returns 
 */
export function b64Stringify(obj: any) {
    const str = JSON.stringify(obj)
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
export function b64Parser(b64Str: string) {
    const str = Base64.decode(b64Str)
    return JSON.parse(str)
}
