import ToastMessage from "./ToastMessage.js"

export default class ApiClient {
    static async request({
        url = '',
        method = 'GET',
        headers = {},
        params = {},
        onSuccess = () => {},
        onError = () => { ToastMessage.error('잠시 후 다시 시도해 주세요.') },
        onFinally = () => {}
    } = {}) {
        try {
            const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content')
            const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content')

            const upperMethod = method.toUpperCase()
            let fullUrl = `/api${url}`
            const fetchOptions = {
                method: upperMethod,
                headers: {
                    'Content-Type': 'application/json',
                    [csrfHeader]: csrfToken,
                    ...headers
                }
            }

            if (['GET', 'DELETE'].includes(upperMethod) && params && Object.keys(params).length > 0) {
                for (const key in params) {
                    if (params[key] === null) {
                        delete params[key]
                    }
                }

                const queryString = new URLSearchParams(params).toString()
                fullUrl += (url.includes('?') ? '&' : '?') + queryString
            }

            if (['POST', 'PUT'].includes(upperMethod)) {
                fetchOptions.body = JSON.stringify(params)
            }

            const result = await fetch(fullUrl, fetchOptions)
            const contentType = result.headers.get('content-type')

            let response
            if (contentType && contentType.includes('application/json')) {
                response = await result.json()
            } else {
                response = await result.text()
            }

            if (result.ok) {
                onSuccess(response)
            } else {
                onError({ status: result.status, response: response })
            }
        } catch (error) {
            onError({ error })
        } finally {
            onFinally()
        }
    }
}