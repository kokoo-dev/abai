// 경기 상세 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 탭 활성화
    const currentPage = window.location.pathname;
    const tabLinks = document.querySelectorAll('.tab');
    
    tabLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage ||
            (currentPage.includes('/match/') && link.getAttribute('href') === '/matches')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 탭 전환 기능
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 탭 버튼 활성화 상태 업데이트
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // 탭 컨텐츠 표시/숨김 처리
            const targetTab = this.getAttribute('data-tab');
            tabContents.forEach(content => {
                if (content.id === targetTab) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });

    // URL에서 경기 ID 가져오기
    const getMatchId = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    };

    // 경기 데이터 로드 (실제로는 서버에서 가져올 것)
    const loadMatchDetails = (matchId) => {
        // API 호출 예시
        // fetch(`/api/matches/${matchId}`)
        //     .then(response => response.json())
        //     .then(data => {
        //         updateMatchDetails(data);
        //     })
        //     .catch(error => {
        //         console.error('경기 데이터 로딩 중 오류 발생:', error);
        //     });
    };

    // 편집 버튼 이벤트
    const editButton = document.querySelector('.edit-btn');
    if (editButton) {
        editButton.addEventListener('click', function() {
            const matchId = getMatchId();
            window.location.href = `/match-write?id=${matchId}`;
        });
    }

    // 삭제 버튼 이벤트
    const deleteButton = document.querySelector('.delete-btn');
    if (deleteButton) {
        deleteButton.addEventListener('click', function() {
            if (confirm('정말로 이 경기 기록을 삭제하시겠습니까?')) {
                const matchId = getMatchId();
                
                // API 호출 예시
                // fetch(`/api/matches/${matchId}`, {
                //     method: 'DELETE'
                // })
                // .then(response => {
                //     if (response.ok) {
                //         window.location.href = '/matches';
                //     } else {
                //         alert('경기 삭제 중 오류가 발생했습니다.');
                //     }
                // })
                // .catch(error => {
                //     console.error('경기 삭제 중 오류 발생:', error);
                //     alert('경기 삭제 중 오류가 발생했습니다.');
                // });
                
                // 임시 코드 (실제로는 위의 API 호출이 사용됨)
                window.location.href = '/matches';
            }
        });
    }

    // 초기 데이터 로드
    const matchId = getMatchId();
    if (matchId) {
        loadMatchDetails(matchId);
    }
}); 