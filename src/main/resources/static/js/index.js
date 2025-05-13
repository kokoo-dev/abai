document.addEventListener('DOMContentLoaded', function() {
    // 현재 페이지 활성화
    const currentPage = window.location.pathname;
    const tabLinks = document.querySelectorAll('.tab');
    
    tabLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage || 
            (currentPage === '/' && link.getAttribute('href') === '/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 예시 데이터 - 실제로는 서버에서 가져올 것
    const fetchHomeData = () => {
        // API 호출 예시
        // fetch('/api/home-data')
        //     .then(response => response.json())
        //     .then(data => {
        //         updateStats(data.stats);
        //         updateUpcomingMatch(data.upcomingMatch);
        //         updatePlayersList(data.topPlayers);
        //     })
        //     .catch(error => {
        //         console.error('데이터 로딩 중 오류 발생:', error);
        //     });
    };

    // 초기 데이터 로드
    fetchHomeData();
});