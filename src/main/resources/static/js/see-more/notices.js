// 공지사항 페이지 스크립트
document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소
    const filterButtons = document.querySelectorAll('.filter-btn');
    const noticeItems = document.querySelectorAll('.notice-item');
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const paginationButtons = document.querySelectorAll('.page-btn');
    const adminButton = document.querySelector('.write-btn');

    // 필터 버튼 클릭 이벤트
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 활성화된 필터 버튼 스타일 제거
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // 현재 클릭된 버튼 활성화
            this.classList.add('active');
            
            // 필터링 로직 (실제 데이터베이스 연동 시 API 호출로 대체)
            const filter = this.getAttribute('data-filter');
            
            // 필터가 '전체'인 경우 모든 공지 표시
            if (filter === 'all') {
                noticeItems.forEach(item => {
                    item.style.display = 'flex';
                });
                return;
            }
            
            // 해당 카테고리만 표시
            noticeItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (category === filter) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 검색 기능
    function searchNotices() {
        const searchTerm = searchInput.value.toLowerCase();
        
        // 검색어가 없으면 모든 공지 표시
        if (searchTerm.trim() === '') {
            noticeItems.forEach(item => {
                item.style.display = 'flex';
            });
            return;
        }
        
        // 제목과 내용에서 검색어 확인
        noticeItems.forEach(item => {
            const title = item.querySelector('.notice-title').textContent.toLowerCase();
            const summary = item.querySelector('.notice-summary').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || summary.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // 검색 버튼 클릭 이벤트
    searchBtn.addEventListener('click', searchNotices);
    
    // 엔터 키로 검색 실행
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchNotices();
        }
    });

    // 페이지네이션 버튼 클릭 이벤트
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.disabled || this.classList.contains('active')) {
                return;
            }
            
            // 현재 활성화된 버튼 클래스 제거
            document.querySelector('.page-btn.active').classList.remove('active');
            
            // 클릭된 버튼 활성화
            this.classList.add('active');
            
            // 실제 구현에서는 여기서 페이지 로드 API 호출
            console.log(`페이지 ${this.textContent} 로드`);
            
            // 예시 동작: 페이지 상단으로 스크롤
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    // 공지사항 항목 클릭 이벤트 (상세 페이지로 이동)
    noticeItems.forEach(item => {
        item.addEventListener('click', function() {
            const noticeId = this.getAttribute('data-id');
            // 실제 구현에서는 상세 페이지로 이동
            window.location.href = `/notice-detail?id=${noticeId}`;
        });
    });
}); 