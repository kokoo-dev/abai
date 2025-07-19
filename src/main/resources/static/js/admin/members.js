import ApiClient from '../common/ApiClient.js'
import ToastMessage from '../common/ToastMessage.js'
import CommonUtils from "../common/CommonUtils.js"
import DateUtils from "../common/DateUtils.js"

const addMemberButton = document.getElementById('add-member-btn')
const searchInput = document.getElementById('search-input')

// 모달
const memberModal = document.getElementById('member-modal')
const withdrawModal = document.getElementById('withdraw-modal')

const memberForm = document.getElementById('member-form')
const cancelMemberButton = document.getElementById('cancel-member')
const confirmWithdrawalButton = document.getElementById('confirm-withdrawal')
const cancelDeleteButton = document.getElementById('cancel-delete')

document.addEventListener('DOMContentLoaded', () => {
    memberHandler.init()
})

addMemberButton.addEventListener('click', () => {
    memberHandler.openMemberModal()
})

// 검색 기능
searchInput.addEventListener('input', (e) => {
    memberHandler.handleSearch(e.target.value)
})

memberModal.querySelector('.close').addEventListener('click', () => {
    memberHandler.closeMemberModal()
})

withdrawModal.querySelector('.close').addEventListener('click', () => {
    memberHandler.closeWithdrawModal()
})

// 모달 외부 클릭 시 닫기
memberModal.addEventListener('click', (e) => {
    if (e.target === memberModal) {
        memberHandler.closeMemberModal()
    }
})

withdrawModal.addEventListener('click', (e) => {
    if (e.target === withdrawModal) {
        memberHandler.closeWithdrawModal()
    }
})

memberForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if (!confirm('저장하시겠습니까?')) {
        return
    }

    memberHandler.handleMemberSubmit()
})

cancelMemberButton.addEventListener('click', () => {
    memberHandler.closeMemberModal()
})

confirmWithdrawalButton.addEventListener('click', () => {
    memberHandler.withdrawMember()
})

cancelDeleteButton.addEventListener('click', () => {
    memberHandler.closeWithdrawModal()
})

const memberHandler = {
    currentMemberId: null,
    isEditMode: false,
    init() {
        memberHandler.loadMembers()
    },
    loadMembers() {
        ApiClient.request({
            url: '/v1/admin/members',
            method: 'GET',
            onSuccess: (response) => {
                memberHandler.renderMemberList(response)
            }
        })
    },
    renderMemberList(members) {
        const tbody = document.getElementById('member-tbody')
        tbody.innerHTML = ''

        members.forEach(member => {
            const row = memberHandler.createMemberRow(member)
            tbody.appendChild(row)
        })
    },
    createMemberRow(member) {
        const row = CommonUtils.getTemplateNode('members-template')
        row.querySelector('.name').textContent = member.name
        row.querySelector('.login-id').textContent = member.loginId
        row.querySelector('.uniform-number').textContent = `#${member.uniformNumber}`

        row.querySelector('.status-badge-td').dataset.status = member.status
        const statusBadge = row.querySelector('.status-badge')
        statusBadge.textContent = member.status === 'ACTIVATED' ? '활성' : '탈퇴'
        statusBadge.classList.add(`status-${member.status.toLowerCase()}`)

        row.querySelector('.birthday').textContent = DateUtils.formatDate(member.birthday, 'yyyy-MM-dd')

        const editButton = row.querySelector('.edit-member-btn')
        const withdrawButton = row.querySelector('.withdraw-member-btn')

        if (member.isEditable) {
            editButton.dataset.id = member.id
            editButton.addEventListener('click', () => {
                memberHandler.editMember(member.id)
            })

            withdrawButton.dataset.id = member.id
            withdrawButton.addEventListener('click', () => {
                memberHandler.openWithdrawModal(member.id)
            })
        } else {
            editButton.disabled = true
            withdrawButton.disabled = true
        }

        return row
    },
    handleSearch(searchTerm) {
        const rows = document.querySelectorAll('#member-tbody tr')
        rows.forEach(row => {
            const name = row.querySelector('.name').textContent.toLowerCase()
            const loginId = row.querySelector('.login-id').textContent.toLowerCase()
            const searchLower = searchTerm.toLowerCase()
            
            if (name.includes(searchLower) || loginId.includes(searchLower)) {
                row.style.display = ''
            } else {
                row.style.display = 'none'
            }
        })
    },
    openMemberModal(memberId = null) {
        memberHandler.isEditMode = memberId !== null
        memberHandler.currentMemberId = memberId

        const title = document.getElementById('modal-title')
        const form = document.getElementById('member-form')

        title.textContent = memberHandler.isEditMode ? '사용자 수정' : '새 사용자 추가'
        
        // 폼 초기화
        form.reset()
        document.getElementById('member-id').value = ''

        if (memberHandler.isEditMode) {
            memberHandler.loadMemberData(memberId)
        }

        memberModal.classList.add('active')
    },
    loadMemberData(memberId) {
        ApiClient.request({
            url: `/v1/admin/members/${memberId}`,
            method: 'GET',
            onSuccess: (response) => {
                memberHandler.fillMemberForm(response)
            }
        })
    },
    fillMemberForm(member) {
        document.getElementById('member-id').value = member.id
        document.getElementById('login-id').value = member.loginId
        document.getElementById('name').value = member.name
        document.getElementById('uniform-number').value = member.uniformNumber
        document.getElementById('status').value = member.status
        document.getElementById('birthday').value = member.birthday || ''

        // 포지션 체크박스 설정
        memberHandler.setPositionCheckboxes(member.positions || [])
        memberHandler.setRoleCheckboxes(member.roles || [])
    },
    setPositionCheckboxes(positions) {
        // 선택된 포지션 체크
        positions.forEach(position => {
            const checkbox = document.getElementById(`position-${position.position}`)
            if (checkbox) {
                checkbox.checked = true
            }
        })
    },
    setRoleCheckboxes(roles) {
        // 선택된 포지션 체크
        roles.forEach(role => {
            const checkbox = document.getElementById(`role-${role}`)
            if (checkbox) {
                checkbox.checked = true
            }
        })
    },
    closeMemberModal() {
        memberModal.classList.remove('active')
        memberHandler.isEditMode = false
        memberHandler.currentMemberId = null
    },
    handleMemberSubmit() {
        const requestBody = memberHandler.getRequestBody()

        if (memberHandler.isEditMode) {
            memberHandler.updateMember(requestBody)
        } else {
            memberHandler.createMember(requestBody)
        }
    },
    getRequestBody() {
        const form = document.getElementById('member-form');
        const formData = new FormData(form);

        // 체크된 포지션
        const positions = [];
        document.querySelectorAll('.position-checkbox:checked').forEach(checkbox => {
            positions.push(checkbox.value);
        });

        // 체크된 권한
        const roles = [];
        document.querySelectorAll('.role-checkbox:checked').forEach(checkbox => {
            roles.push(checkbox.value);
        });

        return {
            loginId: formData.get('loginId'),
            name: formData.get('name'),
            uniformNumber: parseInt(formData.get('uniformNumber')),
            status: formData.get('status'),
            birthday: formData.get('birthday') || null,
            positions: positions,
            roles: roles,
        }
    },
    createMember(requestBody) {
        ApiClient.request({
            url: '/v1/admin/members',
            method: 'POST',
            params: requestBody,
            onSuccess: (response) => {
                memberHandler.loadMembers()
                memberHandler.closeMemberModal()
                ToastMessage.success('새 사용자가 추가되었습니다.')
            }
        })
    },
    updateMember(requestBody) {
        const memberId = document.getElementById('member-id').value
        ApiClient.request({
            url: `/v1/admin/members/${memberId}`,
            method: 'PUT',
            params: requestBody,
            onSuccess: (response) => {
                memberHandler.loadMembers()
                memberHandler.closeMemberModal()
                ToastMessage.success('사용자 정보가 수정되었습니다.')
            }
        })
    },
    editMember(memberId) {
        memberHandler.openMemberModal(memberId);
    },
    openWithdrawModal(memberId, memberName) {
        memberHandler.currentMemberId = memberId
        const body = withdrawModal.querySelector('.modal-body p')
        body.textContent = `정말로 탈퇴 처리하시겠습니까?`
        withdrawModal.classList.add('active')
    },
    closeWithdrawModal() {
        withdrawModal.classList.remove('active')
        memberHandler.currentMemberId = null
    },
    withdrawMember() {
        ApiClient.request({
            url: `/v1/admin/members/${memberHandler.currentMemberId}/withdrawal`,
            method: 'POST',
            onSuccess: (response) => {
                memberHandler.loadMembers()
                memberHandler.closeWithdrawModal()
                ToastMessage.success('탈퇴가 완료되었습니다.')
            }
        })
    }
}