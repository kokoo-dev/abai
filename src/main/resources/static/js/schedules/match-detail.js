import {Formation} from "./Formation.js"
import ApiClient from "../common/ApiClient.js"
import ToastMessage from "../common/ToastMessage.js"

// 탭 전환 기능
const tabButtons = document.querySelectorAll('.tab-btn')
const tabContents = document.querySelectorAll('.tab-content')

// 주소
const copyAddressButton = document.querySelector('.copy-address-btn')

let formation = null
const memberPlayers = []
const guestPlayers = []

document.addEventListener('DOMContentLoaded', function () {
    // 초기 데이터 로드
    match.getMembers((response) => {
        response.forEach(it => {
            memberPlayers.push({
                id: it.member.id,
                name: it.member.name,
                number: it.member.uniformNumber,
                position: it.member.preferredPosition,
                isGuest: false
            })
        })

        match.getFormations()
    })
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

// 편집 버튼 이벤트
const editButton = document.querySelector('.edit-btn')
if (editButton) {
    editButton.addEventListener('click', function () {
        // window.location.href = `/match-write?id=${matchId}`
    })
}

// 삭제 버튼 이벤트
const deleteButton = document.querySelector('.delete-btn')
if (deleteButton) {
    deleteButton.addEventListener('click', function () {
        if (confirm('정말로 이 경기 기록을 삭제하시겠습니까?')) {
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
            window.location.href = '/matches'
        }
    })
}

const match = {
    id: document.getElementById('match-id').value,
    getMembers(onSuccess = () => {}) {
        ApiClient.request({
            url: `/v1/matches/${match.id}/members`,
            method: 'GET',
            onSuccess: (response) => onSuccess(response)
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
                    // TODO 선수 목록 먼저 불러와서 등번호 입력하기
                    // formation.setPlayer()
                })
            }
        })
    }
}