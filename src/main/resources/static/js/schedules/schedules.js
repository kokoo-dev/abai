import CommonUtils from "../common/CommonUtils.js";

const matchesTab = document.getElementById('matches-tab');
const calendarTab = document.getElementById('calendar-tab');
const matchCreateButton = document.getElementById('match-create-button')
const filterButtons = document.querySelectorAll('.filter-btn');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const currentMonthEl = document.getElementById('current-month');
const calendarDaysEl = document.getElementById('calendar-days');

// 모달 관련 참조
const eventModal = document.getElementById('event-modal');
const modalDate = document.getElementById('modal-date');
const modalEventsList = document.getElementById('modal-events-list');
const closeModalBtn = document.querySelector('.close-modal');

// 전역 변수
let currentDate = new Date();
let events = []; // 이벤트 데이터를 저장할 배열

// 샘플 이벤트 데이터 (실제로는 서버에서 가져와야 함)
const sampleEvents = [
    {
        id: 1,
        type: 'match',
        title: '우리팀 vs 상대팀A',
        date: '2025-05-15',
        detail: {
            time: '19:00',
            location: '한강공원 잔디구장'
        }
    },
    {
        id: 2,
        type: 'match',
        title: '우리팀 vs 상대팀B',
        date: '2025-05-10',
        detail: {
            result: '3:1',
            resultType: 'win',
            location: '상암 월드컵 경기장'
        }
    },
    {
        id: 3,
        type: 'match',
        title: '상대팀C vs 우리팀',
        date: '2025-05-05',
        detail: {
            result: '2:2',
            resultType: 'draw',
            location: '잠실 종합운동장'
        }
    },
    {
        id: 4,
        type: 'match',
        title: '상대팀D vs 우리팀',
        date: '2025-05-22',
        detail: {
            time: '15:30',
            location: '서울대공원 축구장'
        }
    },
    // 생일 - 매년 반복 이벤트로 설정
    {
        id: 5,
        type: 'birthday',
        title: '김골키퍼 생일',
        date: '2000-05-12', // 원래 생일 날짜(연도는 실제 출생연도)
        recurring: true,
        recurringType: 'yearly'
    },
    {
        id: 6,
        type: 'birthday',
        title: '박수비 생일',
        date: '1998-05-25', // 원래 생일 날짜(연도는 실제 출생연도)
        recurring: true,
        recurringType: 'yearly'
    },
    // 현재 월에 이벤트가 많은 날 추가
    {
        id: 7,
        type: 'match',
        title: '연습경기: 우리팀 vs FC강남',
        date: '2025-05-15',
        detail: {
            time: '10:00',
            location: '강남 축구장'
        }
    },
    {
        id: 8,
        type: 'birthday',
        title: '이미드필더 생일',
        date: '1995-05-15', // 원래 생일 날짜(연도는 실제 출생연도)
        recurring: true,
        recurringType: 'yearly'
    },
    {
        id: 9,
        type: 'match',
        title: '친선경기: 우리팀 vs 동호회A',
        date: '2025-05-15',
        detail: {
            time: '16:00',
            location: '잠실 보조 경기장'
        }
    },
    {
        id: 10,
        type: 'birthday',
        title: '최공격수 생일',
        date: '1997-05-15', // 원래 생일 날짜(연도는 실제 출생연도)
        recurring: true,
        recurringType: 'yearly'
    }
];

// URL 경로에 따라 초기 탭 활성화
const activateInitialTab = () => {
    const currentPage = window.location.pathname;
    if (currentPage.includes('/schedules/calendar')) {
        switchTab('calendar');
    } else {
        switchTab('matches');
    }
};

// 탭 전환 기능
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
    
    // 캘린더 탭인 경우 캘린더 초기화
    if (tabId === 'calendar') {
        renderCalendar();
    }
}

// 날짜 형식 변환 함수
function formatDate(date, format = 'monthOnly') {
    if (format === 'monthOnly') {
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long'
        }).format(date);
    } else if (format === 'full') {
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        }).format(date);
    }
}

// 캘린더 렌더링 함수
function renderCalendar() {
    // 이벤트 데이터 업데이트 - 월이 변경될 때마다 반복 이벤트를 처리
    events = processEvents(sampleEvents);
    
    // 현재 월의 첫째 날과 마지막 날 계산
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // 이전 달의 마지막 날 계산 (캘린더 시작 날짜용)
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    
    // 현재 월 표시 업데이트
    currentMonthEl.textContent = formatDate(currentDate);
    
    // 캘린더 그리드 초기화
    calendarDaysEl.innerHTML = '';
    
    // 시작 요일 (0: 일요일, 6: 토요일)
    const startDayOfWeek = firstDay.getDay();
    
    // 이전 달의 일자 추가 (비활성화 상태로)
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const dayNumber = prevMonthLastDay.getDate() - i;
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day inactive';
        dayEl.innerHTML = `<div class="day-number">${dayNumber}</div>`;
        calendarDaysEl.appendChild(dayEl);
    }
    
    // 현재 달의 일자 추가
    const today = new Date();
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        
        // 오늘 날짜 강조
        if (currentDate.getFullYear() === today.getFullYear() && 
            currentDate.getMonth() === today.getMonth() && 
            i === today.getDate()) {
            dayEl.classList.add('today');
        }
        
        dayEl.innerHTML = `<div class="day-number">${i}</div>`;
        
        // 해당 날짜의 이벤트 추가
        const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dayEvents = events.filter(event => event.date === dateString);
        
        // 모바일에서 이벤트가 많을 경우 처리
        const isMobile = window.innerWidth <= 480;
        const maxEvents = isMobile ? 2 : 4;
        
        // 이벤트 개수 제한 및 처리
        if (dayEvents.length > 0) {
            // 표시할 이벤트 수 제한
            const eventsToShow = dayEvents.slice(0, maxEvents);
            
            eventsToShow.forEach(event => {
                const eventEl = document.createElement('div');
                eventEl.className = `calendar-event ${event.type}`;
                eventEl.textContent = event.title;
                
                dayEl.appendChild(eventEl);
            });
            
            // 더 많은 이벤트가 있는 경우 표시
            if (dayEvents.length > maxEvents) {
                dayEl.classList.add('has-many-events');
                
                // 날짜 셀 클릭시 모든 이벤트 보기 - 모달 사용
                dayEl.addEventListener('click', function() {
                    openEventModal(dateString, dayEvents);
                });
            } else {
                // 이벤트가 적더라도 날짜 클릭 시 모달 표시
                dayEl.addEventListener('click', function() {
                    openEventModal(dateString, dayEvents);
                });
            }
        } else {
            // 이벤트가 없는 날짜도 클릭 시 빈 모달 표시
            dayEl.addEventListener('click', function() {
                openEventModal(dateString, []);
            });
        }
        
        calendarDaysEl.appendChild(dayEl);
    }
    
    // 다음 달의 일자 추가 (비활성화 상태로)
    // 캘린더 그리드를 42개 칸으로 맞추기 (6주)
    const totalCells = 42;
    const remainingCells = totalCells - (startDayOfWeek + lastDay.getDate());
    
    for (let i = 1; i <= remainingCells; i++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day inactive';
        dayEl.innerHTML = `<div class="day-number">${i}</div>`;
        calendarDaysEl.appendChild(dayEl);
    }
}

// 경기 필터링 함수
function filterMatches(filter) {
    const matchItems = document.querySelectorAll('.match-item');
    
    matchItems.forEach(item => {
        if (filter === 'all') {
            item.style.display = 'flex';
        } else if (filter === 'upcoming' && item.classList.contains('upcoming')) {
            item.style.display = 'flex';
        } else if (filter === 'completed' && item.classList.contains('completed')) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// 이벤트 리스너 및 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 탭 전환 이벤트 리스너
    if (matchesTab) {
        matchesTab.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab('matches');
            history.pushState(null, '', '/schedules/matches');
        });
    }
    
    if (calendarTab) {
        calendarTab.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab('calendar');
            history.pushState(null, '', '/schedules/calendar');
        });
    }

    if (matchCreateButton) {
        matchCreateButton.addEventListener('click', () => {
            CommonUtils.postToUrl('/schedules/matches')
        })
    }
    
    // 브라우저 뒤로가기 이벤트 처리
    window.addEventListener('popstate', function() {
        activateInitialTab();
    });
    
    // 필터 버튼 이벤트 리스너
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterMatches(filter);
        });
    });
    
    // 캘린더 네비게이션 이벤트 리스너
    if (prevMonthButton) {
        prevMonthButton.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    if (nextMonthButton) {
        nextMonthButton.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
    
    // 모달 닫기 이벤트 리스너
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeEventModal);
    }
    
    // 모달 외부 클릭 시 닫기
    if (eventModal) {
        eventModal.addEventListener('click', function(e) {
            if (e.target === eventModal) {
                closeEventModal();
            }
        });
    }

    // 초기 탭 활성화
    activateInitialTab();
});

// 모달 열기 함수
function openEventModal(dateString, dayEvents) {
    // 날짜 문자열을 Date 객체로 변환
    const [year, month, day] = dateString.split('-').map(num => parseInt(num));
    const eventDate = new Date(year, month - 1, day);
    
    // 모달 타이틀에 날짜 표시 
    modalDate.textContent = formatDate(eventDate, 'full');
    
    // 이벤트 목록 초기화
    modalEventsList.innerHTML = '';
    
    // 이벤트가 없는 경우
    if (dayEvents.length === 0) {
        const noEventEl = document.createElement('div');
        noEventEl.className = 'no-events';
        noEventEl.textContent = '이 날짜에 일정이 없습니다.';
        modalEventsList.appendChild(noEventEl);
    } else {
        // 이벤트 타입별로 정렬 (경기 먼저, 생일 나중에)
        const sortedEvents = [...dayEvents].sort((a, b) => {
            if (a.type === 'match' && b.type === 'birthday') return -1;
            if (a.type === 'birthday' && b.type === 'match') return 1;
            return 0;
        });
        
        // 각 이벤트 정보 추가
        sortedEvents.forEach(event => {
            const eventEl = document.createElement('div');
            eventEl.className = `modal-event-item ${event.type}`;
            
            if (event.type === 'match') {
                // 경기 이벤트인 경우
                let detailsHTML = '';
                
                if (event.detail.result) {
                    // 이미 결과가 있는 경기
                    const resultClass = event.detail.resultType === 'win' ? 'win' : 
                                        event.detail.resultType === 'loss' ? 'loss' : 'draw';
                    const resultText = event.detail.resultType === 'win' ? '승리' : 
                                      event.detail.resultType === 'loss' ? '패배' : '무승부';
                    
                    detailsHTML = `
                        <div class="modal-event-detail">
                            <i class="fas fa-trophy"></i> 결과: ${event.detail.result}
                            <span class="event-result ${resultClass}">${resultText}</span>
                        </div>
                        <div class="modal-event-detail">
                            <i class="fas fa-map-marker-alt"></i> 장소: ${event.detail.location}
                        </div>
                    `;
                } else {
                    // 예정된 경기
                    detailsHTML = `
                        <div class="modal-event-detail">
                            <i class="far fa-clock"></i> 시간: ${event.detail.time}
                        </div>
                        <div class="modal-event-detail">
                            <i class="fas fa-map-marker-alt"></i> 장소: ${event.detail.location}
                        </div>
                    `;
                }
                
                eventEl.innerHTML = `
                    <div class="modal-event-title">
                        <i class="fas fa-futbol"></i> ${event.title}
                    </div>
                    <div class="modal-event-details">
                        ${detailsHTML}
                    </div>
                `;
            } else if (event.type === 'birthday') {
                // 생일 이벤트인 경우
                eventEl.innerHTML = `
                    <div class="modal-event-title">
                        <i class="fas fa-birthday-cake"></i> ${event.title}
                    </div>
                    <div class="modal-event-details">
                        <div class="modal-event-detail">
                            <i class="fas fa-gift"></i> 축하 메시지를 보내보세요!
                        </div>
                    </div>
                `;
            }
            
            modalEventsList.appendChild(eventEl);
        });
    }
    
    // 모달 표시
    eventModal.classList.add('active');
}

// 모달 닫기 함수
function closeEventModal() {
    eventModal.classList.remove('active');
}

// 반복 이벤트 처리 함수
function processEvents(rawEvents) {
    // 기존 이벤트 복사
    const processedEvents = [...rawEvents];
    
    // 현재 표시 중인 달에 해당하는 반복 이벤트 추가
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 0-based to 1-based
    
    // 반복 이벤트 필터링 (생일 등)
    const recurringEvents = rawEvents.filter(event => event.recurring === true);
    
    // 반복 이벤트 처리
    recurringEvents.forEach(event => {
        // 이벤트의 원본 날짜 파싱
        const [origYear, origMonth, origDay] = event.date.split('-').map(num => parseInt(num));
        
        // 원본 이벤트에서 월/일만 가져와서 현재 연도에 적용
        // 단, 해당 월과 현재 표시 중인 월이 같을 때만 처리
        if (origMonth === currentMonth) {
            // 원본 이벤트와 중복 방지를 위해 event.id에 연도 추가
            const thisYearEventId = `${event.id}_${currentYear}`;
            
            // 반복 이벤트의 현재 년도 버전 생성
            const recurringEvent = {
                ...event,
                id: thisYearEventId,
                date: `${currentYear}-${String(origMonth).padStart(2, '0')}-${String(origDay).padStart(2, '0')}`,
                isRecurringInstance: true,
                originalEventId: event.id,
                age: event.type === 'birthday' ? currentYear - origYear : null
            };
            
            // 처리된 이벤트 목록에 추가
            processedEvents.push(recurringEvent);
        }
    });
    
    return processedEvents;
}

// 현재 월이 변경될 때 이벤트 다시 처리
function updateEventsForCurrentMonth() {
    events = processEvents(sampleEvents);
    renderCalendar();
}