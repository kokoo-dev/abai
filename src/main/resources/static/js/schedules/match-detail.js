import {Formation} from "./Formation.js"
import ApiClient from "../common/ApiClient.js"
import ToastMessage from "../common/ToastMessage.js"
import CommonUtils from "../common/CommonUtils.js"

// 탭 전환 기능
const tabButtons = document.querySelectorAll('.tab-btn')
const tabContents = document.querySelectorAll('.tab-content')

// 기록
const recordWrapper = document.getElementById('record-wrapper')

// 주소
const copyAddressButton = document.querySelector('.copy-address-btn')

// 쿼터
const quarterTabs = document.querySelectorAll('.quarter-tab')

// 참여 현황 쿼터 탭
const quarterParticipationTabs = document.querySelectorAll('.quarter-tab-participation')

// 편집, 삭제 버튼
const editButton = document.querySelector('.edit-btn')
const deleteButton = document.querySelector('.delete-btn')

// 경기 종료 모달 관련 코드
const completeMatchBtn = document.getElementById('complete-match-btn')
const completeMatchModal = document.getElementById('complete-match-modal')
const closeModalBtn = completeMatchModal.querySelector('.close-modal')
const confirmBtn = completeMatchModal.querySelector('.confirm-btn')
const playerStatsContainer = document.getElementById('player-stats-container')
const opponentOwnGoalInput = document.getElementById('opponent-own-goal')

let formation = null
let allPlayers = []
const memberPlayers = []
const guestPlayers = []
const currentMemberId = parseInt(document.getElementById('current-member-id').value)

// DOM 로드 시 참여 현황 탭 초기화
document.addEventListener('DOMContentLoaded', function () {
    match.getDetail((response) => {
        opponentOwnGoalInput.value = response.opponentOwnGoal || 0
    })
    match.getMembersAndGuests()
})

tabButtons.forEach(button => {
    button.addEventListener('click', function () {
        // 탭 버튼 활성화 상태 업데이트
        tabButtons.forEach(btn => btn.classList.remove('active'))
        this.classList.add('active')

        // 탭 컨텐츠 표시/숨김 처리
        const targetTab = this.getAttribute('data-tab')
        tabContents.forEach(content => {
            if (content.id === targetTab) {
                content.classList.add('active')
            } else {
                content.classList.remove('active')
            }
        })
    })
})

// 주소 복사 이벤트
copyAddressButton.addEventListener('click', function () {
    const address = document.querySelector('.match-address').textContent;
    navigator.clipboard.writeText(address)
    .then(() => {
        ToastMessage.success('주소가 복사되었습니다.')
    })
    .catch(err => {
        ToastMessage.error('주소 복사를 실패하였습니다.')
    });
})

// 쿼터 탭 클릭 이벤트
quarterTabs.forEach(tab => {
    tab.addEventListener('click', function () {
        const quarter = parseInt(this.dataset.quarter)

        // 현재 활성화된 탭 변경
        document.querySelector('.quarter-tab.active').classList.remove('active')
        this.classList.add('active')

        // 쿼터 데이터 적용
        formation.setCurrentQuarter(quarter)

        // 현재 쿼터의 포메이션 정보 불러오기
        const currentFormation = formation.getFormation()

        // 포메이션 렌더링
        renderFormation(currentFormation)
    })
})

// 참여 현황 쿼터 탭 클릭 이벤트
quarterParticipationTabs.forEach(tab => {
    tab.addEventListener('click', function () {
        const quarter = parseInt(this.dataset.quarter)

        // 현재 활성화된 탭 변경
        document.querySelector('.quarter-tab-participation.active').classList.remove('active')
        this.classList.add('active')

        // 쿼터별 참여 현황 표시
        participation.showQuarterParticipation(quarter)
    })
})

// 편집 버튼 이벤트
if (editButton) {
    editButton.addEventListener('click', function () {
        CommonUtils.postToUrl(`/schedules/matches/${match.id}`)
    })
}

// 삭제 버튼 이벤트
if (deleteButton) {
    deleteButton.addEventListener('click', function () {
        if (!confirm('정말로 이 경기 기록을 삭제하시겠습니까?')) {
            return
        }

        match.delete()
    })
}

// 모달 열기
if (completeMatchBtn) {
    completeMatchBtn.addEventListener('click', () => {
        playerStatsContainer.innerHTML = ''

        memberPlayers.forEach(item => addModalPlayer(item))
        guestPlayers.forEach(item => addModalPlayer(item))

        document.getElementById('goals-for').value = sumGoalOrAssist('.goal-input')
        document.getElementById('goals-against').value = document.getElementById('goals-against-text').textContent

        completeMatchModal.classList.add('active')
    })
}

closeModalBtn.addEventListener('click', closeModal)

// 모달 외부 클릭 시 닫기
completeMatchModal.addEventListener('click', (e) => {
    if (e.target === completeMatchModal) {
        closeModal()
    }
})

// 경기 종료 확인
confirmBtn.addEventListener('click', async () => {
    if (!confirm('저장하시겠습니까?')) {
        return
    }

    match.saveResult()
})

opponentOwnGoalInput.addEventListener('input', function() {
    document.getElementById('goals-for').value = sumGoalOrAssist('.goal-input')
})

// 포메이션 렌더링 함수
function renderFormation(formationType) {
    if (!formationType) {
        return
    }

    document.querySelector('.formation-text').textContent = formationType.split('').join('-')

    // 기존 필드 내용 초기화 (안내 메시지 유지)
    const fieldElement = document.querySelector('.field')

    // 기존 positions-container만 제거
    const oldPositionsContainer = fieldElement.querySelector(
        '.positions-container')
    if (oldPositionsContainer) {
        oldPositionsContainer.remove()
    }

    // 포지션 컨테이너 생성
    const positionsContainer = CommonUtils.getTemplateNode('positions-container-template').querySelector('.positions-container')

    // 선택된 포메이션 레이아웃 가져오기
    const layout = formation.getLayouts().get(formationType)

    // 포지션을 행별로 그룹화
    const positionsByRow = {}
    layout.forEach(pos => {
        if (!positionsByRow[pos.row]) {
            positionsByRow[pos.row] = []
        }
        positionsByRow[pos.row].push(pos)
    })

    // 각 행에 대해 포지션 요소 생성
    Object.keys(positionsByRow)
        .sort((a, b) => a - b) // 행 번호 순으로 정렬
        .forEach(row => {
            const rowPositions = positionsByRow[row]
            const playerCount = rowPositions.length // 해당 행의 선수 수

            const formationRow = CommonUtils.getTemplateNode('formation-row-template').querySelector('.formation-row')
            formationRow.classList.add(`formation-row-${row}`)
            formationRow.dataset.players = playerCount

            // 행의 포지션 요소 생성
            rowPositions.forEach(pos => {
                const formationPosition = CommonUtils.getTemplateNode('formation-position-template').querySelector('.formation-position')
                formationPosition.dataset.position = `${layout.indexOf(pos)}`

                const emptyPosition = CommonUtils.getTemplateNode('empty-position-template')

                formationPosition.appendChild(emptyPosition)
                formationRow.appendChild(formationPosition)
            })

            positionsContainer.appendChild(formationRow)
        })

    // 포지션 컨테이너 추가
    fieldElement.appendChild(positionsContainer)

    // 저장된 선수 포지션 정보 적용
    applyPlayerPositions()
}

// 저장된 선수 포지션 정보 적용
function applyPlayerPositions() {
    // 현재 쿼터에 저장된 선수 정보 가져오기
    const currentPlayers = formation.getPlayers()

    // 모든 포지션 요소 가져오기
    const positionElements = document.querySelectorAll('.formation-position')

    // 각 포지션에 선수 정보 적용
    positionElements.forEach(positionElement => {
        const position = positionElement.dataset.position
        const playerId = currentPlayers[position]?.id

        // 선수 ID가 있으면 해당 선수 정보 표시
        if (playerId) {
            const memberPlayer = memberPlayers.find(p => p.id === playerId)
            if (memberPlayer) {
                addPosition(positionElement, memberPlayer)
            }

            const guestPlayer = guestPlayers.find(p => p.id === playerId)
            if (guestPlayer) {
                addPosition(positionElement, guestPlayer)
            }
        } else {
            removePosition(positionElement)
        }
    })
}

function addPosition(positionElement, player) {
    // 활성화 클래스 추가
    positionElement.classList.add('on')

    const jersey = positionElement.querySelector('.jersey')

    // 빈 포지션 클래스 제거
    jersey.classList.remove('empty-position')

    // 현재 로그인한 유저의 포지션 표시
    if (!player.isGuest && player.id === currentMemberId) {
        jersey.classList.add('current-user')
    }

    // 기존 번호와 이름 요소가 있으면 제거
    const existingNumber = jersey.querySelector('.player-number')
    if (existingNumber) {
        existingNumber.remove()
    }

    const existingName = positionElement.querySelector(
        '.player-name-display')
    if (existingName) {
        existingName.remove()
    }

    // 선수 번호 추가
    const playerNumber = CommonUtils.getTemplateNode('player-number-template')
    playerNumber.querySelector('.player-number').textContent = player.number
    jersey.appendChild(playerNumber)

    // 선수 이름 추가
    const playerName = CommonUtils.getTemplateNode('player-name-template')
    playerName.querySelector('.player-name-display').textContent = player.name
    positionElement.appendChild(playerName)
}

function removePosition(positionElement) {
    // 활성화 클래스 제거
    positionElement.classList.remove('on')

    // 선수가 배정되지 않은 포지션은 빈 상태로 초기화
    const jersey = positionElement.querySelector('.jersey')
    jersey.classList.add('empty-position')

    // 기존 번호와 이름 요소 제거
    const existingNumber = jersey.querySelector('.player-number')
    if (existingNumber) {
        existingNumber.remove()
    }

    const existingName = positionElement.querySelector(
        '.player-name-display')
    if (existingName) {
        existingName.remove()
    }
}

function addRecord(name = '', goal = 0, assist = 0) {
    if (goal === 0 && assist === 0) {
        return
    }

    const recordCard = CommonUtils.getTemplateNode('record-card-template')
    recordCard.querySelector('.record-name').textContent = name
    recordCard.querySelector('.record-stat-value.goal').textContent = goal
    recordCard.querySelector('.record-stat-value.assist').textContent = assist

    recordWrapper.appendChild(recordCard)
}

// 모달 닫기
function closeModal() {
    completeMatchModal.classList.remove('active')
}

// 모달 선수 추가
function addModalPlayer(player) {
    const playerStatsNode = CommonUtils.getTemplateNode('player-stats-template')
    const playerItem = playerStatsNode.querySelector('.player-stats-item')
    playerItem.dataset.id = player.id
    playerItem.dataset.isGuest = player.isGuest

    playerStatsNode.querySelector('.player-name').textContent = player.name
    playerStatsNode.querySelector('.player-number').textContent = `#${player.number}`

    playerStatsNode.querySelector('.goal-input').value = player.goalsFor
    playerStatsNode.querySelector('.assist-input').value = player.assist

    playerStatsNode.querySelector('.goal-input').addEventListener('input', function() {
        document.getElementById('goals-for').value = sumGoalOrAssist('.goal-input')
    })

    playerStatsContainer.appendChild(playerStatsNode)
}

function sumGoalOrAssist(selector) {
    const membersGoal = Array.from(document.querySelectorAll(selector))
        .map(input => parseInt(input.value, 10) || 0)
        .reduce((previous, current) => previous + current, 0)

    const opponentOwnGoal = parseInt(opponentOwnGoalInput.value, 10) || 0

    return membersGoal + opponentOwnGoal
}

const match = {
    id: document.getElementById('match-id').value,
    delete() {
        ApiClient.request({
            url: `/v1/matches/${match.id}`,
            method: 'DELETE',
            onSuccess: (response) => {
                location.replace('/schedules/matches')
            }
        })
    },
    getDetail(onSuccess) {
        ApiClient.request({
            url: `/v1/matches/${match.id}`,
            method: 'GET',
            onSuccess: (response) => onSuccess(response)
        })
    },
    getMembersAndGuests() {
        Promise.all([
            new Promise((resolve, reject) => { match.getMembers(resolve, reject) }),
            new Promise((resolve, reject) => { match.getGuests(resolve, reject) })
        ]).then(([memberResponse, guestResponse]) => {
            memberResponse.sort((a, b) => a.number - b.number).forEach(it => {
                memberPlayers.push({
                    id: it.member.id,
                    name: it.member.name,
                    number: it.member.uniformNumber,
                    position: it.member.preferredPosition,
                    isGuest: false,
                    goalsFor: it.goalsFor,
                    assist: it.assist
                })

                addRecord(it.member.name, it.goalsFor, it.assist)
            })

            guestResponse.sort((a, b) => a.number - b.number).forEach(it => {
                guestPlayers.push({
                    id: it.guest.id,
                    name: it.guest.name,
                    number: 0,
                    position: 'MF',
                    isGuest: true,
                    goalsFor: it.goalsFor,
                    assist: it.assist
                })

                addRecord(it.guest.name, it.goalsFor, it.assist)
            })

            match.getFormations()
        })
    },
    getMembers(onSuccess, onError) {
        ApiClient.request({
            url: `/v1/matches/${match.id}/members`,
            method: 'GET',
            onSuccess: (response) => onSuccess(response),
            onError: (error) => onError(error)
        })
    },
    getGuests(onSuccess, onError) {
        ApiClient.request({
            url: `/v1/matches/${match.id}/guests`,
            method: 'GET',
            onSuccess: (response) => onSuccess(response),
            onError: (error) => onError(error)
        })
    },
    getFormations() {
        ApiClient.request({
            url: `/v1/matches/${match.id}/formations`,
            method: 'GET',
            onSuccess: (response) => {
                formation = new Formation()

                if (response.length === 0) {
                    renderFormation(formation.getFormation())
                    return
                }

                const formations = response.map(response => response.formation)
                formation.initQuarters(formations)

                // 모든 선수에 quarters 정보 초기화
                allPlayers = [...memberPlayers, ...guestPlayers]
                allPlayers.forEach(player => {
                    player.quarters = [
                        { playing: false },
                        { playing: false },
                        { playing: false },
                        { playing: false }
                    ]
                })

                response.forEach((item, index) => {
                    let includeQuarterCurrentUser = false

                    const quarter = index + 1
                    formation.setCurrentQuarter(quarter)

                    item.positions.forEach(position => {
                        const isGuest = position.playerType === 'GUEST'
                        const playerId = isGuest ? position.guestId : position.memberId

                        formation.setPlayer(
                            position.position,
                            {
                                id: playerId,
                                type: position.playerType,
                                name: position.playerName
                            }
                        )

                        // 선수의 쿼터별 참여 정보 업데이트
                        const player = allPlayers.find(p => p.id === playerId)
                        if (player) {
                            player.quarters[quarter - 1].playing = true
                        }

                        // 현재 로그인한 유저의 참여 쿼터 체크
                        if (!isGuest && position.memberId === currentMemberId) {
                            includeQuarterCurrentUser = true
                        }
                    })

                    // 현재 로그인한 유저의 참여 쿼터 표시
                    if (includeQuarterCurrentUser) {
                        document.querySelectorAll('.quarter-tab')[index].classList.add('current-user')
                    }
                })
                formation.setCurrentQuarter(1)
                renderFormation(formation.getFormation())

                // 멤버 정보 불러온 후 참여 정보 초기화
                participation.loadParticipationData()
            }
        })
    },
    saveResult() {
        const goalsFor = document.getElementById('goals-for').value
        const goalsAgainst = document.getElementById('goals-against').value
        const opponentOwnGoal = opponentOwnGoalInput.value
        const assist = Array.from(document.querySelectorAll('.assist-input'))
            .map(input => parseInt(input.value, 10) || 0)
            .reduce((previous, current) => previous + current, 0)

        const groupedPlayers = Array.from(document.querySelectorAll('.player-stats-item'))
        .reduce((previous, current) => {
            const isGuest = current.dataset.isGuest
            const key = isGuest === 'true' ? 'GUEST' : 'MEMBER'
            if (!previous[key]) {
                previous[key] = []
            }

            previous[key].push({
                id: current.dataset.id,
                goalsFor: current.querySelector('.goal-input').value,
                assist: current.querySelector('.assist-input').value
            })

            return previous
        }, {})

        ApiClient.request({
            url: `/v1/matches/${match.id}/results`,
            method: 'POST',
            params: {
                goalsFor,
                goalsAgainst,
                opponentOwnGoal,
                assist,
                members: groupedPlayers['MEMBER'],
                guests: groupedPlayers['GUEST']
            },
            onSuccess: (response) => {
                location.reload()
            }
        })
    }
}

const participation = {
    loadParticipationData() {
        // 전체 참여 현황 요약 업데이트
        participation.updateParticipationSummary()

        // 쿼터별 참여 현황 업데이트
        participation.updateQuarterParticipation()

        // 개인별 참여 현황 업데이트
        participation.updateIndividualParticipation()
    },
    updateParticipationSummary() {
        const totalMemberCount = document.getElementById('total-member-count').value
        // 멤버 참여율 계산
        const participationRate = memberPlayers.length > 0 ? Math.round((memberPlayers.length / totalMemberCount) * 100) : 0

        // DOM 업데이트
        document.getElementById('member-participants').textContent = `${memberPlayers.length} / ${allPlayers.length}`
        document.getElementById('guest-participants').textContent = `${guestPlayers.length} / ${allPlayers.length}`
        document.getElementById('participation-rate').textContent = `${participationRate}%`
    },
    updateQuarterParticipation() {
        // 각 쿼터별 참여 현황 업데이트
        for (let quarter = 1; quarter <= 4; quarter++) {
            participation.updateQuarterContent(quarter)
        }

        // 첫 번째 쿼터 표시
        participation.showQuarterParticipation(1)
    },
    updateQuarterContent(quarter) {
        const quarterContentNode = CommonUtils.getTemplateNode('quarter-content-template')
        const quarterContent = quarterContentNode.querySelector('.quarter-content')
        quarterContent.id = `quarter-${quarter}-content`
        if (quarter === 1) {
            quarterContent.classList.add('active')
        }

        const playingList = quarterContentNode.querySelector('.participation-player-list')
        allPlayers.filter(player =>
            player.quarters && player.quarters[quarter - 1] && player.quarters[quarter - 1].playing
        ).forEach(player => {
            const playerItem = participation.createPlayerListItem(player)
            playingList.appendChild(playerItem)
        })

        const restingList = quarterContentNode.querySelector('.rest-player-list')
        allPlayers.filter(player =>
            !player.quarters || !player.quarters[quarter - 1] || !player.quarters[quarter - 1].playing
        ).forEach(player => {
            const playerItem = participation.createPlayerListItem(player)
            restingList.appendChild(playerItem)
        })

        document.querySelector('.quarter-participation').appendChild(quarterContentNode)
    },
    createPlayerListItem(player) {
        const playerItem = CommonUtils.getTemplateNode('participation-player-item-template')
        playerItem.querySelector('.player-number').textContent = player.number || 0
        playerItem.querySelector('.player-name').textContent = player.name

        return playerItem
    },
    showQuarterParticipation(quarter) {
        // 모든 쿼터 컨텐츠 숨기기
        document.querySelectorAll('.quarter-content').forEach(content => {
            content.classList.remove('active')
        })

        // 선택된 쿼터 컨텐츠 표시
        document.getElementById(`quarter-${quarter}-content`).classList.add('active')
    },
    updateIndividualParticipation() {
        const container = document.getElementById('individual-stats-container')
        container.innerHTML = ''

        allPlayers.forEach(player => {
            const playerCard = participation.createIndividualStatCard(player)
            container.appendChild(playerCard)
        })
    },
    createIndividualStatCard(player) {
        // 참여 쿼터 수 계산
        const participatingQuarters = player.quarters ?
            player.quarters.filter(quarter => quarter.playing).length : 0

        const card = CommonUtils.getTemplateNode('individual-stat-card-template')
        card.querySelector('.player-name').textContent = player.name
        card.querySelector('.player-number').textContent = `#${player.number || 0}`
        card.querySelector('.participation-count').textContent = participatingQuarters
        card.querySelector('.participation-time').textContent = participation.formatMinutes(participatingQuarters * 30)

        // 쿼터별 참여 현황 바 생성
        const quarterBars = participation.createQuarterParticipationBars(player)
        const bars = card.querySelector('.quarter-participation-bars')
        quarterBars.forEach(bar => bars.appendChild(bar))

        return card
    },
    createQuarterParticipationBars(player) {
        const barsHtml = []

        for (let quarter = 1; quarter <= 4; quarter++) {
            const isPlaying = player.quarters && player.quarters[quarter - 1] && player.quarters[quarter - 1].playing

            const quarterBar = CommonUtils.getTemplateNode('quarter-bar-template')
            quarterBar.querySelector('.quarter-bar-label').textContent = `${quarter}쿼터`

            const barFill = quarterBar.querySelector('.quarter-bar-fill')

            if (isPlaying) {
                barFill.classList.add('active')
            }

            quarterBar.querySelector('.quarter-bar-value').textContent = isPlaying ? '참여' : '휴식'

            barsHtml.push(quarterBar)
        }

        return barsHtml
    },
    formatMinutes(totalMinutes) {
        if (totalMinutes < 60) {
            return `${totalMinutes}분`;
        }

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return minutes === 0
            ? `${hours}시간`
            : `${hours}시간 ${minutes}분`;
    }
}