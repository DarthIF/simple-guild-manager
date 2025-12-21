import type { NullableU } from '../types'

export class FindResult<T> {
    public static STATUS_OK = 0
    public static STATUS_ERROR_FUNCTION_PARAMS = 1 << 0
    public static STATUS_ERROR_QUERYING = 1 << 1
    public static STATUS_ERROR_DATABASE = 1 << 2

    public value: NullableU<T>
    public status: number

    public constructor(value: NullableU<T>, status: number   ) {
        this.value = value
        this.status = status
    }

    public get exists(): boolean {
        return this.value !== null && this.value !== undefined
    }

}