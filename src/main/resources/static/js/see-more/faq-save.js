import ApiClient from "../common/ApiClient.js"

document.addEventListener('DOMContentLoaded', function() {
    const faqForm = document.querySelector('.faq-form')
    const cancelBtn = document.querySelector('.cancel-btn')
    
    // 취소 버튼 이벤트
    cancelBtn.addEventListener('click', function() {
        // FAQ 목록 페이지로 이동
        window.location.href = '/see-more/faq'
    })
    
    // 폼 제출 이벤트
    faqForm.addEventListener('submit', function(event) {
        event.preventDefault()
        
        // 폼 데이터 수집
        const categoryId = document.getElementById('faq-category').value
        const question = document.getElementById('faq-question').value
        const answer = document.getElementById('faq-answer').value
        
        // 유효성 검사
        if (!question.trim()) {
            alert('질문을 입력해주세요.')
            return
        }
        
        if (!answer.trim()) {
            alert('답변을 입력해주세요.')
            return
        }

        ApiClient.request({
            url: '/v1/faq',
            method: 'POST',
            params: {
                categoryId, question, answer
            },
            onSuccess: (response) => {
                window.location.href = '/see-more/faq'
            }
        })
    })
}) 