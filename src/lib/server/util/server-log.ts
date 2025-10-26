export function fancyLog(tag: string, ...contents: any[]) {
    const date = new Date()
    const time = [date.getHours(), date.getMinutes(), date.getSeconds()].join(':')

    console.log(`\x1b[0m${time} \x1b[36m[${tag}] \x1b[0m`, ...contents)
} 