export { StatusCodes, ReasonPhrases } from 'http-status-codes'


// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status


export function isInformationalResponse(response: Response | number) {
    const code: number = response instanceof Response ? response.status : response

    return code >= 100 && code <= 199
}

export function isSuccessfulResponse(response: Response | number) {
    const code: number = response instanceof Response ? response.status : response

    return code >= 200 && code <= 299
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