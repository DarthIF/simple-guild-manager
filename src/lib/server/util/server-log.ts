import { padLeftZeros } from "$lib/utils/number-util"

export function fancyLog(tag: string, ...contents: any[]) {
    const date = new Date()
    const time = [
        padLeftZeros(date.getHours()),
        padLeftZeros(date.getMinutes()),
        padLeftZeros(date.getSeconds())
    ].join(':')

    console.log(`\x1b[0m${time} \x1b[36m[${tag}]\x1b[0m`, ...contents)
} 