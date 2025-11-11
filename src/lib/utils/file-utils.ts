export function readFileAsString(blob: Blob): Promise<string | null> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            const result = e.target?.result
            if (typeof result === 'string')
                resolve(result)
            else
                resolve(null)
        }
        reader.onerror = (e) => resolve(null)
        reader.onabort = (e) => resolve(null)

        reader.readAsText(blob, 'utf-8')
    })
}


export function downloadJsonFile(fileName: string, jsonFile: string) {
    const downloadUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonFile)
    const element = document.createElement('a')
    element.setAttribute('href', downloadUri)
    element.setAttribute('download', fileName)
    element.click()
}
