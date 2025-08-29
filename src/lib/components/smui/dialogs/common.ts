export type DialogCloseEvent = CustomEvent<{ action: string }>

export type OnDialogClosedListener = (e: DialogCloseEvent) => void


export enum DialogActions {
    ACCEPT = 'accept',
    CANCEL = 'cancel',

    COMMISSION_CLOSE_TODAY = 'close_today',
    COMMISSION_ALREADY_CLOSED = 'already_closed',

    COMMISSION_AVAILABLE = 'available',
    COMMISSION_INACTIVE = 'inactive',

    COMMISSION_MISSED = 'missed'
}
