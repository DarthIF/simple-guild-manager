import { getAppropriatedString } from '$lib/strings'
import { login_strings } from '$lib/strings/strings'
import type { NullableU } from '$lib/utils/types'

export enum ErrorMessages {
    INVALID = 0,
    INCORRECT = 1,
    CREATE_USER = 2,
    CREATE_SESSION = 3,
    USER_ALREADY_EXISTS = 4,
    DATABASE_ACCESS_ERROR = 5
}

export function getLocalizedErrorMessage(error: NullableU<ErrorMessages>) {
    switch (error) {
        case ErrorMessages.INVALID:
            return getAppropriatedString(login_strings.invalid)

        case ErrorMessages.INCORRECT:
            return getAppropriatedString(login_strings.incorrect)

        case ErrorMessages.CREATE_USER:
            return getAppropriatedString(login_strings.create_user_error)

        case ErrorMessages.CREATE_SESSION:
            return getAppropriatedString(login_strings.create_session_error)

        case ErrorMessages.USER_ALREADY_EXISTS:
            return getAppropriatedString(login_strings.user_already_exists)

        case ErrorMessages.DATABASE_ACCESS_ERROR:
            return getAppropriatedString(login_strings.database_access_error)

        default:
            return 'undefined'
    }
}
