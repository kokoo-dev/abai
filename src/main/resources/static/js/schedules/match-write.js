// DOM 요소 참조
const formationSelect = document.getElementById('formation-select');
const quarterTabs = document.querySelectorAll('.quarter-tab');
const saveBtn = document.querySelector('.save-btn');
const fieldElement = document.querySelector('.field');

// 경기 정보 입력 요소 참조
const matchDateInput = document.getElementById('match-date');
const matchTimeInput = document.getElementById('match-time');
const opponentTeamInput = document.getElementById('opponent-team');
const matchLocationInput = document.getElementById('match-location');

// 주소 검색 관련 DOM 요소 참조
const searchLocationBtn = document.getElementById('search-location');
const addressSearchContainer = document.getElementById('address-search-container');

// 전역 변수
let currentQuarter = 1;
let formations = {
    // 각 쿼터별 포메이션 데이터를 저장
    1: { formation: '433', players: {} },
    2: { formation: '433', players: {} },
    3: { formation: '433', players: {} },
    4: { formation: '433', players: {} }
};

// 경기 정보
let matchInfo = {
    date: '',
    time: '',
    opponentTeam: '',
    location: '',
    address: ''
};

// 포메이션별 포지션 정보
const formationLayouts = {
    '433': [
        // 공격수 포지션 (3명)
        { row: 1, col: 1 },
        { row: 1, col: 2 },
        { row: 1, col: 3 },
        // 미드필더 포지션 (3명)
        { row: 2, col: 1 },
        { row: 2, col: 2 },
        { row: 2, col: 3 },
        // 수비수 포지션 (4명)
        { row: 3, col: 1 },
        { row: 3, col: 2 },
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        { row: 4, col: 1 }
    ],
    '442': [
        // 공격수 포지션 (2명)
        { row: 1, col: 1 },
        { row: 1, col: 2 },
        // 미드필더 포지션 (4명)
        { row: 2, col: 1 },
        { row: 2, col: 2 },
        { row: 2, col: 3 },
        { row: 2, col: 4 },
        // 수비수 포지션 (4명)
        { row: 3, col: 1 },
        { row: 3, col: 2 },
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        { row: 4, col: 1 }
    ],
    '4411': [
        // 공격수 포지션 (1명)
        { row: 1, col: 1 },
        // 공격형 미드필더 포지션 (1명)
        { row: 2, col: 2 },
        // 미드필더 포지션 (4명)
        { row: 3, col: 1 },
        { row: 3, col: 2 },
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        // 수비수 포지션 (4명)
        { row: 4, col: 1 },
        { row: 4, col: 2 },
        { row: 4, col: 3 },
        { row: 4, col: 4 },
        { row: 5, col: 1 }
    ],
    '352': [
        // 공격수 포지션 (2명)
        { row: 1, col: 1 },
        { row: 1, col: 2 },
        // 미드필더 포지션 (5명)
        { row: 2, col: 1 },
        { row: 2, col: 2 },
        { row: 2, col: 3 },
        { row: 2, col: 4 },
        { row: 2, col: 5 },
        // 수비수 포지션 (3명)
        { row: 3, col: 1 },
        { row: 3, col: 2 },
        { row: 3, col: 3 },
        { row: 4, col: 1 }
    ],
    '532': [
        // 공격수 포지션 (2명)
        { row: 1, col: 1 },
        { row: 1, col: 2 },
        // 미드필더 포지션 (3명)
        { row: 2, col: 1 },
        { row: 2, col: 2 },
        { row: 2, col: 3 },
        // 수비수 포지션 (5명)
        { row: 3, col: 1 },
        { row: 3, col: 2 },
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 4, col: 1 }
    ],
    '343': [
        // 공격수 포지션 (3명)
        { row: 1, col: 1 },
        { row: 1, col: 2 },
        { row: 1, col: 3 },
        // 미드필더 포지션 (4명)
        { row: 2, col: 1 },
        { row: 2, col: 2 },
        { row: 2, col: 3 },
        { row: 2, col: 4 },
        // 수비수 포지션 (3명)
        { row: 3, col: 1 },
        { row: 3, col: 2 },
        { row: 3, col: 3 },
        { row: 4, col: 1 }
    ]
};

// DOM 요소 참조 (추가)
const playerSelectModal = document.getElementById('player-select-modal');
const modalPlayerList = document.querySelector('.modal-player-list');
const closeModalBtn = document.querySelector('.close-modal');

// 전역 변수 (추가)
let currentPosition = null; // 현재 선택된 포지션
let allPlayers = []; // 모든 선수 데이터

// 포메이션 변경 시 이벤트 처리
formationSelect.addEventListener('change', function() {
    const selectedFormation = this.value;
    formations[currentQuarter].formation = selectedFormation;
    
    renderFormation(selectedFormation);
});

// 쿼터 탭 클릭 이벤트 처리
quarterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        const quarter = parseInt(this.dataset.quarter);
        
        // 현재 활성화된 탭 변경
        document.querySelector('.quarter-tab.active').classList.remove('active');
        this.classList.add('active');
        
        // 쿼터 데이터 적용
        currentQuarter = quarter;
        
        // 현재 쿼터의 포메이션 정보 불러오기
        const currentFormation = formations[currentQuarter].formation;
        formationSelect.value = currentFormation;
        
        // 포메이션 렌더링
        renderFormation(currentFormation);
        
        // 저장된 선수 포지션 정보 적용
        applyPlayerPositions();
    });
});

// 경기 정보 입력 필드 이벤트 처리
matchDateInput.addEventListener('change', function() {
    matchInfo.date = this.value;
});

matchTimeInput.addEventListener('change', function() {
    matchInfo.time = this.value;
});

opponentTeamInput.addEventListener('input', function() {
    matchInfo.opponentTeam = this.value;
});

// 주소 검색 관련 이벤트 처리
// 주소 검색 버튼 클릭 시
searchLocationBtn.addEventListener('click', function() {
    searchAddress()
});

// 필드 전체에 대한 클릭 이벤트 처리 (모달 사용 방식으로 변경)
fieldElement.addEventListener('click', function(e) {
    const positionElement = e.target.closest('.formation-position');
    if (!positionElement) return;
    
    // 현재 포지션 저장
    currentPosition = positionElement.dataset.position || '';
    
    // 모달에 선수 목록 채우기
    populateModalPlayerList(currentPosition);
    
    // 모달 열기
    playerSelectModal.classList.add('active');
});

// 저장 버튼 클릭 이벤트
saveBtn.addEventListener('click', function() {
    // 필수 정보 확인
    if (!matchInfo.date || !matchInfo.time || !matchInfo.opponentTeam || !matchInfo.location) {
        alert('경기 정보(일시, 상대팀, 장소)를 모두 입력해주세요.');
        return;
    }
    
    // 경기 정보와 포메이션 정보를 함께 저장
    const matchData = {
        info: matchInfo,
        formations: formations
    };
    
    // 서버에 저장하는 API 호출 (향후 구현)
    console.log('경기 데이터 저장:', matchData);
    alert('경기 정보가 저장되었습니다.');
    
    // 저장 후 경기 목록 페이지로 이동
    // window.location.href = '/matches';
});

// 포메이션 렌더링 함수
function renderFormation(formationType) {
    // 기존 필드 내용 초기화 (안내 메시지 유지)
    const fieldElement = document.querySelector('.field');
    const instructionElement = fieldElement.querySelector('.field-instruction-inner');
    
    // 기존 positions-container만 제거
    const oldPositionsContainer = fieldElement.querySelector('.positions-container');
    if (oldPositionsContainer) {
        oldPositionsContainer.remove();
    }
    
    // 골키퍼 영역 제거
    const oldGoalkeeperArea = fieldElement.querySelector('.goalkeeper-area');
    if (oldGoalkeeperArea) {
        oldGoalkeeperArea.remove();
    }
    
    // 포지션 컨테이너 생성
    const positionsContainer = document.createElement('div');
    positionsContainer.className = 'positions-container';
    positionsContainer.style.marginTop = '35px'; // 인라인 스타일로 마진 추가
    
    // 선택된 포메이션 레이아웃 가져오기
    const layout = formationLayouts[formationType];
    
    // 포지션을 행별로 그룹화
    const positionsByRow = {};
    layout.forEach(pos => {
        if (!positionsByRow[pos.row]) {
            positionsByRow[pos.row] = [];
        }
        positionsByRow[pos.row].push(pos);
    });
    
    // 행 개수 확인
    const rowCount = Object.keys(positionsByRow).length;
    
    // 5행인 경우 특별 클래스 추가
    if (rowCount >= 5) {
        positionsContainer.classList.add('rows-5');
    } else if (rowCount === 4) {
        positionsContainer.classList.add('rows-4');
    } else if (rowCount === 3) {
        positionsContainer.classList.add('rows-3');
    }
    
    // 각 행에 대해 포지션 요소 생성
    Object.keys(positionsByRow)
        .sort((a, b) => a - b) // 행 번호 순으로 정렬
        .forEach(row => {
            const rowPositions = positionsByRow[row];
            const playerCount = rowPositions.length; // 해당 행의 선수 수
            
            // 행 컨테이너 생성
            const rowElement = document.createElement('div');
            rowElement.className = `formation-row formation-row-${row}`;
            rowElement.dataset.players = playerCount; // 선수 수 데이터 속성 추가
            
            // 행의 포지션 요소 생성
            rowPositions.forEach(pos => {
                const positionElement = document.createElement('div');
                positionElement.className = 'formation-position';
                positionElement.dataset.position = `pos_${layout.indexOf(pos)}`;
                
                const jersey = document.createElement('div');
                jersey.className = 'jersey empty-position';
                
                positionElement.appendChild(jersey);
                rowElement.appendChild(positionElement);
            });
            
            positionsContainer.appendChild(rowElement);
        });
    
    // 필드에 구성요소 추가 (안내 메시지가 가장 위에 오도록)
    if (!instructionElement) {
        // 안내 메시지가 없는 경우 새로 생성
        const newInstructionElement = document.createElement('div');
        newInstructionElement.className = 'field-instruction-inner';
        
        const instructionText = document.createElement('p');
        instructionText.textContent = '포지션을 터치하여 선수를 선택하세요';
        
        newInstructionElement.appendChild(instructionText);
        fieldElement.appendChild(newInstructionElement);
    }
    
    // 포지션 컨테이너 추가
    fieldElement.appendChild(positionsContainer);
    
    // 저장된 선수 포지션 정보 적용
    applyPlayerPositions();
}

// 선수를 포지션에 배치하는 함수
function assignPlayerToPosition(position, player) {
    // 현재 쿼터의 포메이션 정보에 선수 저장
    formations[currentQuarter].players[position] = player;
    
    // UI 업데이트
    const positionElement = document.querySelector(`.formation-position[data-position="${position}"]`);
    if (positionElement) {
        // 이전에 이름 표시 요소가 있다면 제거
        const oldNameDisplay = positionElement.querySelector('.player-name-display');
        if (oldNameDisplay) {
            oldNameDisplay.remove();
        }
        
        const jersey = positionElement.querySelector('.jersey');
        
        // 비어있는 상태 클래스 제거
        jersey.classList.remove('empty-position');
        
        // 내용 초기화
        jersey.innerHTML = '';
        
        // 선수 번호 추가 - 중앙에 배치
        const numberElement = document.createElement('div');
        numberElement.className = 'player-number';
        numberElement.textContent = player.number;
        jersey.appendChild(numberElement);
        
        // 선수 이름 추가 - 유니폼 아래쪽에 배치
        const nameElement = document.createElement('div');
        nameElement.className = 'player-name-display';
        nameElement.textContent = player.name;
        
        // 이름은 positionElement 내부에 직접 추가 (유니폼 외부)
        positionElement.appendChild(nameElement);
        
        // 골키퍼 포지션의 경우 추가 스타일링
        if (position === 'gk') {
            if (positionElement.closest('.gk-position')) {
                jersey.classList.add('gk-jersey');
            }
        }
    }
}

// 저장된 선수 포지션 정보 적용하는 함수
function applyPlayerPositions() {
    // 모든 포지션을 빈 상태로 초기화
    document.querySelectorAll('.formation-position, .gk-position').forEach(posElement => {
        const jersey = posElement.querySelector('.jersey');
        if (jersey) {
            // 기본 클래스 설정
            if (posElement.classList.contains('gk-position')) {
                jersey.className = 'jersey gk-jersey empty-position';
            } else {
                jersey.className = 'jersey empty-position';
            }
            
            // 내용 초기화
            jersey.innerHTML = '';
        }
        
        // 이름 표시 제거
        const nameDisplay = posElement.querySelector('.player-name-display');
        if (nameDisplay) {
            nameDisplay.remove();
        }
    });
    
    // 현재 쿼터에 저장된 선수 정보 적용
    const currentPlayers = formations[currentQuarter].players;
    for (const position in currentPlayers) {
        assignPlayerToPosition(position, currentPlayers[position]);
    }
}

// 초기화 시 선수 데이터 수집
document.addEventListener('DOMContentLoaded', function() {
    // 모든 탭의 active 클래스 제거
    document.querySelectorAll('.tab-container .tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // 일정 탭 활성화
    document.querySelector('.tab-container .tab[href="/schedules"]').classList.add('active');

    // 기본 선수 데이터 설정
    allPlayers = [
        { id: '1', number: '1', name: '김골키퍼', position: 'GK' },
        { id: '2', number: '5', name: '박수비', position: 'DF' },
        { id: '3', number: '6', name: '정센터백', position: 'DF' },
        { id: '4', number: '3', name: '이왼쪽', position: 'DF' },
        { id: '5', number: '2', name: '한오른쪽', position: 'DF' },
        { id: '6', number: '8', name: '최미드필더', position: 'MF' },
        { id: '7', number: '6', name: '오수비형', position: 'MF' },
        { id: '8', number: '10', name: '윤공격형', position: 'MF' },
        { id: '9', number: '7', name: '서왼쪽윙', position: 'FW' },
        { id: '10', number: '9', name: '김스트라이커', position: 'FW' },
        { id: '11', number: '11', name: '강오른쪽윙', position: 'FW' },
        { id: '12', number: '14', name: '황공격수', position: 'FW' }
    ];
    
    // 초기 경기 정보 설정
    // 초기 경기 정보 폼에 오늘 날짜 설정
    const today = new Date();
    matchDateInput.value = today.toISOString().split('T')[0];
    matchInfo.date = matchDateInput.value;

    // 초기 시간 설정 (19:00)
    matchTimeInput.value = '19:00';
    matchInfo.time = matchTimeInput.value;

    // 초기 포메이션 렌더링
    const initialFormation = formationSelect.value;
    renderFormation(initialFormation);
});

// 모달 닫기 버튼 이벤트
closeModalBtn.addEventListener('click', function() {
    playerSelectModal.classList.remove('active');
});

// 모달 외부 클릭 시 닫기
playerSelectModal.addEventListener('click', function(e) {
    if (e.target === playerSelectModal) {
        playerSelectModal.classList.remove('active');
    }
});

// 모달에 선수 목록 채우기
function populateModalPlayerList(position) {
    modalPlayerList.innerHTML = '';
    
    // 현재 배치된 선수 제외 또는 표시하기
    const currentPlayers = Object.values(formations[currentQuarter].players)
        .map(player => player.id);
    
    allPlayers.forEach(player => {
        const isAssigned = currentPlayers.includes(player.id);
        const playerItem = document.createElement('div');
        playerItem.className = `modal-player-item ${isAssigned ? 'assigned' : ''}`;
        playerItem.dataset.playerId = player.id;
        
        // 이미 배치된 선수는 표시
        const assignedInfo = isAssigned ? ' (배치됨)' : '';
        
        playerItem.innerHTML = `
            <div class="player-number">${player.number}</div>
            <div class="player-info">
                <div class="player-name">${player.name}${assignedInfo}</div>
                <div class="player-position">${player.position}</div>
            </div>
        `;
        
        // 모달에서 선수 선택 시 이벤트
        playerItem.addEventListener('click', function() {
            // 선수 정보로 포지션 배치
            assignPlayerToPosition(currentPosition, {
                id: player.id,
                number: player.number,
                name: player.name
            });
            
            // 모달 닫기
            playerSelectModal.classList.remove('active');
        });
        
        modalPlayerList.appendChild(playerItem);
    });
}

// 카카오 주소 검색 API 초기화 및 실행
function searchAddress() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 선택한 주소 정보를 가져와서 입력 필드에 설정
            let addr = '';
            let extraAddr = '';

            // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져옴
            if (data.userSelectedType === 'R') { // 도로명 주소 선택
                addr = data.roadAddress;
            } else { // 지번 주소 선택
                addr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일 때 참고항목을 조합
            if(data.userSelectedType === 'R'){
                // 법정동명이 있을 경우 추가
                if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가
                if(data.buildingName !== '' && data.apartment === 'Y'){
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열 생성
                if(extraAddr !== ''){
                    extraAddr = ' (' + extraAddr + ')';
                }
            }

            // 선택한 주소를 입력 필드에 값으로 설정
            matchLocationInput.value = addr;
            matchInfo.location = addr;
            matchInfo.address = addr;
            
            // 주소 선택 효과 추가
            matchLocationInput.classList.add('address-selected');
            
            // 주소 검색 컨테이너 숨기기
            addressSearchContainer.style.display = 'none';
            
            // 선택 확인 메시지 표시 (선택적)
            showAddressSelectionMessage();
        }
    }).open();
}

// 주소 선택 후 확인 메시지 표시 함수
function showAddressSelectionMessage() {
    // 기존 메시지가 있으면 제거
    const existingMessage = document.querySelector('.address-selection-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 메시지 요소 생성
    const messageElement = document.createElement('div');
    messageElement.className = 'address-selection-message';
    messageElement.textContent = '주소가 성공적으로 선택되었습니다.';
    
    // 메시지 추가
    const locationGroup = document.querySelector('.location-group');
    locationGroup.appendChild(messageElement);
    
    // 3초 후 메시지 사라지게 함
    setTimeout(() => {
        messageElement.classList.add('fade-out');
        setTimeout(() => {
            messageElement.remove();
        }, 500);
    }, 3000);
} 