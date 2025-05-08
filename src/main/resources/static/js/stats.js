// 개인 기록 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 탭 활성화
    const currentPage = window.location.pathname;
    const tabLinks = document.querySelectorAll('.tab');
    
    tabLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 포지션 필터링
    const filterButtons = document.querySelectorAll('.position-filter .filter-btn');
    const playerRows = document.querySelectorAll('.player-table tbody tr');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 버튼 활성화 상태 업데이트
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            
            // 선수 목록 필터링
            playerRows.forEach(row => {
                const position = row.getAttribute('data-position');
                if (filter === 'all' || filter === position) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });

    // 검색 기능
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            playerRows.forEach(row => {
                const playerName = row.querySelector('td:first-child').textContent.toLowerCase();
                if (playerName.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // 테이블 정렬 기능
    const sortableHeaders = document.querySelectorAll('.sortable');

    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const sortKey = this.getAttribute('data-sort');
            const currentDirection = this.classList.contains('asc') ? 'desc' : 'asc';
            
            // 모든 헤더의 정렬 클래스 제거
            sortableHeaders.forEach(h => {
                h.classList.remove('asc', 'desc');
            });
            
            // 현재 헤더에 정렬 방향 클래스 추가
            this.classList.add(currentDirection);
            
            // 테이블 행 정렬
            sortTable(sortKey, currentDirection);
        });
    });

    // 테이블 정렬 함수
    function sortTable(key, direction) {
        const tbody = document.querySelector('.player-table tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.sort((a, b) => {
            let valueA, valueB;
            
            if (key === 'name') {
                valueA = a.querySelector('td:nth-child(1)').textContent;
                valueB = b.querySelector('td:nth-child(1)').textContent;
                return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            } else if (key === 'position') {
                valueA = a.querySelector('td:nth-child(2)').textContent;
                valueB = b.querySelector('td:nth-child(2)').textContent;
                return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            } else {
                let columnIndex;
                switch (key) {
                    case 'games': columnIndex = 3; break;
                    case 'goals': columnIndex = 4; break;
                    case 'assists': columnIndex = 5; break;
                    default: columnIndex = 1;
                }
                
                valueA = parseInt(a.querySelector(`td:nth-child(${columnIndex})`).textContent);
                valueB = parseInt(b.querySelector(`td:nth-child(${columnIndex})`).textContent);
                return direction === 'asc' ? valueA - valueB : valueB - valueA;
            }
        });
        
        // 정렬된 행을 테이블에 다시 추가
        rows.forEach(row => {
            tbody.appendChild(row);
        });
    }

    // 데이터 로드 (실제로는 서버에서 가져올 것)
    const loadStatsData = () => {
        // API 호출 예시
        // fetch('/api/stats')
        //     .then(response => response.json())
        //     .then(data => {
        //         updateStatsData(data);
        //     })
        //     .catch(error => {
        //         console.error('통계 데이터 로딩 중 오류 발생:', error);
        //     });
    };

    // 초기 데이터 로드
    loadStatsData();
}); 