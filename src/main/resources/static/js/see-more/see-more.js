import ToastMessage from "../common/ToastMessage.js"
import ApiClient from "../common/ApiClient.js"
import DateUtils from "../common/DateUtils.js"

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

// 로그인 기록 모달 관련 요소
const loginHistoryModal = document.getElementById('login-history-modal')
const loginHistoryButton = document.getElementById('login-history-button')
const loginHistoryTbody = document.getElementById('login-history-tbody')
const loadMoreButton = document.getElementById('load-more-btn')

// 로그아웃 요소
const logoutButton = document.querySelector('.logout-btn')

document.addEventListener('DOMContentLoaded', function() {
    passwords.initEvents()
    loginHistory.initEvents()
    my.getProfile()
})

profileForm.addEventListener('submit', function(e) {
    e.preventDefault()

    my.saveProfile()
})

logoutButton.addEventListener('click', function() {
    if (confirm('정말 로그아웃하시겠습니까?')) {
        document.getElementById('logout-form').submit()
    }
})

const passwords = {
    initEvents() {
        changePasswordButton.addEventListener('click', function() {
            passwordModal.classList.add('active')
            document.body.style.overflow = 'hidden' // 스크롤 방지
            document.getElementById('current-password').focus()
        })

        closeButton.addEventListener('click', passwords.closeModal)
        cancelButton.addEventListener('click', passwords.closeModal)
        window.addEventListener('click', function(event) {
            if (event.target === passwordModal) {
                passwords.closeModal()
            }
        })

        newPasswordInput.addEventListener('input', function() {
            const password = this.value
            const strength = passwords.checkStrength(password)

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
                passwords.showError('current-password', '현재 비밀번호를 입력해주세요.')
                hasError = true
            }

            if (!passwords.validate(newPassword)) {
                passwords.showError('new-password', '비밀번호는 8자 이상, 영문/숫자/특수문자 조합이어야 합니다.')
                hasError = true
            }

            if (newPassword !== confirmPassword) {
                passwords.showError('confirm-password', '비밀번호가 일치하지 않습니다.')
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
    },
    closeModal() {
        passwordModal.classList.remove('active')
        document.body.style.overflow = 'auto' // 스크롤 복원
        passwordForm.reset()

        const errorMessages = document.querySelectorAll('.error-message')
        errorMessages.forEach(msg => msg.classList.remove('show'))

        const existingStrength = document.querySelector('.password-strength')
        if (existingStrength) {
            existingStrength.remove()
        }
    },
    checkStrength(password) {
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
    },
    validate(password) {
        const hasLetter = /[a-zA-Z]/.test(password)
        const hasNumber = /\d/.test(password)
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
        const isLongEnough = password.length >= 8

        return isLongEnough && hasLetter && hasNumber && hasSpecial
    },
    showError(fieldId, message) {
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
}

const my = {
    isSaveEnabled: false,
    preferredPositions: [],
    originalPositions: [],
    getProfile() {
        ApiClient.request({
            url: `/v1/my/profile`,
            method: 'GET',
            onSuccess: (response) => {
                my.setProfileInput(response)
            }
        })
    },
    saveProfile() {
        if (!my.isSaveEnabled) {
            return
        }

        my.isSaveEnabled = false

        const requestBody = {}
        const elements = profileForm.elements
        for (let element of elements) {
            if (!element.name) {
                continue
            }

            requestBody[element.name] = element.value
        }

        delete requestBody.positions

        const currentPositions = Array.from(document.querySelectorAll('.position-checkbox'))
            .filter(it => it.checked)
            .map(it => it.value)

        requestBody.deletePositions = my.originalPositions.filter(it => !currentPositions.includes(it))
        requestBody.createPositions = currentPositions.filter(it => !my.originalPositions.includes(it))

        ApiClient.request({
            url: `/v1/my/profile`,
            method: 'POST',
            params: requestBody,
            onSuccess: (response) => {
                my.setProfileInput(response)
                ToastMessage.success('프로필이 저장되었습니다.')
            }
        })
    },
    setProfileInput(response) {
        profileForm.reset()

        document.getElementById('name').value = response.name
        document.getElementById('height').value = response.height
        document.getElementById('weight').value = response.weight
        document.getElementById('left-foot').value = response.leftFoot
        document.getElementById('right-foot').value = response.rightFoot
        document.getElementById('birthday').value = response.birthday

        response.positions.forEach(it => {
            document.getElementById(`position-${it.position}`).checked = true
        })

        my.originalPositions = response.positions.map(it => it.position)
        my.isSaveEnabled = true
    }
}

const loginHistory = {
    lastId: null,
    hasNext: true,
    initState() {
        loginHistory.lastId = null
        loginHistory.hasNext = true
        loginHistoryTbody.innerHTML = ''
    },
    initEvents() {
        // 더 보기 버튼 클릭 이벤트
        loadMoreButton.addEventListener('click', function() {
            if (!loginHistory.hasNext) {
                ToastMessage.error('이력이 존재하지 않습니다.')
            }

            loginHistory.getList()
        })

        // 로그인 기록 모달 닫기 이벤트
        loginHistoryModal.addEventListener('click', function(event) {
            if (event.target === loginHistoryModal) {
                loginHistory.closeModal()
            }
        })

        // 로그인 기록 모달의 닫기 버튼 이벤트
        const loginHistoryCloseButtons = loginHistoryModal.querySelectorAll('.close')
        loginHistoryCloseButtons.forEach(button => {
            button.addEventListener('click', loginHistory.closeModal)
        })

        loginHistoryButton.addEventListener('click', function() {
            loginHistory.openModal()
        })
    },
    getList() {
        if (!loginHistory.hasNext) {
            return
        }

        ApiClient.request({
            url: '/v1/my/login-histories',
            method: 'GET',
            params: {
                lastId: loginHistory.lastId
            },
            onSuccess: (response) => {
                loginHistory.lastId = response.lastId
                loginHistory.hasNext = response.hasNext

                response.contents.forEach(history => {
                    const row = document.createElement('tr')
                    row.innerHTML = `
                        <td>${DateUtils.formatDate(history.createdAt, 'yyyy-MM-dd HH:mm:ss')}</td>
                        <td>${history.ip}</td>
                    `
                    loginHistoryTbody.appendChild(row)
                })
            }
        })
    },
    openModal() {
        loginHistoryModal.classList.add('active')
        document.body.style.overflow = 'hidden'
        loginHistory.getList()
    },
    closeModal() {
        loginHistoryModal.classList.remove('active')
        document.body.style.overflow = 'auto'
        loginHistory.initState()
    }
}