import ToastMessage from "../common/ToastMessage.js"
import ApiClient from "../common/ApiClient.js"

// 프로필 요소
const profileForm = document.querySelector('.profile-form')

// 비밀번호 변경 모달 관련 요소
const passwordModal = document.getElementById('password-modal')
const closeButton = document.querySelector('.close')
const cancelButton = document.getElementById('cancel-password-change')
const passwordForm = document.getElementById('password-change-form')
const newPasswordInput = document.getElementById('new-password')
const confirmPasswordInput = document.getElementById('confirm-password')
const changePasswordButton = document.querySelector('.change-password-btn')

// 로그인 기록 보기 요소
const loginHistoryButton = document.getElementById('login-history-button')

// 로그아웃 요소
const logoutButton = document.querySelector('.logout-btn')

document.addEventListener('DOMContentLoaded', function() {
    
})

profileForm.addEventListener('submit', function(e) {
    e.preventDefault()

    // 폼 데이터 수집
    const formData = new FormData(this)
    const userData = {}

    for (const [key, value] of formData.entries()) {
        userData[key] = value
    }

    // TODO update
})

changePasswordButton.addEventListener('click', function() {
    passwordModal.classList.add('active')
    document.body.style.overflow = 'hidden' // 스크롤 방지
    document.getElementById('current-password').focus()
})

closeButton.addEventListener('click', closePasswordModal)
cancelButton.addEventListener('click', closePasswordModal)
window.addEventListener('click', function(event) {
    if (event.target === passwordModal) {
        closePasswordModal()
    }
})

newPasswordInput.addEventListener('input', function() {
    const password = this.value
    const strength = checkPasswordStrength(password)

    // 기존 강도 표시 제거
    const existingStrength = document.querySelector('.password-strength')
    if (existingStrength) {
        existingStrength.remove()
    }

    if (password.length > 0) {
        const strengthDiv = document.createElement('div')
        strengthDiv.className = `password-strength ${strength}`
        strengthDiv.innerHTML = '<div class="password-strength-bar"></div>'
        this.parentNode.appendChild(strengthDiv)
    }
})

passwordForm.addEventListener('submit', function(e) {
    e.preventDefault()

    const currentPassword = document.getElementById('current-password').value
    const newPassword = newPasswordInput.value
    const confirmPassword = confirmPasswordInput.value

    // 유효성 검사
    let hasError = false

    if (!currentPassword) {
        showError('current-password', '현재 비밀번호를 입력해주세요.')
        hasError = true
    }

    if (!validatePassword(newPassword)) {
        showError('new-password', '비밀번호는 8자 이상, 영문/숫자/특수문자 조합이어야 합니다.')
        hasError = true
    }

    if (newPassword !== confirmPassword) {
        showError('confirm-password', '비밀번호가 일치하지 않습니다.')
        hasError = true
    }

    if (hasError) {
        return
    }

    ApiClient.request({
        url: '/v1/members/password',
        method: 'POST',
        params: { currentPassword, newPassword },
        onSuccess: (response) => {
            ApiClient.logout()
        }
    })
})

loginHistoryButton.addEventListener('click', function() {
    // TODO 로그인 기록
    ToastMessage.error('준비 중입니다.')
})

logoutButton.addEventListener('click', function() {
    if (confirm('정말 로그아웃하시겠습니까?')) {
        document.getElementById('logout-form').submit()
    }
})

// 모달 닫기
function closePasswordModal() {
    passwordModal.classList.remove('active')
    document.body.style.overflow = 'auto' // 스크롤 복원
    passwordForm.reset()

    const errorMessages = document.querySelectorAll('.error-message')
    errorMessages.forEach(msg => msg.classList.remove('show'))

    const existingStrength = document.querySelector('.password-strength')
    if (existingStrength) {
        existingStrength.remove()
    }
}

// 비밀번호 강도 검사
function checkPasswordStrength(password) {
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const isLongEnough = password.length >= 8

    if (isLongEnough && hasLetter && hasNumber && hasSpecial) {
        return 'strong'
    } else if (isLongEnough && ((hasLetter && hasNumber) || (hasLetter && hasSpecial) || (hasNumber && hasSpecial))) {
        return 'medium'
    } else {
        return 'weak'
    }
}

// 비밀번호 유효성 검사
function validatePassword(password) {
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const isLongEnough = password.length >= 8

    return isLongEnough && hasLetter && hasNumber && hasSpecial
}

// 에러 메시지 표시
function showError(fieldId, message) {
    const field = document.getElementById(fieldId)
    let errorDiv = field.parentNode.querySelector('.error-message')

    if (!errorDiv) {
        errorDiv = document.createElement('div')
        errorDiv.className = 'error-message'
        field.parentNode.appendChild(errorDiv)
    }

    errorDiv.textContent = message
    errorDiv.classList.add('show')
    field.focus()
}