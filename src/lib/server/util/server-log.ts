import { padLeftZeros } from '$lib/utils/number-util'



export function fancyLog(tag: string, ...contents: any[]) {
    const date = new Date()
    const time = [
        padLeftZeros(date.getHours()),
        padLeftZeros(date.getMinutes()),
        padLeftZeros(date.getSeconds())
    ].join(':')

    if (process.env.ENABLE_VERCEL_MODE)
        // Texto normal para log no vercel
        console.log(`${time} [${tag}]`, ...contents)
    else
        // Texto colorido para log no console
        console.log(`\x1b[0m${time} \x1b[36m[${tag}]\x1b[0m`, ...contents)
} 