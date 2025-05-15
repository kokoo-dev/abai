import CommonUtils from "../common/CommonUtils.js"

document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소
    const categoryButtons = document.querySelectorAll('.category-btn')
    const noticeItems = document.querySelectorAll('.notice-item')
    const searchInput = document.querySelector('.search-input')
    const searchBtn = document.querySelector('.search-btn')
    const createButton = document.getElementById('notice-create')

    // 필터 버튼 클릭 이벤트
    categoryButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // 활성화된 필터 버튼 스타일 제거
            categoryButtons.forEach(btn => btn.classList.remove('active'))
            
            // 현재 클릭된 버튼 활성화
            event.currentTarget.classList.add('active')
            
            // 필터링 로직 (실제 데이터베이스 연동 시 API 호출로 대체)
            const filter = event.currentTarget.getAttribute('data-category')
            
            // 필터가 '전체'인 경우 모든 공지 표시
            if (filter === 'all') {
                noticeItems.forEach(item => {
                    item.style.display = 'flex'
                })
                return
            }
            
            // 해당 카테고리만 표시
            noticeItems.forEach(item => {
                const category = item.getAttribute('data-category')
                if (category === filter) {
                    item.style.display = 'flex'
                } else {
                    item.style.display = 'none'
                }
            })
        })
    })

    // 검색 기능
    function searchNotices() {
        const searchTerm = searchInput.value.toLowerCase()
        
        // 검색어가 없으면 모든 공지 표시
        if (searchTerm.trim() === '') {
            noticeItems.forEach(item => {
                item.style.display = 'flex'
            })
            return
        }
        
        // 제목과 내용에서 검색어 확인
        noticeItems.forEach(item => {
            const title = item.querySelector('.notice-title').textContent.toLowerCase()
            const summary = item.querySelector('.notice-summary').textContent.toLowerCase()
            
            if (title.includes(searchTerm) || summary.includes(searchTerm)) {
                item.style.display = 'flex'
            } else {
                item.style.display = 'none'
            }
        })
    }

    // 검색 버튼 클릭 이벤트
    searchBtn.addEventListener('click', searchNotices)
    
    // 엔터 키로 검색 실행
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchNotices()
        }
    })

    // 공지사항 항목 클릭 이벤트 (상세 페이지로 이동)
    noticeItems.forEach(item => {
        item.addEventListener('click', function() {
            const noticeId = this.getAttribute('data-id')
            window.location.href = `/see-more/notices/${noticeId}`
        })
    })

    if (createButton) {
        createButton.addEventListener('click', () => {
            CommonUtils.postToUrl('/see-more/notices')
        })
    }
})