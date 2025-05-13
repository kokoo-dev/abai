export default class ToastMessage {
    static success(message) {
        this.#show(message, 'success')
    }

    static error(message) {
        this.#show(message, 'error')
    }

    static #show(message, type = '') {
        // 기존 토스트 제거
        const existingToast = document.querySelector('.toast')
        if (existingToast) {
            existingToast.remove()
        }

        const toast = document.createElement('div')
        toast.className = `toast ${type}`
        toast.innerText = message
        document.body.appendChild(toast)

        // 일정 시간 후 토스트 제거
        setTimeout(() => {
            if (toast && toast.parentElement) {
                toast.remove()
            }
        }, 3000)
    }
}