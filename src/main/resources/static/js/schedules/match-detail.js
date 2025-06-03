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

let formation = null
const memberPlayers = []
const guestPlayers = []

document.addEventListener('DOMContentLoaded', function () {
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

// 편집 버튼 이벤트
const editButton = document.querySelector('.edit-btn')
if (editButton) {
    editButton.addEventListener('click', function () {
        CommonUtils.postToUrl(`/schedules/matches/${match.id}`)
    })
}

// 삭제 버튼 이벤트
const deleteButton = document.querySelector('.delete-btn')
if (deleteButton) {
    deleteButton.addEventListener('click', function () {
        if (!confirm('정말로 이 경기 기록을 삭제하시겠습니까?')) {
            return
        }

        match.delete()
    })
}

// 포메이션 렌더링 함수
function renderFormation(formationType) {
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
    const layout = formation.getLayouts()[formationType]

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
    getMembersAndGuests() {
        Promise.all([
            new Promise((resolve, reject) => { match.getMembers(resolve, reject) }),
            new Promise((resolve, reject) => { match.getGuests(resolve, reject) })
        ]).then(([memberResponse, guestResponse]) => {
            memberResponse.forEach(it => {
                memberPlayers.push({
                    id: it.member.id,
                    name: it.member.name,
                    number: it.member.uniformNumber,
                    position: it.member.preferredPosition,
                    isGuest: false
                })

                addRecord(it.member.name, it.goalsFor, it.assist)
            })

            guestResponse.forEach(it => {
                guestPlayers.push({
                    id: it.guest.id,
                    name: it.guest.name,
                    number: 0,
                    position: 'MF',
                    isGuest: true
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
                formation = new Formation({
                    formations: response.map(response => response.formation),
                    isInitFormation: true
                })

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
            }
        })
    }
}