import CommonUtils from "../common/CommonUtils.js"
import ApiClient from "../common/ApiClient.js"

document.addEventListener('DOMContentLoaded', function() {
    const adminButtons = document.querySelectorAll('.admin-actions .btn')
    const noticeId = document.getElementById('notice-id').value

    // 조회수 증가
    increaseViewCount(noticeId)
    
    // 관리자 버튼 이벤트
    if (adminButtons.length > 0) {
        // 수정 버튼
        const editButton = document.querySelector('.edit-btn')
        if (editButton) {
            editButton.addEventListener('click', function() {
                CommonUtils.postToUrl(`/see-more/notices/${noticeId}`)
            })
        }
        
        // 삭제 버튼
        const deleteButton = document.querySelector('.delete-btn')
        if (deleteButton) {
            deleteButton.addEventListener('click', function() {
                const confirmDelete = confirm('정말로 이 공지사항을 삭제하시겠습니까?')
                if (!confirmDelete) {
                    return
                }

                ApiClient.request({
                    url: `/v1/notices/${noticeId}`,
                    method: 'DELETE',
                    onSuccess: () => {
                        window.location.href = '/see-more/notices'
                    }
                })
            })
        }
    }
})

function increaseViewCount(noticeId) {
    ApiClient.request({
        url: `/v1/notices/${noticeId}/views`,
        method: 'POST',
        onError: () => {
            // ignore
        }
    })
}