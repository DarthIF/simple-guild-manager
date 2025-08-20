/**
 * Convert RGB components to hexadecimal and pad with leading zeros if necessary
 * 
 * @param c Red Green or Blue value of a color
 * @returns HEX value
 */
function toHex(c: number) {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}



export type HslReference = {
    h: number
    s: number
    l: number
}

export function hslToHex({ h, s, l }: HslReference, hash: boolean = true) {
    // Convert HSL values to a range suitable for calculations
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    // Determine RGB based on hue
    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }

    // Add the lightness offset and round to the nearest integer
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    const hex = toHex(r) + toHex(g) + toHex(b)
    return hash ? '#' + hex : hex
}

export function extractHSL(hslString: string): HslReference {
    const hslValues = hslString.trim().replace('hsl(', '').replace(')', '');
    const valuesArray = hslValues.split(/[\s,]+/);

    const h = parseFloat(valuesArray[0]);
    const s = parseFloat(valuesArray[1].replace('%', ''));
    const l = parseFloat(valuesArray[2].replace('%', ''));

    return { h, s, l }
}