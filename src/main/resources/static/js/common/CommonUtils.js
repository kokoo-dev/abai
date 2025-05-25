export default class CommonUtils {
    static postToUrl(url, params) {
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = url

        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const input = document.createElement('input')
                input.type = 'hidden'
                input.name = key
                input.value = params[key]
                form.appendChild(input)
            }
        }

        const csrfToken = document.querySelector(
            'meta[name="_csrf"]').getAttribute('content')
        const csrfInput = document.createElement('input')
        csrfInput.type = 'hidden'
        csrfInput.name = '_csrf'
        csrfInput.value = csrfToken
        form.appendChild(csrfInput)

        document.body.appendChild(form)
        form.submit()
    }

    static getTemplateNode(templateId = '') {
        const template = document.getElementById(templateId)
        return template.content.cloneNode(true)
    }

    static generateUUID() {
        let array = new Uint8Array(16)
        crypto.getRandomValues(array)

        array[6] = (array[6] & 0x0f) | 0x40
        array[8] = (array[8] & 0x3f) | 0x80

        return [...array].map(
            (b, i) => (i === 4 || i === 6 || i === 8 || i === 10) ? '-'
                + b.toString().padStart(2, '0') : b.toString().padStart(2,
                '0')).join('')
    }
}
