export default class ApiClient {
    static async request({
        url = '',
        method = 'GET',
        headers = {},
        params = {},
        onSuccess = () => {},
        onError = () => {},
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