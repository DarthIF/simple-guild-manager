export function clearMongoID<T>(obj: T) {
    // @ts-ignore
    if (obj._id)
        // @ts-ignore
        delete obj._id

    return obj
}