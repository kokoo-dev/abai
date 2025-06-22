import {Formation} from "./Formation.js"
import ToastMessage from "../common/ToastMessage.js"
import ApiClient from "../common/ApiClient.js"
import CommonUtils from "../common/CommonUtils.js"

// DOM 요소 참조
const formationSelect = document.getElementById('formation-select')
const quarterTabs = document.querySelectorAll('.quarter-tab')
const saveButton = document.querySelector('.save-btn')
const fieldElement = document.querySelector('.field')

// 경기 정보 입력 요소 참조
const matchDateInput = document.getElementById('match-date')
const matchTimeInput = document.getElementById('match-time')
const opponentTeamInput = document.getElementById('opponent-team')
const matchLocationInput = document.getElementById('match-location')
const matchAddressInput = document.getElementById('match-address')

// 주소 검색 관련 DOM 요소 참조
const searchLocationButton = document.getElementById('search-location')
const mapContainer = document.getElementById('map-container')
const mapElement = document.getElementById('map')
const keywordInput = document.getElementById('keyword')
const searchKeywordButton = document.getElementById('search-keyword')

// 선수 선택 관련 DOM 요소 참조
const playerList = document.getElementById('player-list')
const selectedPlayerCount = document.getElementById('selected-player-count')
const totalPlayerCount = document.getElementById('total-player-count')

// 용병 추가 관련 DOM 요소 참조
const addGuestPlayerButton = document.getElementById('add-guest-player')
const guestPlayerModal = document.getElementById('guest-player-modal')
const guestPlayerNameInput = document.getElementById('guest-player-name')
const addGuestSubmitButton = document.getElementById('add-guest-player-btn')

// 선수 선택 모달
const playerSelectModal = document.getElementById('player-select-modal')
const modalPlayerList = document.querySelector('.modal-player-list')

// 포지션 자동 배정 모달
const autoPositionButton = document.getElementById('auto-position-btn')
const autoPositionModal = document.getElementById('auto-position-modal')
const generatePositionButton = document.getElementById('generate-position-btn')
const closeModalButtons = document.querySelectorAll('.close-modal')
const priorityPlayers = document.getElementById('priority-players')

// 포메이션
let formation = new Formation()
const formationKeys = [...formation.getLayouts().keys()]

// 포메이션 option 추가
formationKeys.forEach(item => {
    const option = document.createElement('option')
    option.value = item
    option.textContent = item.split('').join('-')
    formationSelect.appendChild(option)
})

// 경기 정보
const matchInfo = {
    date: document.getElementById('match-date').value || '',
    time: document.getElementById('match-time').value || '',
    opponentTeam: document.getElementById('opponent-team').value || '',
    location: document.getElementById('match-location').value || '',
    address: document.getElementById('match-address').value || '',
    latitude: document.getElementById('map-latitude').value || '',
    longitude: document.getElementById('map-longitude').value || ''
}

// 전역 변수 (추가)
let currentPosition = null // 현재 선택된 포지션
let allPlayers = [] // 모든 선수 데이터
let selectedPlayers = new Set() // 출전 선수 ID 집합
let guestPlayers = [] // 용병 선수 배열
const saveMode = document.getElementById('save-mode').value ?? 'create'
let memberSettingComplete = false

// 우선 배정할 선수 ID 집합
let fewMatchPlayerIds = new Set()

const match = {
    id: document.getElementById('match-id').value,
    getMembersAndGuests() {
        Promise.all([
            new Promise((resolve, reject) => { match.getMembers(resolve, reject) }),
            new Promise((resolve, reject) => { match.getGuests(resolve, reject) })
        ]).then(([memberResponse, guestResponse]) => {
            memberResponse.forEach(it => {
                selectedPlayers.add(it.member.id)
            })

            guestResponse.forEach(it => {
                const newGuestPlayer = {
                    id: it.guest.id,
                    name: it.guest.name,
                    number: 0,
                    positions: [],
                    isGuest: true
                }

                // 용병 목록에 추가
                guestPlayers.push(newGuestPlayer)

                // 선택된 선수 목록에 추가
                selectedPlayers.add(newGuestPlayer.id)

                // 전체 선수 목록에 추가
                allPlayers.push(newGuestPlayer)
            })

            totalPlayerCount.textContent = allPlayers.length
            selectedPlayerCount.textContent = selectedPlayers.size

            // 선수 목록 렌더링
            renderPlayerList()

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
                formation.initQuarters(response.map(response => response.formation))

                response.forEach((item, index) => {
                    const quarter = index + 1
                    formation.setCurrentQuarter(quarter)

                    item.positions.forEach(position => {
                        const isGuest = position.playerType === 'GUEST'

                        formation.setPlayer(
                            position.position,
                            {
                                id: isGuest ? position.guestId : position.memberId,
                                type: position.playerType,
                                name: position.playerName
                            }
                        )
                    })
                })

                formation.setCurrentQuarter(1)
                renderFormation(formation.getFormation())

                playerQuarterStats.init()
            }
        })
    }
}

const saveModeHandler = {
    create: {
        init() {
            // 포메이션 렌더링
            renderFormation(formationSelect.value)

            // 선수 데이터 로드
            this.loadPlayers()
        },
        loadPlayers() { // 선수 데이터 로드
            ApiClient.request({
                url: '/v1/members/with-positions',
                method: 'GET',
                onSuccess: (response) => {
                    allPlayers = response.map(it => {
                        // default: 전체 선수 선택
                        selectedPlayers.add(it.id)

                        return {
                            id: it.id,
                            number: it.uniformNumber,
                            name: it.name,
                            positions: it.positions,
                            isGuest: false
                        }
                    })

                    // 총 선수 수 표시
                    totalPlayerCount.textContent = allPlayers.length
                    selectedPlayerCount.textContent = selectedPlayers.size

                    // 선수 목록 렌더링
                    renderPlayerList()

                    memberSettingComplete = true

                    playerQuarterStats.init()
                }
            })
        },
        api: {
            url: '/v1/matches',
            method: 'POST',
            onSuccess(response) {
                location.href = '/schedules/matches'
            }
        }
    },
    update: {
        init() {
            // 포메이션 렌더링
            renderFormation(formationSelect.value)

            // 선수 데이터 로드
            this.loadPlayers()
        },
        loadPlayers() { // 선수 데이터 로드
            ApiClient.request({
                url: '/v1/members/with-positions',
                method: 'GET',
                onSuccess: (response) => {
                    allPlayers = response.map(it => {
                        return {
                            id: it.id,
                            number: it.uniformNumber,
                            name: it.name,
                            positions: it.positions,
                            isGuest: false
                        }
                    })

                    match.getMembersAndGuests()
                    memberSettingComplete = true
                }
            })
        },
        api: {
            url: `/v1/matches/${match.id}`,
            method: 'PUT',
            onSuccess(response) {
                location.href = `/schedules/matches/${match.id}`
            }
        }
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function () {
    saveModeHandler[saveMode].init()

    // 용병 모달 관련 이벤트 리스너 등록
    guestPlayer.initEvents()
})

// 포메이션 변경 시 이벤트 처리
formationSelect.addEventListener('change', function () {
    const selectedFormation = this.value
    formation.setFormation(selectedFormation)

    renderFormation(selectedFormation)
})

// 쿼터 탭 클릭 이벤트 처리
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
        formationSelect.value = currentFormation

        // 포메이션 렌더링
        renderFormation(currentFormation)
    })
})

// 경기 정보 입력 필드 이벤트 처리
matchDateInput.addEventListener('change', function () {
    matchInfo.date = this.value
})

matchTimeInput.addEventListener('change', function () {
    matchInfo.time = this.value
})

opponentTeamInput.addEventListener('input', function () {
    matchInfo.opponentTeam = this.value
})

// 주소 검색 관련 이벤트 처리
// 주소 검색 버튼 클릭 시
searchLocationButton.addEventListener('click', function () {
    // 지도 영역 토글
    if (mapContainer.style.display === 'none' || mapContainer.style.display
        === '') {
        mapContainer.style.display = 'block'

        // 지도가 아직 초기화되지 않았다면 초기화
        if (!kakaoMap.map) {
            kakaoMap.initMap()
        }
    } else {
        mapContainer.style.display = 'none'
    }
})

// 키워드 검색 버튼 클릭 시
searchKeywordButton.addEventListener('click', function () {
    kakaoMap.searchPlaces()
})

// 키워드 입력창에서 엔터 키 입력 시
keywordInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        kakaoMap.searchPlaces()
    }
})

// 필드 전체에 대한 클릭 이벤트 처리 (모달 사용 방식으로 변경)
fieldElement.addEventListener('click', function (e) {
    const positionElement = e.target.closest('.formation-position')
    if (!positionElement) {
        return
    }

    // 이미 포지션에 존재하는 경우 해당 포지션 초기화
    if (positionElement.classList.contains('on')) {
        removePosition(positionElement)

        const position = positionElement.dataset.position
        formation.removePlayer(position)

        // 통계 업데이트
        playerQuarterStats.updateStats()

        return
    }

    // 현재 포지션 저장
    currentPosition = positionElement.dataset.position || ''

    // 모달에 선수 목록 채우기
    populateModalPlayerList(currentPosition)

    // 모달 열기
    playerSelectModal.classList.add('active')
})

// 저장 버튼 클릭 이벤트
saveButton.addEventListener('click', function () {
    // 필수 정보 확인
    if (!matchInfo.date || !matchInfo.time || !matchInfo.opponentTeam
        || !matchInfo.location || !matchInfo.address) {
        alert('경기 정보(일시, 상대팀, 장소)를 모두 입력해주세요.')
        return
    }

    const formations = Object.keys(formation.getQuarters()).map(quarter => {
        const formationByQuarter = formation.getQuarter(quarter)
        const formationResult = {
            quarter: quarter,
            formation: formationByQuarter.formation
        }

        formationResult.positions = Object.keys(formationByQuarter.players).map(position => {
            const player = formationByQuarter.players[position]

            return {
                position: position,
                memberId: player.type === 'MEMBER' ? player.id : null,
                guestId: player.type === 'GUEST' ? player.id : null,
                playerType: player.type,
                playerName: player.name
            }
        })

        return formationResult
    })

    const selectedMembers = document.querySelectorAll('.player-card.selected:not(.guest-player)')
    const members = Array.from(selectedMembers).map(el => el.dataset.playerId)

    const selectedGuests = document.querySelectorAll('.player-card.selected.guest-player')
    const guests = Array.from(selectedGuests).map(el => el.dataset.playerId)

    const matchAt = new Date(`${matchInfo.date}T${matchInfo.time}:00`)

    ApiClient.request({
        url: saveModeHandler[saveMode].api.url,
        method: saveModeHandler[saveMode].api.method,
        params: {
            matchAt: matchAt.toISOString().split('.')[0] + 'Z',
            opponentName: matchInfo.opponentTeam,
            location: matchInfo.location,
            address: matchInfo.address,
            longitude: matchInfo.longitude,
            latitude: matchInfo.latitude,
            members,
            guests,
            formations
        },
        onSuccess: (response) => saveModeHandler[saveMode].api.onSuccess(response)
    })
})

// 선수 선택 모달 외부 클릭 시 닫기
playerSelectModal.addEventListener('click', function (e) {
    if (e.target === playerSelectModal) {
        playerSelectModal.classList.remove('active')
    }
})

// 모달 닫기 버튼 클릭 이벤트
closeModalButtons.forEach(button => {
    button.addEventListener('click', function (e)  {
        const modal = e.target.closest('.modal-container')
        modal.classList.remove('active')
        
        // auto-position-modal이 닫힐 때 우선 배정 선수 선택 초기화
        if (modal.id === 'auto-position-modal') {
            fewMatchPlayerIds.clear()
        }
    });
});

// 포지션 자동 배정 버튼 클릭 이벤트
autoPositionButton.addEventListener('click', function () {
    renderPriorityPlayers()
    autoPositionModal.classList.add('active')
})

autoPositionModal.addEventListener('click', function (e) {
    if (e.target === autoPositionModal) {
        autoPositionModal.classList.remove('active')
        fewMatchPlayerIds.clear()
    }
})

// 자동 배정 생성 버튼 클릭 이벤트
generatePositionButton.addEventListener('click', function () {
    if (!memberSettingComplete) {
        ToastMessage.error('잠시 후 다시 시도해 주세요.')
    }

    autoAssignFormation()
    autoPositionModal.classList.remove('active')
})

// 우선 배정 선수 목록 렌더링 함수
function renderPriorityPlayers() {
    priorityPlayers.innerHTML = ''
    
    // 선택된 선수들만 필터링
    const selectedPlayersList = allPlayers.filter(player => selectedPlayers.has(player.id))
    
    // 용병이 아닌 선수들을 우선적으로 정렬
    const sortedPlayers = selectedPlayersList.sort((a, b) => {
        if (a.isGuest && !b.isGuest) return 1
        if (!a.isGuest && b.isGuest) return -1
        return a.number - b.number
    })
    
    sortedPlayers.forEach(player => {
        const playerItem = document.createElement('div')
        playerItem.className = 'priority-player-item'
        playerItem.dataset.playerId = player.id
        
        if (player.isGuest) {
            playerItem.classList.add('guest-player')
        }
        
        // 체크박스 생성
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.id = `priority-${player.id}`
        checkbox.checked = fewMatchPlayerIds.has(player.id)
        
        // 라벨 생성
        const label = document.createElement('label')
        label.htmlFor = `priority-${player.id}`
        label.className = 'priority-player-label'
        label.innerHTML = `
            <span class="player-number">${player.number}</span>
            <span class="player-name">${player.name}</span>
            ${player.isGuest ? '<span class="guest-badge">용병</span>' : ''}
        `
        
        // 체크박스 변경 이벤트
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                fewMatchPlayerIds.add(player.id)
            } else {
                fewMatchPlayerIds.delete(player.id)
            }
        })
        
        playerItem.appendChild(checkbox)
        playerItem.appendChild(label)
        priorityPlayers.appendChild(playerItem)
    })
}

// 선수 목록 렌더링 함수
function renderPlayerList() {
    playerList.innerHTML = ''

    allPlayers.forEach(player => {
        const playerCardNode = CommonUtils.getTemplateNode('player-card-template')
        const playerCard = playerCardNode.querySelector('.player-card')

        if (selectedPlayers.has(player.id)) {
            playerCard.classList.add('selected')
        }

        if (player.isGuest) {
            playerCard.classList.add('guest-player')
        }

        playerCard.dataset.playerId = player.id
        playerCardNode.querySelector('.player-card-number').textContent = player.number
        playerCardNode.querySelector('.player-card-name').textContent = player.name

        // 선수 카드 클릭 이벤트 - 선택/해제 토글
        playerCard.addEventListener('click', function () {
            togglePlayerSelection(player.id)
        })

        playerList.appendChild(playerCard)
    })
}

// 선수 선택/해제 토글 함수
function togglePlayerSelection(playerId) {
    if (selectedPlayers.has(playerId)) {
        const existsPlayer = Object.keys(formation.getQuarters()).some(quarter => {
            return Object.keys(formation.getQuarter(quarter).players).some(position => {
                if (formation.getQuarter(quarter).players[position].id === playerId) {
                    ToastMessage.error('해당 선수가 포지션에 배치되어 있습니다.')
                    return true
                }

                return false
            })
        })

        if (existsPlayer) {
            return
        }

        // 이미 선택된 선수라면 선택 해제
        selectedPlayers.delete(playerId)
    } else {
        // 선택되지 않은 선수라면 선택 추가
        selectedPlayers.add(playerId)
    }

    // 선택된 선수 수 업데이트
    selectedPlayerCount.textContent = selectedPlayers.size

    // 선수 목록 UI 업데이트
    const playerCard = playerList.querySelector(
        `[data-player-id="${playerId}"]`)
    if (playerCard) {
        playerCard.classList.toggle('selected')
    }

    playerQuarterStats.renderTableAndUpdateStats()
}

// 포메이션 렌더링 함수
function renderFormation(formationType) {
    // 기존 필드 내용 초기화 (안내 메시지 유지)
    const fieldElement = document.querySelector('.field')
    const instructionElement = fieldElement.querySelector(
        '.field-instruction-inner')

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

    // 필드에 구성요소 추가 (안내 메시지가 가장 위에 오도록)
    if (!instructionElement) {
        // 안내 메시지가 없는 경우 새로 생성
        const instructionNode = CommonUtils.getTemplateNode('field-instruction-template')
        fieldElement.appendChild(instructionNode)
    }

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
            const player = allPlayers.find(p => p.id === playerId)
            if (player) {
                addPosition(positionElement, player)
            }
        } else {
            removePosition(positionElement)
        }
    })
}

// 선수를 포지션에 배치하는 함수
function assignPlayerToPosition(position, player) {
    // 현재 쿼터의 포메이션 정보에 선수 저장
    formation.setPlayer(
        position,
        {
            id: player.id,
            type: player.isGuest ? 'GUEST' : 'MEMBER',
            name: player.name
        }
    )

    // UI 업데이트
    const positionElement = document.querySelector(
        `.formation-position[data-position="${position}"]`)
    if (positionElement) {
        addPosition(positionElement, player)
    }

    // 통계 업데이트
    playerQuarterStats.updateStats()
}

// 모달에 선수 목록 채우기
function populateModalPlayerList(position) {
    modalPlayerList.innerHTML = ''

    // 선택된 선수들에 대한 목록 생성
    let hasSelectedPlayers = false

    allPlayers.forEach(player => {
        if (selectedPlayers.has(player.id)) {
            hasSelectedPlayers = true

            const playerItem = document.createElement('div')
            playerItem.className = 'modal-player-item'
            playerItem.dataset.playerId = player.id

            // 용병 선수는 표시
            if (player.isGuest) {
                playerItem.classList.add('guest-player-item')
            }

            // 이미 포지션에 할당된 선수인지 확인
            const isAssigned = isPlayerAssignedToAnyPosition(player.id)
            if (isAssigned) {
                playerItem.classList.add('assigned')
            }

            // 내부 요소 생성
            const playerNumber = document.createElement('div')
            playerNumber.className = 'player-number'
            playerNumber.textContent = player.number

            const playerName = document.createElement('div')
            playerName.className = 'player-name'
            playerName.textContent = player.name

            playerItem.appendChild(playerNumber)
            playerItem.appendChild(playerName)

            // 클릭 이벤트 - 선수를 포지션에 할당
            playerItem.addEventListener('click', function () {
                if (!isAssigned || isPlayerAssignedToPosition(player.id,
                    position)) {
                    assignPlayerToPosition(position, player)
                    playerSelectModal.classList.remove('active')
                } else {
                    ToastMessage.error('이미 다른 포지션에 배치된 선수입니다.')
                }
            })

            modalPlayerList.appendChild(playerItem)
        }
    })

    // 선택된 선수가 없을 경우 메시지 표시
    if (!hasSelectedPlayers) {
        const noPlayersMsg = document.createElement('div')
        noPlayersMsg.className = 'no-players-message'
        noPlayersMsg.textContent = '선택된 선수가 없습니다. 먼저 선수를 선택해주세요.'
        modalPlayerList.appendChild(noPlayersMsg)
    }
}

// 선수가 이미 다른 포지션에 할당되어 있는지 확인
function isPlayerAssignedToAnyPosition(playerId) {
    const positionEntries = Object.entries(formation.getPlayers())
    return positionEntries.some(([pos, player]) => player.id && player.id === playerId)
}

// 선수가 특정 포지션에 할당되어 있는지 확인
function isPlayerAssignedToPosition(playerId, position) {
    const assignedPlayer = formation.getPlayer(position)
    return assignedPlayer && assignedPlayer.id === playerId
}

function addPosition(positionElement, player) {
    // 활성화 클래스 추가
    positionElement.classList.add('on')

    const jersey = positionElement.querySelector('.jersey')

    // 빈 포지션 클래스 제거
    jersey.classList.remove('empty-position')

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

function autoAssignFormation() {
    const players = allPlayers.filter(item => selectedPlayers.has(item.id))
    const totalQuarterCount = 4

    // 출전 기록 및 통계 초기화
    const playerStats = new Map(players.map(p => [
        p.id,
        {
            player: p,
            gamesPlayed: 0,
            gamesAssigned: Array(totalQuarterCount).fill(false),
            lastGameIndex: -1,
            isFewMatchPriority: fewMatchPlayerIds.has(p.id) // 우선 배정 여부 추가
        }
    ]))

    // GK 선호 플레이어 미리 필터링
    const goalKeepers = players.filter(p => p.positions.includes('GK'))
    const fieldPlayers = players.filter(p => !p.positions.includes('GK'))

    // 결과 초기화
    const gameAssignments = Array.from({ length: totalQuarterCount }, (_, i) => {
        formation.setCurrentQuarter(i + 1)

        return {
            formation: formation.getLayout(),
            assignments: []
        }
    })

    // 나머지 포지션 채우기
    for (let gameIndex = 0; gameIndex < totalQuarterCount; gameIndex++) {
        const currentFormation = gameAssignments[gameIndex].formation

        for (const pos of currentFormation) {
            if (pos.position === 'GK') {
                continue
            }

            const candidates = fieldPlayers
                .filter(p => !playerStats.get(p.id).gamesAssigned[gameIndex]) // 아직 이 게임에 안 배정됨
                .map(p => {
                    const stat = playerStats.get(p.id);
                    const prefers = p.positions.includes(pos.position)
                    return {
                        ...stat,
                        prefers,
                        isGuest: p.isGuest
                    }
                })

            // 1. 경기 적게 뛴 사람
            // 2. 직전 경기에 안 뛴 사람
            // 3. 적은 경기 원하는 사람
            // 4. 멤버 우선
            // 5. 선호 포지션
            candidates.sort((a, b) => {
                const aStats = playerStats.get(a.player.id)
                const bStats = playerStats.get(b.player.id)

                if (aStats.gamesPlayed !== bStats.gamesPlayed) {
                    return aStats.gamesPlayed - bStats.gamesPlayed
                }

                if (aStats.lastGameIndex !== bStats.lastGameIndex) {
                    return aStats.lastGameIndex - bStats.lastGameIndex
                }

                if (aStats.isFewMatchPriority && !bStats.isFewMatchPriority) {
                    return 1
                }
                if (!aStats.isFewMatchPriority && bStats.isFewMatchPriority) {
                    return -1
                }

                if (a.isGuest && !b.isGuest) {
                    return 1
                }

                if (!a.isGuest && b.isGuest) {
                    return -1
                }

                if (a.prefers && !b.prefers) {
                    return -1
                }

                if (!a.prefers && b.prefers) {
                    return 1
                }

                return Math.random() - 0.5 // 랜덤 요소
            })

            const selected = candidates[0]
            if (selected) {
                gameAssignments[gameIndex].assignments.push({ ...pos, player: selected.player })
                const stat = playerStats.get(selected.player.id)
                stat.gamesPlayed += 1
                stat.gamesAssigned[gameIndex] = true
                stat.lastGameIndex = gameIndex
            }
        }
    }

    // GK 포지션
    for (let gameIndex = 0; gameIndex < totalQuarterCount; gameIndex++) {
        const currentFormation = gameAssignments[gameIndex].formation
        const gkSlot = currentFormation.find(f => f.position === 'GK')
        if (!gkSlot) {
            continue
        }

        goalKeepers.sort((a, b) => {
            const aStats = playerStats.get(a.id)
            const bStats = playerStats.get(b.id)

            // 1. 더 적게 뛴 사람 우선
            if (aStats.gamesPlayed !== bStats.gamesPlayed) {
                return aStats.gamesPlayed - bStats.gamesPlayed
            }

            // 2. 직전 경기 쉰 사람 우선
            return aStats.lastGameIndex - bStats.lastGameIndex
        })

        const gk = goalKeepers.find(p => !playerStats.get(p.id).gamesAssigned[gameIndex])
        if (gk) {
            gameAssignments[gameIndex].assignments.push({ ...gkSlot, player: gk })
            const stat = playerStats.get(gk.id)
            stat.gamesPlayed += 1
            stat.gamesAssigned[gameIndex] = true
            stat.lastGameIndex = gameIndex
        }
    }

    gameAssignments.forEach((gameAssignment, quarterIndex) => {
        formation.setCurrentQuarter(quarterIndex + 1)

        gameAssignment.assignments.forEach((assignment, position) => {
            const player = assignment.player
            formation.setPlayer(
                position,
                {
                    id: player.id,
                    type: player.isGuest ? 'GUEST' : 'MEMBER',
                    name: player.name
                }
            )
        })
    })

    quarterTabs[0].click()

    // 쿼터 수 update
    playerQuarterStats.updateStats()
}

const kakaoMap = {
    map: null,
    markers: [],
    infoWindow: null,
    places: null,
    // 지도 초기화
    initMap() {

        // default: 서울 시청
        const longitude = parseFloat(document.getElementById('map-longitude').value) || 126.9786567
        const latitude = parseFloat(document.getElementById('map-latitude').value) || 37.566826

        // 지도 객체 생성
        const options = {
            center: new kakao.maps.LatLng(latitude, longitude),
            level: 3
        }
        kakaoMap.map = new kakao.maps.Map(mapElement, options)

        // 장소 검색 객체 생성
        kakaoMap.places = new kakao.maps.services.Places()

        // 인포윈도우 객체 생성
        kakaoMap.infoWindow = new kakao.maps.InfoWindow({zIndex: 1})
    },
    // 키워드로 장소 검색
    searchPlaces() {
        const keyword = keywordInput.value

        if (!keyword.trim()) {
            alert('검색어를 입력해주세요')
            return
        }

        // 키워드 검색 실행
        kakaoMap.places.keywordSearch(keyword, kakaoMap.placesSearchCallback)
    },
    // 장소 검색 콜백
    placesSearchCallback(data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {
            // 검색 결과 목록과 마커를 표출
            kakaoMap.displayPlaces(data)
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert('검색 결과가 없습니다.')
        } else if (status === kakao.maps.services.Status.ERROR) {
            alert('검색 중 오류가 발생했습니다.')
        }
    },
    // 장소 표시
    displayPlaces(places) {
        // 이전 마커들 제거
        kakaoMap.removeAllMarkers()

        const bounds = new kakao.maps.LatLngBounds()

        // 검색 결과 목록 생성
        const listEl = document.createElement('div')
        listEl.className = 'place-list'

        // 기존에 결과 목록이 있으면 제거
        const existingList = document.querySelector('.place-list')
        if (existingList) {
            existingList.remove()
        }

        // 마커와 인포윈도우 표시
        for (let i = 0; i < places.length; i++) {
            // 마커 생성
            const position = new kakao.maps.LatLng(places[i].y, places[i].x)
            const marker = kakaoMap.addMarker(position, i)

            // 검색 결과 항목 생성
            const itemEl = kakaoMap.createPlaceItem(i, places[i]);

            // 마커에 클릭 이벤트 추가
            (function (marker, place, item) {
                // 마커 클릭 시
                kakao.maps.event.addListener(marker, 'click', function () {
                    // 인포윈도우에 장소 정보 표시
                    kakaoMap.displayInfoWindow(marker, place)

                    // 선택한 장소 정보 저장
                    kakaoMap.selectPlace(place)
                })

                // 마커에 마우스 오버 시
                kakao.maps.event.addListener(marker, 'mouseover', function () {
                    kakaoMap.displayInfoWindow(marker, place)
                })

                // 마커에 마우스 아웃 시
                kakao.maps.event.addListener(marker, 'mouseout', function () {
                    kakaoMap.infoWindow.close()
                })

                // 목록 아이템 클릭 시
                itemEl.onclick = function () {
                    // 해당 마커를 클릭하여 마커 정보창 표시
                    kakaoMap.map.panTo(position)
                    kakaoMap.displayInfoWindow(marker, place)

                    // 선택한 장소 정보 저장
                    kakaoMap.selectPlace(place)

                    // 선택된 항목 스타일 적용
                    const selected = document.querySelector(
                        '.place-item.selected')
                    if (selected) {
                        selected.classList.remove('selected')
                    }
                    this.classList.add('selected')
                }
            })(marker, places[i], itemEl);

            listEl.appendChild(itemEl)
            bounds.extend(position)
        }

        // 검색 결과 목록을 지도 아래에 추가
        mapContainer.appendChild(listEl)

        // 검색된 장소 위치를 기준으로 지도 범위 재설정
        kakaoMap.map.setBounds(bounds)
    },
    // 검색 결과 항목 생성
    createPlaceItem(index, place) {
        const item = CommonUtils.getTemplateNode('place-item-template')

        item.querySelector('.place-marker').textContent = index + 1
        item.querySelector('.place-name').textContent = place.place_name
        item.querySelector('.place-category').textContent = place.category_name
        item.querySelector('.place-address').textContent = place.address_name

        const roadEl = item.querySelector('.place-road-address')
        if (place.road_address_name) {
            roadEl.textContent = place.road_address_name
            roadEl.style.display = 'block'
        }

        const phoneEl = item.querySelector('.place-phone')
        if (place.phone) {
            phoneEl.textContent = place.phone
            phoneEl.style.display = 'block'
        }

        // 버튼 클릭 이벤트 바인딩
        item.querySelector('.select-place-btn').addEventListener('click',
            function (e) {
                e.stopPropagation()
                kakaoMap.selectPlace(place)
            })

        return item
    },
    // 마커 생성 함수
    addMarker(position, idx) {
        const imageSrc = '/images/marker_number_blue.png'
        const imageSize = new kakao.maps.Size(36, 37)  // 마커 이미지의 크기
        const imgOptions = {
            spriteSize: new kakao.maps.Size(36, 691),    // 스프라이트 이미지의 크기
            spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10),    // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(13, 37)    // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        }
        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize,
            imgOptions)
        const marker = new kakao.maps.Marker({
            position: position,
            image: markerImage
        })

        marker.setMap(kakaoMap.map)
        kakaoMap.markers.push(marker)

        return marker
    },
    // 모든 마커 제거
    removeAllMarkers() {
        for (let i = 0; i < kakaoMap.markers.length; i++) {
            kakaoMap.markers[i].setMap(null)
        }
        kakaoMap.markers = []
    },
    // 인포 윈도우 표시
    displayInfoWindow(marker, place) {
        const content = CommonUtils.getTemplateNode('place-info-window-template')

        content.querySelector('.place-info-name').textContent = place.place_name
        content.querySelector(
            '.place-info-address').textContent = place.address_name

        kakaoMap.infoWindow.setContent(content)
        kakaoMap.infoWindow.open(kakaoMap.map, marker)
    },
    // 장소 선택
    selectPlace(place) {
        // 선택한 장소 정보 저장
        matchLocationInput.value = place.place_name
        matchAddressInput.value = place.address_name
        matchInfo.location = place.place_name
        matchInfo.address = place.address_name
        matchInfo.longitude = place.x
        matchInfo.latitude = place.y

        // 주소 선택 효과 추가
        matchLocationInput.classList.add('address-selected')
        matchAddressInput.classList.add('address-selected')

        // 지도 숨기기
        mapContainer.style.display = 'none'

        // 선택 확인 메시지 표시
        ToastMessage.success('장소가 성공적으로 선택되었습니다.')
    }
}

const guestPlayer = {
    initEvents() {
        // 용병 추가 버튼 클릭 시 모달 열기
        addGuestPlayerButton.addEventListener('click', function () {
            guestPlayerModal.classList.add('active')

            // 모달 입력 필드 초기화
            guestPlayerNameInput.value = ''
        })

        // 용병 추가 버튼 클릭 시
        addGuestSubmitButton.addEventListener('click', function () {
            guestPlayer.addPlayer()
        })

        // 엔터 키로 용병 추가 가능하게
        guestPlayerNameInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                guestPlayer.addPlayer()
            }
        })

        guestPlayerModal.addEventListener('click', function (e) {
            if (e.target === guestPlayerModal) {
                guestPlayerModal.classList.remove('active')
            }
        })
    },
    addPlayer() {
        const name = guestPlayerNameInput.value.trim()

        // 유효성 검사
        if (!name) {
            alert('용병 이름을 입력해주세요.')
            return
        }

        ApiClient.request({
            url: '/v1/guests',
            method: 'POST',
            params: { name },
            onSuccess: (response) => {
                // 새 용병 선수 객체 생성
                const newGuestPlayer = {
                    id: response.id,
                    name: name,
                    number: 0,
                    positions: [],
                    isGuest: true
                }

                // 용병 배열에 추가
                guestPlayers.push(newGuestPlayer)

                // 전체 선수 목록에 추가
                allPlayers.push(newGuestPlayer)

                // 자동으로 선택 처리
                selectedPlayers.add(newGuestPlayer.id)

                // 선택된 선수 수 업데이트
                selectedPlayerCount.textContent = selectedPlayers.size
                totalPlayerCount.textContent = allPlayers.length

                // 선수 목록 다시 렌더링
                renderPlayerList()

                // 모달 닫기
                guestPlayerModal.classList.remove('active')

                // 쿼터 상태 테이블 변경
                playerQuarterStats.renderTableAndUpdateStats()
            }
        })
    }
}

// 선수별 쿼터 참여 현황 관리
const playerQuarterStats = {
    // DOM 요소 참조
    toggleButton: document.getElementById('toggle-stats-view'),
    statsTable: document.getElementById('player-quarter-table'),
    totalQuarters: document.getElementById('total-quarters'),
    avgQuarters: document.getElementById('avg-quarters'),
    maxQuarters: document.getElementById('max-quarters'),
    minQuarters: document.getElementById('min-quarters'),

    init() {
        this.initEvents()
        this.renderTableAndUpdateStats()
    },

    initEvents() {
        // 상세보기 토글 버튼 이벤트
        this.toggleButton.addEventListener('click', () => {
            this.toggleStatsView()
        })
    },

    // 통계 뷰 토글
    toggleStatsView() {
        const isExpanded = this.statsTable.classList.contains('expanded')
        
        if (isExpanded) {
            this.statsTable.classList.remove('expanded')
            this.toggleButton.textContent = '상세보기'
            this.toggleButton.classList.remove('expanded')
        } else {
            this.statsTable.classList.add('expanded')
            this.toggleButton.textContent = '접기'
            this.toggleButton.classList.add('expanded')
        }
    },

    renderTableAndUpdateStats() {
        this.renderTable()
        this.updateStats()
    },

    // 통계 업데이트
    updateStats() {
        const counts = formation.getQuarterCounts()

        this.totalQuarters.textContent = counts.total
        this.avgQuarters.textContent = counts.total > 0 ? parseFloat((counts.total / selectedPlayers.size).toFixed(1)) : 0
        this.maxQuarters.textContent = counts.max
        this.minQuarters.textContent = counts.min


        document.querySelectorAll('.quarter-cell').forEach(quarterCell => {
            quarterCell.textContent = '-'
            quarterCell.classList.remove('participating')
        })

        document.querySelectorAll('.total-quarters-cell').forEach(quarterCell => {
            quarterCell.textContent = 0
        })

        Object.keys(counts.players).forEach(id => {
            const playerRow = document.querySelector(`[data-id="${id}"]`)
            const quarterCells = playerRow.querySelectorAll('.quarter-cell')
            playerRow.querySelector('.total-quarters-cell').textContent = counts.players[id].total

            counts.players[id].quarters.forEach(quarter => {
                quarterCells[quarter - 1].textContent = '참여'
                quarterCells[quarter - 1].classList.add('participating')
            })
        })
    },

    // 쿼터 테이블 렌더링
    renderTable() {
        const body = document.getElementById('player-quarter-body')
        body.innerHTML = ''

        // 선택된 선수 목록
        const players = Array.from(selectedPlayers)
            .map(id =>
                allPlayers.find(player => player.id === id)
            )
            .filter(Boolean)
            .sort((a, b) => {
                if (a.isGuest && !b.isGuest) {
                    return 1
                }

                if (!a.isGuest && b.isGuest) {
                    return -1
                }

                return a.number - b.number
            })

        // 각 선수별 행 생성
        players.forEach(player => {
            const row = this.createPlayerQuarterRow(player)
            body.appendChild(row)
        })
    },

    // 선수별 쿼터 행 생성
    createPlayerQuarterRow(player) {
        const row = document.createElement('div')
        row.className = 'quarter-table-row'
        row.dataset.id = player.id
        if (player.isGuest) {
            row.classList.add('guest-player')
        }

        // 선수 정보 셀
        const playerInfoCell = document.createElement('div')
        playerInfoCell.className = 'player-info-cell'
        playerInfoCell.innerHTML = `
            <div class="player-number-cell">${player.number}</div>
            <div class="player-name-cell">${player.name}</div>
        `
        row.appendChild(playerInfoCell)

        // 각 쿼터별 참여 여부 확인
        for (let quarter = 1; quarter <= 4; quarter++) {
            const quarterCell = document.createElement('div')
            quarterCell.className = 'quarter-cell'
            quarterCell.textContent = '-'

            // 쿼터 셀 클릭 이벤트 (포지션 배정으로 이동)
            quarterCell.addEventListener('click', () => {
                this.navigateToQuarter(quarter, player)
            })

            row.appendChild(quarterCell)
        }

        // 총 쿼터 수 셀
        const totalCell = document.createElement('div')
        totalCell.className = 'total-quarters-cell'
        totalCell.textContent = 0
        row.appendChild(totalCell)

        return row
    },

    // 특정 쿼터로 이동
    navigateToQuarter(quarter, player) {
        // 해당 쿼터 탭 활성화
        quarterTabs.forEach(tab => tab.classList.remove('active'))
        const targetTab = document.querySelector(`[data-quarter="${quarter}"]`)
        if (targetTab) {
            targetTab.classList.add('active')
        }

        // 해당 쿼터의 포메이션으로 설정
        formation.setCurrentQuarter(quarter)
        renderFormation(formation.getFormation())

        // 해당 선수가 배정된 포지션 하이라이트
        this.highlightPlayerPositions(player.id, quarter)

        // 축구장 영역으로 스크롤
        document.querySelector('.field-wrapper').scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        })
    },

    // 선수 포지션 하이라이트
    highlightPlayerPositions(playerId, quarter) {
        // 기존 하이라이트 제거
        document.querySelectorAll('.jersey.highlighted').forEach(el => {
            el.classList.remove('highlighted')
        })

        // 해당 선수가 배정된 포지션들 하이라이트
        formation.setCurrentQuarter(quarter)
        const currentFormation = formation.getFormation()
        
        Object.entries(currentFormation).forEach(([position, player]) => {
            if (player && player.id === playerId) {
                const positionElement = document.querySelector(`[data-position="${position}"] .jersey`)
                if (positionElement) {
                    positionElement.classList.add('highlighted')
                }
            }
        })
    }
}