import ToastMessage from "./ToastMessage.js"

export default class ApiClient {
    static async request({
        url = '',
        method = 'GET',
        headers = {},
        params = {},
        onSuccess = () => {},
        onError = (error) => this.#onDefaultError(error),
        onFinally = () => {}
    } = {}) {
        await this.#call({
            url: `/api${url}`,
            method,
            headers,
            params,
            onSuccess,
            onError,
            onFinally
        })
    }

    static async logout() {
        const message = '비밀번호를 성공적으로 변경하였습니다.'
        await this.#call({
            url: `/logout`,
            method: 'POST',
            onSuccess: () => { location.replace(`/login?message=${message}`) }
        })
    }

    static async #call({
        url = '',
        method = 'GET',
        headers = {},
        params = {},
        onSuccess = () => {},
        onError = (error) => this.#onDefaultError(error),
        onFinally = () => {}
    } = {}) {
        try {
            const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content')
            const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content')

            const upperMethod = method.toUpperCase()
            let fullUrl = url
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

    static #onDefaultError(error) {
        const message = error?.response?.message ?? '잠시 후 다시 시도해 주세요.'
        ToastMessage.error(message)
    }
}