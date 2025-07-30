// 물품 관리 페이지 JavaScript
import ApiClient from '../common/ApiClient.js'
import ToastMessage from '../common/ToastMessage.js'
import CommonUtils from "../common/CommonUtils.js"
import DateUtils from "../common/DateUtils.js"

const addEquipmentButton = document.getElementById('add-equipment-btn')
const searchInput = document.getElementById('search-input')
const searchButton = document.getElementById('search-btn')
const typeFilter = document.getElementById('type-filter')
const statusFilter = document.getElementById('status-filter')

// 모달
const equipmentModal = document.getElementById('equipment-modal')
const deleteModal = document.getElementById('delete-modal')

const equipmentForm = document.getElementById('equipment-form')
const cancelEquipmentButton = document.getElementById('cancel-equipment')
const confirmDeleteButton = document.getElementById('confirm-delete')
const cancelDeleteButton = document.getElementById('cancel-delete')

document.addEventListener('DOMContentLoaded', () => {
    equipmentHandler.init()
})

addEquipmentButton.addEventListener('click', () => {
    equipmentHandler.openEquipmentModal()
})

// 검색 기능
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        equipmentHandler.page.name = e.target.value ?? null
        equipmentHandler.renderEquipmentList(true)
    }
})

searchButton.addEventListener('click', (e) => {
    equipmentHandler.page.name = searchInput.value ?? null
    equipmentHandler.renderEquipmentList(true)
})

// 유형 필터
typeFilter.addEventListener('change', (e) => {
    equipmentHandler.page.type = e.target.value ?? null
    equipmentHandler.renderEquipmentList(true)
})

// 상태 필터
statusFilter.addEventListener('change', (e) => {
    equipmentHandler.page.status = e.target.value ?? null
    equipmentHandler.renderEquipmentList(true)
})

equipmentModal.querySelector('.close').addEventListener('click', () => {
    equipmentHandler.closeEquipmentModal()
})

deleteModal.querySelector('.close').addEventListener('click', () => {
    equipmentHandler.closeDeleteModal()
})

// 모달 외부 클릭 시 닫기
equipmentModal.addEventListener('click', (e) => {
    if (e.target === equipmentModal) {
        equipmentHandler.closeEquipmentModal()
    }
})

deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        equipmentHandler.closeDeleteModal()
    }
})

equipmentForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if (!confirm('저장하시겠습니까?')) {
        return
    }

    equipmentHandler.handleEquipmentSubmit()
})

cancelEquipmentButton.addEventListener('click', () => {
    equipmentHandler.closeEquipmentModal()
})

confirmDeleteButton.addEventListener('click', () => {
    equipmentHandler.deleteEquipment()
})

cancelDeleteButton.addEventListener('click', () => {
    equipmentHandler.closeDeleteModal()
})

const equipmentHandler = {
    page: {
        hasNext: true,
        lastId: null,
        name: null,
        type: null,
        status: null,
        observer: new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        equipmentHandler.renderEquipmentList(false)
                    }
                })
            },
            {
                root: null,
                threshold: 0.1
            }
        ),
        init() {
            equipmentHandler.page.hasNext = true
            equipmentHandler.page.lastId = null
        }
    },
    currentEquipmentId: null,
    isEditMode: false,

    init() {
        equipmentHandler.renderEquipmentList(true)
    },

    renderEquipmentList(isNew = false) {
        if (isNew === true) {
            equipmentHandler.page.init()
        }

        if (!equipmentHandler.page.hasNext) {
            return
        }

        ApiClient.request({
            url: '/v1/admin/equipments',
            method: 'GET',
            params: {
                lastId: equipmentHandler.page.lastId,
                name: equipmentHandler.page.name,
                type: equipmentHandler.page.type,
                status: equipmentHandler.page.status
            },
            onSuccess: (response) => {
                equipmentHandler.page.lastId = response.lastId
                equipmentHandler.page.hasNext = response.hasNext

                const tbody = document.getElementById('equipment-tbody')
                if (isNew) {
                    tbody.innerHTML = ''
                }
                response.contents.forEach(equipment => {
                    const row = equipmentHandler.createEquipmentRow(equipment)
                    tbody.appendChild(row)
                })

                equipmentHandler.page.observer.disconnect()
                equipmentHandler.observeLastItem()
            }
        })
    },

    observeLastItem() {
        const items = document.getElementById('equipment-tbody').querySelectorAll('tr')
        const lastItem = items[items.length - 1]

        if (lastItem) {
            equipmentHandler.page.observer.observe(lastItem)
        }
    },

    createEquipmentRow(equipment) {
        const row = CommonUtils.getTemplateNode('equipment-template')

        row.querySelector('.id').textContent = equipment.id
        row.querySelector('.name').textContent = equipment.name
        row.querySelector('.type-badge').textContent = equipment.type.name
        row.querySelector('.owner').textContent = equipment.member.name
        row.querySelector('.status-badge').textContent = equipment.status.name
        row.querySelector('.status-badge').className = `status-badge ${equipment.status.value.toLowerCase()}`
        row.querySelector('.created-date').textContent = DateUtils.formatDate(equipment.createdAt, 'yyyy-MM-dd HH:mm:ss')

        const editButton = row.querySelector('.edit-equipment-btn')
        const deleteButton = row.querySelector('.delete-equipment-btn')

        editButton.dataset.id = equipment.id
        editButton.addEventListener('click', () => {
            equipmentHandler.editEquipment(equipment.id)
        })

        deleteButton.dataset.id = equipment.id
        deleteButton.addEventListener('click', () => {
            equipmentHandler.openDeleteModal(equipment.id)
        })

        return row
    },

    openEquipmentModal(equipmentId = null) {
        equipmentHandler.isEditMode = equipmentId !== null
        equipmentHandler.currentEquipmentId = equipmentId

        const title = document.getElementById('modal-title')
        const form = document.getElementById('equipment-form')

        title.textContent = equipmentHandler.isEditMode ? '물품 수정' : '새 물품 추가'
        
        // 폼 초기화
        form.reset()
        document.getElementById('equipment-id').value = ''

        if (equipmentHandler.isEditMode) {
            equipmentHandler.loadEquipmentData(equipmentId)
        }

        equipmentModal.classList.add('active')
    },

    loadEquipmentData(equipmentId) {
        ApiClient.request({
            url: `/v1/admin/equipments/${equipmentId}`,
            method: 'GET',
            onSuccess: (response) => {
                equipmentHandler.fillEquipmentForm(response)
            }
        })
    },

    fillEquipmentForm(equipment) {
        document.getElementById('equipment-id').value = equipment.id
        document.getElementById('name').value = equipment.name
        document.getElementById('type').value = equipment.type.value
        document.getElementById('owner').value = equipment.member.id
        document.getElementById('status').value = equipment.status.value
        document.getElementById('description').value = equipment.description || ''
    },

    closeEquipmentModal() {
        equipmentModal.classList.remove('active')
        equipmentHandler.isEditMode = false
        equipmentHandler.currentEquipmentId = null
    },

    handleEquipmentSubmit() {
        const requestBody = equipmentHandler.getRequestBody()

        if (equipmentHandler.isEditMode) {
            equipmentHandler.updateEquipment(requestBody)
        } else {
            equipmentHandler.createEquipment(requestBody)
        }
    },

    getRequestBody() {
        const form = document.getElementById('equipment-form')
        const formData = new FormData(form)

        return {
            name: formData.get('name'),
            memberId: formData.get('owner'),
            type: formData.get('type'),
            status: formData.get('status'),
            description: formData.get('description')
        }
    },

    createEquipment(requestBody) {
        ApiClient.request({
            url: '/v1/admin/equipments',
            method: 'POST',
            params: requestBody,
            onSuccess: (response) => {
                equipmentHandler.renderEquipmentList(true)
                equipmentHandler.closeEquipmentModal()
                ToastMessage.success('새 물품이 추가되었습니다.')
            }
        })
    },

    updateEquipment(requestBody) {
        const equipmentId = document.getElementById('equipment-id').value
        ApiClient.request({
            url: `/v1/admin/equipments/${equipmentId}`,
            method: 'PUT',
            params: requestBody,
            onSuccess: (response) => {
                equipmentHandler.renderEquipmentList(true)
                equipmentHandler.closeEquipmentModal()
                ToastMessage.success('물품 정보가 수정되었습니다.')
            }
        })
    },

    editEquipment(equipmentId) {
        equipmentHandler.openEquipmentModal(equipmentId)
    },

    openDeleteModal(equipmentId) {
        equipmentHandler.currentEquipmentId = equipmentId
        const body = deleteModal.querySelector('.modal-body p')
        body.textContent = `정말로 삭제하시겠습니까?`
        deleteModal.classList.add('active')
    },

    closeDeleteModal() {
        deleteModal.classList.remove('active')
        equipmentHandler.currentEquipmentId = null
    },

    deleteEquipment() {
        ApiClient.request({
            url: `/v1/admin/equipments/${equipmentHandler.currentEquipmentId}`,
            method: 'DELETE',
            onSuccess: (response) => {
                equipmentHandler.renderEquipmentList(true)
                equipmentHandler.closeDeleteModal()
                ToastMessage.success(`삭제가 완료되었습니다.`)
            }
        })
    }
} 