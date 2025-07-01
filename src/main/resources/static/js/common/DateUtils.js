export default class DateUtils {
    static formatDate(input, format = 'yyyy-MM-dd') {
        const date = new Date(input)

        const yyyy = date.getFullYear()
        const MM = String(date.getMonth() + 1).padStart(2, '0')
        const dd = String(date.getDate()).padStart(2, '0')
        const HH = String(date.getHours()).padStart(2, '0')
        const mm = String(date.getMinutes()).padStart(2, '0')
        const ss = String(date.getSeconds()).padStart(2, '0')

        let result = `${yyyy}-${MM}-${dd}`

        if (format.includes('HH')) {
            result += ` ${HH}`
        }

        if (format.includes('mm')) {
            result += `:${mm}`
        }

        if (format.includes('ss')) {
            result += `:${ss}`
        }

        return result
    }
}