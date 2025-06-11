import ApiClient from "../common/ApiClient.js"
import CommonUtils from "../common/CommonUtils.js"
import DateUtils from "../common/DateUtils.js"
import ToastMessage from "../common/ToastMessage.js"

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

    applyRelativeDateFilter('1m')
    
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
});

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
        ToastMessage.error('시작일과 종료일을 모두 입력해주세요.')
        return
    }
    
    // 날짜 범위 유효성 검사
    if (new Date(startDate) > new Date(endDate)) {
        ToastMessage.error('시작일은 종료일보다 이전이어야 합니다.')
        return
    }
    
    // 실제 데이터 필터링 적용
    applyDateRangeToData(startDate, endDate);
}

// 데이터에 날짜 범위 필터 적용 함수
function applyDateRangeToData(startDate, endDate) {
    record.getSummary(startDate, endDate)
    record.getGoalRanks(startDate, endDate)
    record.getAssistRanks(startDate, endDate)
    record.getAllPlayers(startDate, endDate)
}

function activateInitialTab() {
    // URL 경로에 따라 초기 탭 활성화
    const currentPage = window.location.pathname;
    if (currentPage.includes('/teams/players')) {
        switchTab('players');
    } else {
        switchTab('records');
    }
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
        } else {
            let columnIndex;
            switch (key) {
                case 'number': columnIndex = 2; break;
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

const record = {
    getSummary(startDate, endDate) {
        ApiClient.request({
            url: '/v1/records/summary',
            method: 'GET',
            params: { startDate, endDate },
            onSuccess: (response) => {
                document.getElementById('summary-match-count').textContent = response.matchCount
                document.getElementById('summary-goals-for').textContent = response.goalsFor
                document.getElementById('summary-goals-against').textContent = response.goalsAgainst
                document.getElementById('summary-assist').textContent = response.assist
            }
        })
    },
    getGoalRanks(startDate, endDate) {
        ApiClient.request({
            url: '/v1/records/goal-ranks',
            method: 'GET',
            params: { startDate, endDate },
            onSuccess: (response) => {
                const goalRankWrapper = document.getElementById('goal-rank-wrapper')
                goalRankWrapper.innerHTML = ''

                response.forEach((item, index) => {
                    const rankItemNode = CommonUtils.getTemplateNode('rank-item-template')
                    rankItemNode.querySelector('.rank-position').textContent = index + 1
                    rankItemNode.querySelector('.player-name').textContent = item.name
                    rankItemNode.querySelector('.stat-value').textContent = `${item.goalsFor}골`

                    goalRankWrapper.appendChild(rankItemNode)
                })
            }
        })
    },
    getAssistRanks(startDate, endDate) {
        ApiClient.request({
            url: '/v1/records/assist-ranks',
            method: 'GET',
            params: { startDate, endDate },
            onSuccess: (response) => {
                const assistRankWrapper = document.getElementById('assist-rank-wrapper')
                assistRankWrapper.innerHTML = ''

                response.forEach((item, index) => {
                    const rankItemNode = CommonUtils.getTemplateNode('rank-item-template')
                    rankItemNode.querySelector('.rank-position').textContent = index + 1
                    rankItemNode.querySelector('.player-name').textContent = item.name
                    rankItemNode.querySelector('.stat-value').textContent = `${item.assist}어시`

                    assistRankWrapper.appendChild(rankItemNode)
                })
            }
        })
    },
    getAllPlayers(startDate, endDate) {
        ApiClient.request({
            url: '/v1/records/all-players',
            method: 'GET',
            params: { startDate, endDate },
            onSuccess: (response) => {
                const playerRecordWrapper = document.getElementById('player-record-wrapper')
                playerRecordWrapper.innerHTML = ''

                response.forEach((item, index) => {
                    const playerRecordNode = CommonUtils.getTemplateNode('player-record-template')
                    const tds = playerRecordNode.querySelectorAll('tr td')
                    tds[0].textContent = item.name
                    tds[1].textContent = item.uniformNumber
                    tds[2].textContent = item.matchCount
                    tds[3].textContent = item.goalsFor
                    tds[4].textContent = item.assist

                    playerRecordWrapper.appendChild(playerRecordNode)
                })
            }
        })
    }
}