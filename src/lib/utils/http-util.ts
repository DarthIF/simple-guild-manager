import { getReasonPhrase, type StatusCodes } from 'http-status-codes'
export { StatusCodes, ReasonPhrases } from 'http-status-codes'


// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status


export function isInformationalResponse(response: Response | number) {
    const code: number = response instanceof Response ? response.status : response

    return code >= 100 && code <= 199
}

export function isSuccessfulResponse(response: Response | number) {
    if (response instanceof Response)
        return response.ok

    return response >= 200 && response <= 299
}

export function isRedirectionMessage(response: Response | number) {
    const code: number = response instanceof Response ? response.status : response

    return code >= 300 && code <= 399
}

export function isClientErrorResponse(response: Response | number) {
    const code: number = response instanceof Response ? response.status : response

    return code >= 400 && code <= 499
}

export function isServerErrorResponse(response: Response | number) {
    const code: number = response instanceof Response ? response.status : response

    return code >= 500 && code <= 599
}

/**
 * Função para criar um objeto {@link Response} com um código de status especifico
 * 
 * @param status 
 * @param body 
 * @returns 
 */
export function send(status: StatusCodes, body: object | null = null): Response {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status

    if (body)
        return new Response(JSON.stringify(body), { status })

    return new Response(getReasonPhrase(status), { status })
}