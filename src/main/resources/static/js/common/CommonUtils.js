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

        const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content')
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
}
