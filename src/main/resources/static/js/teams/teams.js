// 개인 기록 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 서브 탭 전환 기능
    const recordsTab = document.getElementById('records-tab');
    const playersTab = document.getElementById('players-tab');
    const recordsContent = document.getElementById('records-content');
    const playersContent = document.getElementById('players-content');

    // URL 경로에 따라 초기 탭 활성화
    const currentPage = window.location.pathname;
    const activateInitialTab = () => {
        if (currentPage.includes('/teams/players')) {
            switchTab('players');
        } else {
            switchTab('records');
        }
    };

    // 탭 전환 함수
    function switchTab(tabId) {
        // 모든 탭 컨텐츠와 탭 버튼 비활성화
        document.querySelectorAll('.content-section').forEach(content => {
            content.classList.remove('active');
        });
        
        document.querySelectorAll('.sub-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // 선택한 탭 컨텐츠와 탭 버튼 활성화
        document.getElementById(tabId + '-content').classList.add('active');
        document.getElementById(tabId + '-tab').classList.add('active');
    }

    // 탭 클릭 이벤트 리스너
    if (recordsTab) {
        recordsTab.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab('records');
            history.pushState(null, '', '/teams/records');
        });
    }

    if (playersTab) {
        playersTab.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab('players');
            history.pushState(null, '', '/teams/players');
        });
    }

    // 초기 탭 활성화
    activateInitialTab();

    // 포지션 필터링
    const filterButtons = document.querySelectorAll('.position-filter .filter-btn');
    
    const filterElements = (selector, filter) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            const position = element.getAttribute('data-position');
            if (filter === 'all' || filter === position) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 버튼 활성화 상태 업데이트
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            
            // 현재 활성화된 탭에 따라 다른 요소 필터링
            if (recordsContent.classList.contains('active')) {
                // 기록 탭의 선수 테이블 필터링
                filterElements('.player-table tbody tr', filter);
            } else if (playersContent.classList.contains('active')) {
                // 선수 탭의 선수 카드 필터링
                filterElements('.player-card', filter);
            }
        });
    });

    // 검색 기능
    const implementSearch = (inputSelector, itemSelector, getTextFn) => {
        const searchInput = document.querySelector(inputSelector);
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const items = document.querySelectorAll(itemSelector);
                
                items.forEach(item => {
                    const text = getTextFn(item).toLowerCase();
                    if (text.includes(searchTerm)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }
    };

    // 기록 탭의 검색 기능
    implementSearch(
        '#records-content .search-input', 
        '.player-table tbody tr', 
        row => row.querySelector('td:first-child').textContent
    );

    // 선수 탭의 검색 기능
    implementSearch(
        '#players-content .search-input', 
        '.player-card', 
        card => card.querySelector('.player-name').textContent
    );

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

    // 선수 카드 클릭 이벤트 - 선수 상세 정보 모달 표시
    const playerCards = document.querySelectorAll('.player-card');
    const playerModal = document.getElementById('player-modal');
    const closeModalBtn = document.querySelector('.close-modal');

    // 샘플 선수 상세 데이터 (실제로는 서버에서 가져올 것)
    const playerDetailsData = {
        "1": {
            name: "이골키퍼",
            position: "GK",
            number: "#1",
            birth: "1995-02-10",
            height: "192cm",
            weight: "88kg",
            stats: {
                speed: 65,
                shooting: 25,
                passing: 70,
                dribbling: 30,
                defense: 25,
                physical: 85
            },
            foot: {
                left: 2,
                right: 4
            }
        },
        "2": {
            name: "박수비",
            position: "DF",
            number: "#3",
            birth: "1994-07-15",
            height: "185cm",
            weight: "82kg",
            stats: {
                speed: 75,
                shooting: 55,
                passing: 75,
                dribbling: 65,
                defense: 88,
                physical: 85
            },
            foot: {
                left: 4,
                right: 3
            }
        },
        "3": {
            name: "정수비",
            position: "DF",
            number: "#4",
            birth: "1996-05-22",
            height: "187cm",
            weight: "80kg",
            stats: {
                speed: 80,
                shooting: 60,
                passing: 78,
                dribbling: 70,
                defense: 86,
                physical: 80
            },
            foot: {
                left: 3,
                right: 4
            }
        },
        "4": {
            name: "최미드필더",
            position: "MF",
            number: "#8",
            birth: "1993-11-08",
            height: "178cm",
            weight: "72kg",
            stats: {
                speed: 82,
                shooting: 78,
                passing: 90,
                dribbling: 85,
                defense: 70,
                physical: 75
            },
            foot: {
                left: 5,
                right: 4
            }
        },
        "5": {
            name: "김축구",
            position: "FW",
            number: "#10",
            birth: "1995-05-15",
            height: "180cm",
            weight: "75kg",
            stats: {
                speed: 85,
                shooting: 90,
                passing: 80,
                dribbling: 88,
                defense: 45,
                physical: 75
            },
            foot: {
                left: 3,
                right: 5
            }
        },
        "6": {
            name: "박공격",
            position: "FW",
            number: "#9",
            birth: "1997-04-30",
            height: "182cm",
            weight: "77kg",
            stats: {
                speed: 88,
                shooting: 87,
                passing: 75,
                dribbling: 82,
                defense: 40,
                physical: 78
            },
            foot: {
                left: 4,
                right: 4
            }
        }
    };

    // 선수 카드 클릭 시 모달 열기
    playerCards.forEach(card => {
        card.addEventListener('click', function() {
            const playerId = this.getAttribute('data-player-id');
            openPlayerModal(playerId);
        });
    });

    // 모달 닫기 버튼
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closePlayerModal);
    }

    // 모달 외부 클릭 시 닫기
    if (playerModal) {
        playerModal.addEventListener('click', function(e) {
            if (e.target === playerModal) {
                closePlayerModal();
            }
        });
    }

    // 선수 모달 열기 함수
    function openPlayerModal(playerId) {
        const playerData = playerDetailsData[playerId];
        if (!playerData) return;

        // 모달에 선수 정보 채우기
        const nameEl = document.getElementById('modal-player-name');
        const imageEl = document.getElementById('modal-player-image');
        const numberEl = document.getElementById('modal-player-number');
        const positionEl = document.getElementById('modal-player-position');
        const birthEl = document.getElementById('modal-player-birth');
        const heightEl = document.getElementById('modal-player-height');
        const weightEl = document.getElementById('modal-player-weight');

        nameEl.textContent = playerData.name;
        // 이미지는 선수 카드의 이미지를 재사용
        const cardImage = document.querySelector(`.player-card[data-player-id="${playerId}"] img`);
        if (cardImage) {
            imageEl.src = cardImage.src;
            imageEl.alt = playerData.name;
        }
        
        numberEl.textContent = playerData.number;
        positionEl.textContent = playerData.position;
        birthEl.textContent = playerData.birth;
        heightEl.textContent = playerData.height;
        weightEl.textContent = playerData.weight;

        // 능력치 바 업데이트
        const statItems = {
            "스피드": playerData.stats.speed,
            "슈팅": playerData.stats.shooting,
            "패스": playerData.stats.passing,
            "드리블": playerData.stats.dribbling,
            "수비": playerData.stats.defense,
            "체력": playerData.stats.physical
        };

        Object.entries(statItems).forEach(([name, value], index) => {
            const statBars = document.querySelectorAll('.stat-item');
            if (statBars[index]) {
                const nameEl = statBars[index].querySelector('.stat-name');
                const fillEl = statBars[index].querySelector('.stat-fill');
                const valueEl = statBars[index].querySelector('.stat-value');
                
                nameEl.textContent = name;
                fillEl.style.width = `${value}%`;
                valueEl.textContent = value;
            }
        });

        // 발 기술 별점 업데이트
        updateFootRating('왼발', playerData.foot.left);
        updateFootRating('오른발', playerData.foot.right);

        // 모달 표시
        playerModal.style.display = 'flex';
    }

    // 발 기술 별점 업데이트 함수
    function updateFootRating(foot, rating) {
        const footItems = document.querySelectorAll('.foot-item');
        const footItem = Array.from(footItems).find(item => 
            item.querySelector('.foot-label').textContent.includes(foot)
        );
        
        if (footItem) {
            const stars = footItem.querySelectorAll('.star-rating i');
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.className = 'fas fa-star'; // 채워진 별
                } else {
                    star.className = 'far fa-star'; // 빈 별
                }
            });
        }
    }

    // 선수 모달 닫기 함수
    function closePlayerModal() {
        playerModal.style.display = 'none';
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
    
    // 차트 초기화 (새로 추가)
    initCharts();
});

// 새로 추가된 차트 초기화 함수
function initCharts() {
    // 경기당 득점/실점 추이 라인 차트 생성
    createMatchGoalTrendChart();
}

// 경기당 득점/실점 추이 차트 생성 함수
function createMatchGoalTrendChart() {
    const chartCanvas = document.getElementById('match-goal-trend-chart');
    if (!chartCanvas) return;
    
    // 경기 데이터 (실제로는 API에서 가져와야 함)
    const matchLabels = [
        '1차전', '2차전', '3차전', '4차전', '5차전', 
        '6차전', '7차전', '8차전', '9차전', '10차전',
        '11차전', '12차전', '13차전', '14차전', '15차전'
    ];
    
    const scoredGoals = [2, 1, 3, 4, 0, 2, 3, 5, 3, 2, 4, 1, 3, 2, 3]; // 득점
    const concededGoals = [0, 1, 2, 1, 2, 1, 0, 2, 2, 3, 1, 2, 3, 0, 2]; // 실점
    
    const data = {
        labels: matchLabels,
        datasets: [
            {
                label: '득점',
                data: scoredGoals,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                fill: true,
                tension: 0.3
            },
            {
                label: '실점',
                data: concededGoals,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                fill: true,
                tension: 0.3
            }
        ]
    };
    
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 12,
                    font: {
                        size: 11
                    }
                }
            },
            title: {
                display: true,
                text: '경기당 득점/실점 추이',
                font: {
                    size: 14
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };
    
    new Chart(chartCanvas, {
        type: 'line',
        data: data,
        options: options
    });
} 