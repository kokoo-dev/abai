import ToastMessage from "./common/ToastMessage.js"

document.addEventListener('DOMContentLoaded', function() {
    // URL 파라미터에서 message 확인
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('message')) {
        const message = urlParams.get('message')

        ToastMessage.error(message)
    }
})