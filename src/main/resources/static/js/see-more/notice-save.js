import ApiClient from "../common/ApiClient.js"

document.addEventListener('DOMContentLoaded', function() {
    const noticeForm = document.querySelector('.notice-form')
    const cancelBtn = document.querySelector('.cancel-btn')

    // 취소 버튼 이벤트
    cancelBtn.addEventListener('click', function() {
        if (confirm('작성 중인 내용이 있습니다. 정말로 취소하시겠습니까?')) {
            window.location.href = '/see-more/notices'
        }
    })

    // 폼 제출 이벤트
    noticeForm.addEventListener('submit', function(event) {
        event.preventDefault()

        // 폼 데이터 수집
        const categoryId = document.getElementById('notice-category').value
        const title = document.getElementById('notice-title').value
        const content = document.getElementById('notice-content').value

        // 유효성 검사
        if (!title.trim()) {
            alert('제목을 입력해주세요.')
            return
        }

        if (!content.trim()) {
            alert('내용을 입력해주세요.')
            return
        }

        const noticeId = document.getElementById('notice-id').value
        const isNew = document.getElementById('is-new').value === 'true'

        let url = '/v1/notices'
        let method = 'POST'
        if (!isNew) {
            console.log('soasmfoasmd')
            url += `/${noticeId}`
            method = 'PUT'
        }

        ApiClient.request({
            url: url,
            method: method,
            params: {
                categoryId, title, content
            },
            onSuccess: (response) => {
                window.location.href = '/see-more/notices'
            }
        })
    })
}) 