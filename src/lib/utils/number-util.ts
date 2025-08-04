// 1.000 -> 1k
// 10.000 -> 10k
// 100.000 -> 100k
// 1.000.000 -> 1M
// 10.000.000 -> 10M
// 100.000.000 -> 100M
// 1.000.000.000 -> 1B
// 10.000.000.000 -> 10B
// 100.000.000.000 -> 100B


export function parseCompactNumber(numberString: string): number {
    // Preparar a string
    numberString = numberString.replace(',', '.').toUpperCase()

    const regex = /^(\d+\.?\d*)([KMB])?$/
    const match = numberString.match(regex)

    if (!match) {
        console.error('Numero em um formato inválido.', numberString)
        return NaN
    }

    const numericValue = parseFloat(match[1]) // O valor numérico
    let suffix = match[2]                     // O sufixo (pode ser undefined)

    console.log(match)

    if (!suffix)
        return numericValue

    suffix = suffix.toUpperCase()
    switch (suffix) {
        case 'K': // Mil
            return numericValue * 1_000
        case 'M': // Milhão
            return numericValue * 1_000_000;
        case 'B': // Bilhão
            return numericValue * 1_000_000_000;
        default:
            console.error('Sufixo desconhecido.')
            return NaN
    }
}

export function formatNumberCompact(num: number) {
    // Definimos os limites e os sufixos
    const KILO = 1000
    const MILLION = 1000 * KILO    // 1.000.000
    const BILLION = 1000 * MILLION // 1.000.000.000

    //Sinal para os numeros negativos
    const sign = num < 0 ? '-' : ''
    num = Math.abs(num)

    let formattedNum
    let suffix = ''

    if (num >= BILLION) {
        formattedNum = (num / BILLION).toFixed(1) // Uma casa decimal
        suffix = 'B'
    } else if (num >= MILLION) {
        formattedNum = (num / MILLION).toFixed(1)
        suffix = 'M'
    } else if (num >= KILO) {
        formattedNum = (num / KILO).toFixed(1)
        suffix = 'K'
    } else {
        formattedNum = num.toString()
    }

    // Remove o '.0' do final
    if (formattedNum.endsWith('.0')) {
        formattedNum = formattedNum.slice(0, -2)
    }

    return sign + formattedNum + suffix;
}