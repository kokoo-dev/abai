import ApiClient from "../common/ApiClient.js"
import CommonUtils from "../common/CommonUtils.js"
import DateUtils from "../common/DateUtils.js"

// 서브 탭 전환 기능
const recordsTab = document.getElementById('records-tab');
const playersTab = document.getElementById('players-tab');
const recordsContent = document.getElementById('records-content');
const playersContent = document.getElementById('players-content');

// 포지션 필터링
const filterButtons = document.querySelectorAll('.position-filter .filter-btn');

// 선수 상세 정보 모달
const playerModal = document.getElementById('player-modal');
const closeModalBtn = document.querySelector('.close-modal');

// 날짜 필터링 관련 요소
const filterTabButtons = document.querySelectorAll('.filter-tab-btn');
const relativeFilter = document.getElementById('relative-filter');
const absoluteFilter = document.getElementById('absolute-filter');
const periodButtons = document.querySelectorAll('.period-btn');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const applyDateFilterBtn = document.getElementById('apply-date-filter');

document.addEventListener('DOMContentLoaded', function() {

    // URL 경로에 따라 초기 탭 활성화
    const currentPage = window.location.pathname;
    const activateInitialTab = () => {
        if (currentPage.includes('/teams/players')) {
            switchTab('players');
        } else {
            switchTab('records');
        }
    };

    // 초기 탭 활성화
    activateInitialTab();

    member.getList()

    const positionElements = (selector, filter) => {
        const elements = document.querySelectorAll(selector)
        const positions = Array.from(document.querySelectorAll(`[name="position-filter-${filter}"]`))
            .map(item => item.value)

        elements.forEach(element => {
            const playerPositions = Array.from(element.querySelectorAll('.player-position')).map(item => item.textContent)

            if (filter === 'all' || playerPositions.some(item => positions.includes(item))) {
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

            const positionGroup = this.getAttribute('data-filter');

            // 현재 활성화된 탭에 따라 다른 요소 필터링
            if (recordsContent.classList.contains('active')) {
                // TODO
            } else if (playersContent.classList.contains('active')) {
                positionElements('.player-card', positionGroup);
            }
        });
    });

    // 날짜 필터 탭 전환 이벤트 (상대/절대)
    if (filterTabButtons.length > 0) {
        filterTabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 모든 탭 버튼 비활성화
                filterTabButtons.forEach(btn => btn.classList.remove('active'));
                // 클릭한 탭 버튼 활성화
                this.classList.add('active');
                
                const filterType = this.getAttribute('data-filter-type');
                
                // 상대/절대 필터 전환
                if (filterType === 'relative') {
                    relativeFilter.classList.add('active');
                    absoluteFilter.classList.remove('active');
                } else {
                    relativeFilter.classList.remove('active');
                    absoluteFilter.classList.add('active');
                }
            });
        });
    }

    // 상대 기간 버튼 클릭 이벤트
    if (periodButtons.length > 0) {
        periodButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 모든 기간 버튼 비활성화
                periodButtons.forEach(btn => btn.classList.remove('active'));
                // 클릭한 기간 버튼 활성화
                this.classList.add('active');
                
                const period = this.getAttribute('data-period');
                applyRelativeDateFilter(period);
            });
        });
    }

    // 절대 기간 적용 버튼 클릭 이벤트
    if (applyDateFilterBtn) {
        applyDateFilterBtn.addEventListener('click', function() {
            applyAbsoluteDateFilter(startDateInput.value, endDateInput.value);
        });
    }

    // 초기 날짜 필터 적용 (상대 기준 1일)
    setTimeout(() => {
        applyRelativeDateFilter('1d');
    }, 100);
    
    // 검색 기능
    const implementSearch = (inputSelector, itemSelector, textContent) => {
        const searchInput = document.querySelector(inputSelector);
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const items = document.querySelectorAll(itemSelector);
                
                items.forEach(item => {
                    const text = textContent(item).toLowerCase();
                    if (text.includes(searchTerm)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }
    };

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

    // 모달 닫기 버튼
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', playerModalHandler.close);
    }

    // 모달 외부 클릭 시 닫기
    if (playerModal) {
        playerModal.addEventListener('click', function(e) {
            if (e.target === playerModal) {
                playerModalHandler.close();
            }
        });
    }
    
    // 차트 초기화 (새로 추가)
    initCharts();
});

// 상대 날짜 필터 적용 함수
function applyRelativeDateFilter(period) {
    // 현재 날짜
    const today = new Date();
    let startDate = new Date();
    
    // 기간에 따라 시작 날짜 계산
    switch(period) {
        case '1d': // 1일
            startDate.setDate(today.getDate() - 1);
            break;
        case '3d': // 3일
            startDate.setDate(today.getDate() - 3);
            break;
        case '5d': // 5일
            startDate.setDate(today.getDate() - 5);
            break;
        case '1w': // 1주
            startDate.setDate(today.getDate() - 7);
            break;
        case '2w': // 2주
            startDate.setDate(today.getDate() - 14);
            break;
        case '3w': // 3주
            startDate.setDate(today.getDate() - 21);
            break;
        case '1m': // 1달
            startDate.setMonth(today.getMonth() - 1);
            break;
        case '3m': // 3달
            startDate.setMonth(today.getMonth() - 3);
            break;
        case '6m': // 6달
            startDate.setMonth(today.getMonth() - 6);
            break;
        default:
            startDate.setDate(today.getDate() - 1); // 기본값 1일
    }
    
    // 날짜를 'yyyy-MM-dd' 형식으로 변환
    const formattedStartDate = DateUtils.formatDate(startDate, 'yyyy-MM-dd');
    const formattedEndDate = DateUtils.formatDate(today, 'yyyy-MM-dd');
    
    // 실제 데이터 필터링 적용
    applyDateRangeToData(formattedStartDate, formattedEndDate);
    
    // 절대 날짜 필드에 반영 (사용자 편의를 위해)
    if (startDateInput && endDateInput) {
        startDateInput.value = formattedStartDate;
        endDateInput.value = formattedEndDate;
    }
}

// 절대 날짜 필터 적용 함수
function applyAbsoluteDateFilter(startDate, endDate) {
    // 입력 유효성 검사
    if (!startDate || !endDate) {
        alert('시작일과 종료일을 모두 입력해주세요.');
        return;
    }
    
    // 날짜 범위 유효성 검사
    if (new Date(startDate) > new Date(endDate)) {
        alert('시작일은 종료일보다 이전이어야 합니다.');
        return;
    }
    
    // 실제 데이터 필터링 적용
    applyDateRangeToData(startDate, endDate);
}

// 데이터에 날짜 범위 필터 적용 함수
function applyDateRangeToData(startDate, endDate) {
    console.log(`필터링 적용: ${startDate} ~ ${endDate}`);
    
    // 여기에서 실제 API 호출 또는 데이터 필터링 로직 구현
    // 예를 들어, 팀 통계, 차트, 득점 순위 등을 해당 날짜 범위로 새로 불러오기
    // TODO: API 호출 및 데이터 업데이트 구현
    
    // 통계 데이터 업데이트 예시
    updateTeamStats(startDate, endDate);
    
    // 차트 데이터 업데이트 예시
    updateCharts(startDate, endDate);
}

// 팀 통계 업데이트 함수
function updateTeamStats(startDate, endDate) {
    // 예시 구현: 실제로는 API에서 데이터를 가져와야 함
    // 여기서는 간단한 예시를 위해 고정 데이터 사용
    
    // TODO: API 연동 후 실제 구현
}

// 차트 업데이트 함수
function updateCharts(startDate, endDate) {
    // 예시 구현: 실제로는 API에서 데이터를 가져와야 함
    // 여기서는 간단한 예시를 위해 고정 데이터 사용
    
    // TODO: API 연동 후 실제 구현
    
    // 기존 차트 업데이트
    updateMatchGoalTrendChart(startDate, endDate);
}

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
    
    window.goalChart = new Chart(chartCanvas, {
        type: 'line',
        data: data,
        options: options
    });
}

// 경기당 득점/실점 차트 업데이트
function updateMatchGoalTrendChart(startDate, endDate) {
    // 실제로는 API에서 새로운 데이터를 가져와야 함
    // 여기서는 간단한 예시로 랜덤 데이터 생성
    
    if (!window.goalChart) return;
    
    // 기간에 따라 표시할 경기 수 조정 (실제로는 API에서 받아야 함)
    const daysDiff = Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const matchCount = Math.min(15, Math.max(3, Math.floor(daysDiff / 2)));
    
    // 날짜 범위에 따라 다른 데이터 샘플 (실제로는 API에서 받아와야 함)
    const newMatchLabels = Array.from({length: matchCount}, (_, i) => `${i+1}차전`);
    const newScoredGoals = Array.from({length: matchCount}, () => Math.floor(Math.random() * 5));
    const newConcededGoals = Array.from({length: matchCount}, () => Math.floor(Math.random() * 4));
    
    // 차트 데이터 업데이트
    window.goalChart.data.labels = newMatchLabels;
    window.goalChart.data.datasets[0].data = newScoredGoals;
    window.goalChart.data.datasets[1].data = newConcededGoals;
    
    // 차트 타이틀 업데이트
    window.goalChart.options.plugins.title.text = `경기당 득점/실점 추이 (${startDate} ~ ${endDate})`;
    
    // 차트 다시 그리기
    window.goalChart.update();
}

const member = {
    getList() {
        ApiClient.request({
            url: '/v1/members/with-positions',
            method: 'GET',
            onSuccess: (response) => {
                this.drawList(response)
                const playerCards = document.querySelectorAll('.player-card')

                playerCards.forEach(card => {
                    card.addEventListener('click', function() {
                        const playerId = this.getAttribute('data-player-id')
                        member.getDetail(playerId)
                    })
                })
            }
        })
    },
    getDetail(memberId) {
        ApiClient.request({
            url: `/v1/members/${memberId}`,
            method: 'GET',
            onSuccess: (response) => {
                playerModalHandler.open(response)
            }
        })
    },
    drawList(items = []) {
        items.forEach(item => {
            const playerCardNode = CommonUtils.getTemplateNode('player-card-template')
            const playerCard = playerCardNode.querySelector('.player-card')
            playerCard.dataset.playerId = item.id

            playerCardNode.querySelector('.player-name').textContent = item.name

            item.positions.forEach(position => {
                const playerPositionNode = CommonUtils.getTemplateNode('player-position-template')
                playerPositionNode.querySelector('.player-position').textContent = position.position
                playerCard.querySelector('.player-basic-info').appendChild(playerPositionNode)
            })

            playerCardNode.querySelector('.player-number').textContent = `#${item.uniformNumber}`

            document.getElementById('player-wrapper').appendChild(playerCardNode)
        })
    }
}

const playerModalHandler = {
    open(playerData) {
        // 모달에 선수 정보 채우기
        document.getElementById('modal-player-name').textContent = playerData.name
        document.getElementById('modal-player-number').textContent = playerData.uniformNumber
        document.getElementById('modal-player-position').textContent =
            Array.from(document.querySelectorAll(`[data-player-id="${playerData.id}"] .player-position`))
                .map(item => item.textContent)
                .join()
        document.getElementById('modal-player-birth').textContent = DateUtils.formatDate(playerData.birthday, 'yyyy-MM-dd')
        document.getElementById('modal-player-height').textContent = playerData.height
        document.getElementById('modal-player-weight').textContent = playerData.weight

        // 능력치 바 업데이트
        const statItems = {
            "스피드": playerData.attribute?.speed ?? 0,
            "슈팅": playerData.attribute?.shooting ?? 0,
            "패스": playerData.attribute?.pass ?? 0,
            "드리블": playerData.attribute?.dribble ?? 0,
            "수비": playerData.attribute?.defence ?? 0,
            "체력": playerData.attribute?.stamina ?? 0
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
        playerModalHandler.updateFootRating('왼발', playerData.leftFoot);
        playerModalHandler.updateFootRating('오른발', playerData.rightFoot);

        // 모달 표시
        playerModal.style.display = 'flex';
    },
    updateFootRating(foot, rating) {
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
    },
    close() {
        playerModal.style.display = 'none';
    }
}