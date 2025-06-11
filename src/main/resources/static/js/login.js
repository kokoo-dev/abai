import ToastMessage from "./common/ToastMessage.js"

document.addEventListener('DOMContentLoaded', function() {
    // URL 파라미터에서 message 확인
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('message')) {
        const message = urlParams.get('message')

        ToastMessage.error(message)
    }
})

const loginIdInput = document.getElementById("login-id")
const rememberCheckbox = document.getElementById("remember")
const loginForm = document.querySelector(".login-form")

// 페이지 로드 시 저장된 아이디 복원
loadSavedUsername()

loginIdInput.focus()

// 아이디 저장 체크박스 변경 이벤트
rememberCheckbox.addEventListener('change', function() {
    if (!this.checked) {
        // 체크 해제 시 저장된 아이디 삭제
        localStorage.removeItem('rememberedUsername')
    }
})

// 로그인 폼 제출 시 아이디 저장 처리
loginForm.addEventListener('submit', function(e) {
    const username = loginIdInput.value.trim()

    if (rememberCheckbox.checked && username) {
        // 아이디 저장 체크박스가 체크되어 있으면 아이디 저장
        localStorage.setItem('rememberedUsername', username)
    } else {
        // 체크되어 있지 않으면 저장된 아이디 삭제
        localStorage.removeItem('rememberedUsername')
    }
})

// 저장된 아이디를 불러와서 입력 필드에 설정하는 함수
function loadSavedUsername() {
    const savedUsername = localStorage.getItem('rememberedUsername')
    const loginIdInput = document.getElementById("login-id")
    const rememberCheckbox = document.getElementById("remember")
    
    if (savedUsername) {
        loginIdInput.value = savedUsername
        rememberCheckbox.checked = true
        
        // 아이디가 이미 입력되어 있으면 비밀번호 필드로 포커스 이동
        const passwordInput = document.getElementById("login-password")
        if (passwordInput) {
            passwordInput.focus()
        }
    }
}