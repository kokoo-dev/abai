import CommonUtils from "../common/CommonUtils.js"

const faqCreateButton = document.getElementById('faq-create')

document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('.category-btn')
    const faqItems = document.querySelectorAll('.faq-item')
    const faqQuestions = document.querySelectorAll('.faq-question')
    const faqAnswers = document.querySelectorAll('.faq-answer')

    // 카테고리 필터링 기능
    categoryButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // 모든 버튼 및 답변에서 active 클래스 제거
            categoryButtons.forEach(btn => btn.classList.remove('active'))
            faqAnswers.forEach(faqAnswer => faqAnswer.classList.remove('active'))

            // 클릭한 버튼에 active 클래스 추가
            event.currentTarget.classList.add('active')

            const category = event.currentTarget.getAttribute('data-category')

            // 카테고리에 따라 FAQ 항목 필터링
            faqItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block'
                } else {
                    item.style.display = 'none'
                }
            })
        })
    })

    // 질문 클릭 시 토글 기능
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const parent = this.parentElement
            const answer = parent.querySelector('.faq-answer')
            const arrow = this.querySelector('.arrow-icon i')
            
            // 현재 항목 토글
            answer.classList.toggle('active')
            
            // 화살표 아이콘 변경
            if (answer.classList.contains('active')) {
                arrow.classList.remove('fa-chevron-down')
                arrow.classList.add('fa-chevron-up')
            } else {
                arrow.classList.remove('fa-chevron-up')
                arrow.classList.add('fa-chevron-down')
            }
        })
    })
})

if (faqCreateButton) {
    faqCreateButton.addEventListener('click', () => {
        CommonUtils.postToUrl('/see-more/faq')
    })
}