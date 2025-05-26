import CommonUtils from "../common/CommonUtils.js";
import ApiClient from "../common/ApiClient.js";
import DateUtils from "../common/DateUtils.js";
import {
    MATCH_STATUS,
    MATCH_RESULT
} from "./MatchConstants.js";

const matchesTab = document.getElementById('matches-tab')
const calendarTab = document.getElementById('calendar-tab')
const matchCreateButton = document.getElementById('match-create-button')
const filterButtons = document.querySelectorAll('.filter-btn')

// 모달 관련 참조
const eventModal = document.getElementById('event-modal')
const modalDate = document.getElementById('modal-date')
const modalEventsList = document.getElementById('modal-events-list')
const closeModalBtn = document.querySelector('.close-modal')

// 전역 변수
let calendar = null
let events = [] // 이벤트 데이터를 저장할 배열
const eventTypes = Object.freeze({
    birthday: 'birthday',
    match: 'match',
})

// 이벤트 리스너 및 초기화
document.addEventListener('DOMContentLoaded', function () {
    match.getList()

    // 탭 전환 이벤트 리스너
    if (matchesTab) {
        matchesTab.addEventListener('click', function (e) {
            e.preventDefault()
            switchTab('matches')
            history.pushState(null, '', '/schedules/matches')
        })
    }

    if (calendarTab) {
        calendarTab.addEventListener('click', function (e) {
            e.preventDefault()
            switchTab('calendar')
            history.pushState(null, '', '/schedules/calendar')
        })
    }

    if (matchCreateButton) {
        matchCreateButton.addEventListener('click', () => {
            CommonUtils.postToUrl('/schedules/matches')
        })
    }

    // 브라우저 뒤로가기 이벤트 처리
    window.addEventListener('popstate', function () {
        activateInitialTab()
    })

    // 필터 버튼 이벤트 리스너
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'))
            this.classList.add('active')

            const status = this.getAttribute('data-filter')
            if (status === 'all') {
                match.getNewList(null)
            } else {
                match.getNewList(status)
            }
        })
    })

    // 모달 닫기 이벤트 리스너
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeEventModal)
    }

    // 모달 외부 클릭 시 닫기
    if (eventModal) {
        eventModal.addEventListener('click', function (e) {
            if (e.target === eventModal) {
                closeEventModal()
            }
        })
    }

    // 초기 탭 활성화
    activateInitialTab()
})

// URL 경로에 따라 초기 탭 활성화
const activateInitialTab = () => {
    const currentPage = window.location.pathname
    if (currentPage.includes('/schedules/calendar')) {
        switchTab('calendar')
    } else {
        switchTab('matches')
    }
};

// 탭 전환 기능
function switchTab(tabId) {
    // 모든 탭 컨텐츠와 탭 버튼 비활성화
    document.querySelectorAll('.content-section').forEach(content => {
        content.classList.remove('active')
    })

    document.querySelectorAll('.sub-tab').forEach(tab => {
        tab.classList.remove('active')
    })

    // 선택한 탭 컨텐츠와 탭 버튼 활성화
    document.getElementById(tabId + '-content').classList.add('active')
    document.getElementById(tabId + '-tab').classList.add('active')

    // 캘린더 탭인 경우 캘린더 초기화
    if (tabId === 'calendar') {
        if (calendar) {
            calendar.render()
        } else {
            initializeCalendar()
        }
    }
}

// FullCalendar 초기화 함수
function initializeCalendar() {
    const calendarEl = document.getElementById('calendar')

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,listMonth'
        },
        locale: 'ko',
        eventClick: function (info) {
            getCalendarClickEvent(info.event.start)
        },
        dateClick: function (info) {
            getCalendarClickEvent(info.date)
        },
        // 한글화 및 추가 설정
        buttonText: {
            today: '오늘',
            month: '월',
            list: '목록',
            prev: '이전',
            next: '다음'
        },
        // 달력 높이 설정
        height: 'auto',
        // 제목 포맷 변경
        titleFormat: {year: 'numeric', month: 'long'},
        // 월 변경 시 이벤트 발생
        datesSet: function (dateInfo) {
            if (dateInfo.view.type === 'dayGridMonth') {
                // 현재 표시된 달력의 시작일과 종료일
                const start = dateInfo.start
                const end = dateInfo.end

                match.getSchedules()

                // 반복 이벤트 재처리 (월이 변경되었으므로)
                refreshRecurringEvents(start, end)
            }
        }
    })

    calendar.render()
    member.getList()
}

function getCalendarClickEvent(clickedDate) {
    const today = DateUtils.formatDate(clickedDate, 'yyyy-MM-dd')

    const date = new Date(clickedDate)
    const MM = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')

    const dayEvents = events.filter(event => {
        if (event.type === eventTypes.birthday) {
            return event.date.substring(5, 10) === `${MM}-${dd}`
        } else {
            return event.date === today
        }
    })

    openEventModal(today, dayEvents)
}

// 현재 표시된 월에 맞게 반복 이벤트 새로고침
function refreshRecurringEvents(startDate, endDate) {
    // 현재 표시된 월의 연도와 월
    const currentViewYear = startDate.getFullYear()

    // 기존 반복 이벤트 인스턴스 제거
    const existingEvents = calendar.getEvents()
    existingEvents.forEach(event => {
        if (event.extendedProps.originalEvent &&
            event.extendedProps.originalEvent.isRecurringInstance) {
            event.remove()
        }
    })

    // 원본 이벤트에서 반복 이벤트 필터링
    const recurringEvents = events.filter(event => event.recurring)

    // 각 반복 이벤트에 대해 현재 표시된 월에 해당하는 인스턴스 생성
    recurringEvents.forEach(event => {
        // 이벤트의 원본 날짜 파싱
        const [origYear, origMonth, origDay] = event.date.split('-').map(num => parseInt(num))

        // 현재 보고 있는 월에 해당 반복 이벤트 생성
        const eventDate = new Date(currentViewYear, origMonth - 1, origDay)

        // 현재 달력에 표시된 기간 내에 있는지 확인
        if (eventDate >= startDate && eventDate < endDate) {
            const formattedDate = DateUtils.formatDate(eventDate, 'yyyy-MM-dd')

            // 새 반복 이벤트 인스턴스 생성
            const thisYearEventId = `${event.id}_${currentViewYear}`
            const recurringEvent = {
                ...event,
                id: thisYearEventId,
                date: formattedDate,
                isRecurringInstance: true,
                originalEventId: event.id,
                age: event.type === eventTypes.birthday ? currentViewYear - origYear : null
            }

            // 캘린더에 이벤트 추가
            calendar.addEvent({
                id: thisYearEventId,
                title: event.title,
                start: formattedDate,
                classNames: [`fc-event-${event.type}`],
                extendedProps: {
                    type: event.type,
                    detail: event.detail,
                    originalEvent: recurringEvent
                }
            })
        }
    })
}

// 모달 열기 함수
function openEventModal(dateString, dayEvents) {
    // 날짜 문자열을 Date 객체로 변환
    const [year, month, day] = dateString.split('-').map(num => parseInt(num))
    const eventDate = new Date(year, month - 1, day)

    // 모달 타이틀에 날짜 표시 
    modalDate.textContent = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    }).format(eventDate)

    // 이벤트 목록 초기화
    modalEventsList.innerHTML = ''

    // 이벤트가 없는 경우
    if (dayEvents.length === 0) {
        const noEventEl = document.createElement('div')
        noEventEl.className = 'no-events'
        noEventEl.textContent = '이 날짜에 일정이 없습니다.'
        modalEventsList.appendChild(noEventEl)
    } else {
        // 이벤트 타입별로 정렬 (경기 먼저, 생일 나중에)
        const sortedEvents = [...dayEvents].sort((a, b) => {
            if (a.type === eventTypes.match && b.type === eventTypes.birthday) {
                return -1
            }
            if (a.type === eventTypes.birthday && b.type === eventTypes.match) {
                return 1
            }
            return 0
        })

        // 각 이벤트 정보 추가
        sortedEvents.forEach(event => {
            const eventEl = document.createElement('div')
            eventEl.className = `modal-event-item ${event.type}`

            if (event.type === eventTypes.match) {
                // 경기 이벤트인 경우
                let detailsHTML = ''

                if (event.detail.result) {
                    // 이미 결과가 있는 경기
                    const resultClass = event.detail.resultType === 'win'
                        ? 'win' :
                        event.detail.resultType === 'loss' ? 'loss' : 'draw'
                    const resultText = event.detail.resultType === 'win' ? '승리'
                        :
                        event.detail.resultType === 'loss' ? '패배' : '무승부'

                    detailsHTML = `
                        <div class="modal-event-detail">
                            <i class="fas fa-trophy"></i> 결과: ${event.detail.result}
                            <span class="event-result ${resultClass}">${resultText}</span>
                        </div>
                        <div class="modal-event-detail">
                            <i class="fas fa-map-marker-alt"></i> 장소: ${event.detail.location}
                        </div>
                    `
                } else {
                    // 예정된 경기
                    detailsHTML = `
                        <div class="modal-event-detail">
                            <i class="far fa-clock"></i> 시간: ${event.detail.time}
                        </div>
                        <div class="modal-event-detail">
                            <i class="fas fa-map-marker-alt"></i> 장소: ${event.detail.location}
                        </div>
                    `
                }

                eventEl.innerHTML = `
                    <div class="modal-event-title">
                        <i class="fas fa-futbol"></i> ${event.title}
                    </div>
                    <div class="modal-event-details">
                        ${detailsHTML}
                    </div>
                `
            } else if (event.type === eventTypes.birthday) {
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
                `
            }

            modalEventsList.appendChild(eventEl)
        })
    }

    // 모달 표시
    eventModal.classList.add('active')
}

// 모달 닫기 함수
function closeEventModal() {
    eventModal.classList.remove('active')
}

const match = {
    observer: new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    match.getList()
                }
            })
        },
        {
            root: null,
            threshold: 1.0
        }
    ),
    lastMatchAt: null,
    lastId: null,
    status: null,
    hasNext: true,
    getNewList(status) {
        // 조회 조건 초기화
        match.lastId = null
        match.lastMatchAt = null
        match.status = status
        match.hasNext = true

        // 아이템 요소 삭제
        document.querySelectorAll('.match-item').forEach(el => el.remove())

        match.getList()
    },
    getList() {
        if (!match.hasNext) {
            return
        }

        ApiClient.request({
            url: '/v1/matches',
            method: 'GET',
            params: {
                lastMatchAt: match.lastMatchAt,
                lastId: match.lastId,
                status: match.status
            },
            onSuccess: (response) => {
                match.lastMatchAt = response.lastId.matchAt
                match.lastId = response.lastId.id
                match.hasNext = response.hasNext

                match.drawList(response.contents)
            }
        })
    },
    getSchedules() {
        // 기존 경기 일정 이벤트 제거
        const existingEvents = calendar.getEvents()
        existingEvents.forEach(event => {
            if (event.extendedProps.type === eventTypes.match &&
                !event.extendedProps.originalEvent.isRecurringInstance) {
                events = events.filter(it => !(it.id === event.extendedProps.originalEvent.id && it.type === eventTypes.match))
                event.remove()
            }
        })

        ApiClient.request({
            url: '/v1/matches/schedules',
            method: 'GET',
            params: {
                startDate: DateUtils.formatDate(calendar.currentData.dateProfile.activeRange.start),
                endDate: DateUtils.formatDate(calendar.currentData.dateProfile.activeRange.end)
            },
            onSuccess: (response) => {
                // 새 경기 일정 추가
                response.forEach(item => {
                    const matchDate = new Date(item.matchAt)
                    const dateString = DateUtils.formatDate(matchDate, 'yyyy-MM-dd')
                    const time = DateUtils.formatDate(matchDate, 'HH:mm')
                    const result = item.status === MATCH_STATUS.COMPLETED ? `${item.goalsFor}:${item.goalsAgainst}` : null
                    const resultType = item.result === MATCH_RESULT.DEFEAT ? 'loss' : item.result === MATCH_RESULT.DRAW ? 'draw' : item.result === MATCH_RESULT.VICTORY ? 'win' : null

                    events.push({
                        id: item.id,
                        type: eventTypes.match,
                        title: item.opponentName,
                        date: dateString,
                        detail: {
                            time: time,
                            location: item.location,
                            result: result,
                            resultType: resultType
                        }
                    })

                    // FullCalendar 이벤트 형식으로 변환하여 추가
                    calendar.addEvent({
                        id: `match_${item.id}`,
                        title: item.opponentName,
                        start: dateString,
                        classNames: ['fc-event-match'],
                        extendedProps: {
                            type: eventTypes.match,
                            detail: {
                                time: time,
                                location: item.location,
                                result: result,
                                resultType: resultType
                            },
                            originalEvent: {
                                id: item.id,
                                type: eventTypes.match,
                                title: item.opponentName,
                                date: dateString,
                            }
                        }
                    })
                })
            }
        })
    },
    drawList(items = []) {
        const matchBody = document.getElementById('match-list')

        items.forEach(item => {
            const matchAt = new Date(item.matchAt)
            const matchNode = CommonUtils.getTemplateNode('match-template')

            let statusClass = 'upcoming'
            let statusText = '예정'
            if (item.status === MATCH_STATUS.READY) {
                matchNode.querySelector('.score').remove()
            } else if (item.status === MATCH_STATUS.COMPLETED) {
                statusClass = 'completed'
                statusText = '완료'
                matchNode.querySelector('.versus').remove()
                matchNode.querySelector('.score').textContent = `${item.goalsFor}:${item.goalsAgainst}`
            }

            let resultClass = 'win'
            let resultText = '승리'
            if (item.result === MATCH_RESULT.DRAW) {
                resultClass = 'draw'
                resultText = '무승부'
            } else if (item.result === MATCH_RESULT.DEFEAT) {
                resultClass = 'loss'
                resultText = '패배'
            }

            const matchItem = matchNode.querySelector('.match-item')
            matchItem.classList.add(statusClass)
            matchItem.dataset.matchId = item.id

            matchNode.querySelector('.time-text').textContent = DateUtils.formatDate(matchAt, 'yyyy-MM-dd HH:mm')
            matchNode.querySelector('.team.away').textContent = item.opponentName

            const matchResult = matchNode.querySelector('.match-result')
            matchResult.classList.add(resultClass)
            matchResult.textContent = resultText
            if (item.result === MATCH_RESULT.READY) {
                matchResult.remove()
            }

            const matchStatus = matchNode.querySelector('.match-status')
            matchStatus.classList.add(`${statusClass}-badge`)
            matchStatus.textContent = statusText

            matchNode.querySelector('.location-text').textContent = item.location

            matchBody.appendChild(matchNode)
        })

        match.observer.disconnect()
        match.observeLastItem()
    },
    observeLastItem() {
        const items = document.querySelectorAll('.match-item')
        const lastItem = items[items.length - 1]

        if (lastItem) {
            match.observer.observe(lastItem)
        }
    }
}

const member = {
    getList() {
        ApiClient.request({
            url: '/v1/members',
            method: 'GET',
            onSuccess: (response) => {
                // 멤버 생일 추가
                response.forEach(member => {
                    events.push(
                        {
                            id: member.id,
                            type: eventTypes.birthday,
                            title: member.name,
                            date: member.birthday,
                            recurring: true,
                            recurringType: 'yearly'
                        }
                    )
                })

                const start = calendar.currentData.dateProfile.activeRange.start
                const end = calendar.currentData.dateProfile.activeRange.end
                refreshRecurringEvents(start, end)
            }
        })
    }
}