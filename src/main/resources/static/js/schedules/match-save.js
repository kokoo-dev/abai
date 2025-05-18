import { Formation } from "./Formation.js";

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
const matchAddressInput = document.getElementById('match-address');

// 주소 검색 관련 DOM 요소 참조
const searchLocationBtn = document.getElementById('search-location');
const mapContainer = document.getElementById('map-container');
const mapElement = document.getElementById('map');
const keywordInput = document.getElementById('keyword');
const searchKeywordBtn = document.getElementById('search-keyword');

// 선수 선택 관련 DOM 요소 참조
const playerList = document.getElementById('player-list');
const selectedPlayerCount = document.getElementById('selected-player-count');
const totalPlayerCount = document.getElementById('total-player-count');

// 용병 추가 관련 DOM 요소 참조
const addGuestPlayerBtn = document.getElementById('add-guest-player');
const guestPlayerModal = document.getElementById('guest-player-modal');
const guestPlayerNameInput = document.getElementById('guest-player-name');
const guestPlayerNumberInput = document.getElementById('guest-player-number');
const addGuestSubmitBtn = document.getElementById('add-guest-player-btn');
const guestModalCloseBtn = guestPlayerModal.querySelector('.close-modal');

// 카카오맵 관련 전역 변수
let map = null;
let markers = [];
let infoWindow = null;
let ps = null;

// 포메이션
const formation = new Formation({ formations: Array.from(formationSelect.options).map(option => option.value) })

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
    address: '',
    latitude: '',
    longitude: ''
};

// DOM 요소 참조 (추가)
const playerSelectModal = document.getElementById('player-select-modal');
const modalPlayerList = document.querySelector('.modal-player-list');
const closeModalBtn = document.querySelector('.close-modal');

// 전역 변수 (추가)
let currentPosition = null; // 현재 선택된 포지션
let allPlayers = []; // 모든 선수 데이터
let selectedPlayers = new Set(); // 출전 선수 ID 집합
let guestPlayerIdCounter = 1000; // 용병 ID 카운터 (기존 선수 ID와 겹치지 않게 1000부터 시작)
let guestPlayers = []; // 용병 선수 배열

// 더미 선수 데이터 (실제로는 API에서 가져와야 함)
const dummyPlayers = [
    { id: 1, number: 1, name: '김민수', position: 'GK' },
    { id: 2, number: 2, name: '이지훈', position: 'DF' },
    { id: 3, number: 3, name: '박상현', position: 'DF' },
    { id: 4, number: 4, name: '최영호', position: 'DF' },
    { id: 5, number: 5, name: '정민우', position: 'DF' },
    { id: 6, number: 6, name: '강대현', position: 'MF' },
    { id: 7, number: 7, name: '손흥민', position: 'MF' },
    { id: 8, number: 8, name: '황인범', position: 'MF' },
    { id: 9, number: 9, name: '황희찬', position: 'FW' },
    { id: 10, number: 10, name: '이강인', position: 'FW' },
    { id: 11, number: 11, name: '조규성', position: 'FW' },
    { id: 12, number: 12, name: '김승규', position: 'GK' },
    { id: 13, number: 13, name: '송범근', position: 'GK' },
    { id: 14, number: 14, name: '김문환', position: 'DF' },
    { id: 15, number: 15, name: '김진수', position: 'DF' },
    { id: 16, number: 16, name: '이재성', position: 'MF' },
    { id: 17, number: 17, name: '정우영', position: 'MF' },
    { id: 18, number: 18, name: '백승호', position: 'MF' },
    { id: 19, number: 19, name: '오현규', position: 'FW' },
    { id: 20, number: 20, name: '오세훈', position: 'FW' },
];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 포메이션 렌더링
    renderFormation(formationSelect.value);
    
    // 선수 데이터 로드 (실제로는 API에서 가져와야 함)
    loadPlayers();

    // 용병 모달 관련 이벤트 리스너 등록
    initGuestPlayerEvents();
});

// 용병 모달 관련 이벤트 리스너 초기화
function initGuestPlayerEvents() {
    // 용병 추가 버튼 클릭 시 모달 열기
    addGuestPlayerBtn.addEventListener('click', function() {
        guestPlayerModal.classList.add('active');
        
        // 모달 입력 필드 초기화
        guestPlayerNameInput.value = '';
        guestPlayerNumberInput.value = '';
    });

    // 모달 닫기 버튼 클릭 시
    guestModalCloseBtn.addEventListener('click', function() {
        guestPlayerModal.classList.remove('active');
    });

    // 용병 추가 버튼 클릭 시
    addGuestSubmitBtn.addEventListener('click', function() {
        addGuestPlayer();
    });

    // 엔터 키로 용병 추가 가능하게
    guestPlayerNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addGuestPlayer();
        }
    });
    
    guestPlayerNumberInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addGuestPlayer();
        }
    });
}

// 용병 추가 함수
function addGuestPlayer() {
    const name = guestPlayerNameInput.value.trim();
    const number = parseInt(guestPlayerNumberInput.value);

    // 유효성 검사
    if (!name) {
        alert('용병 이름을 입력해주세요.');
        return;
    }
    
    if (isNaN(number) || number <= 0) {
        alert('유효한 등번호를 입력해주세요.');
        return;
    }

    // 등번호 중복 검사
    const isDuplicateNumber = allPlayers.some(player => player.number === number) || 
                             guestPlayers.some(player => player.number === number);
    
    if (isDuplicateNumber) {
        alert('이미 사용 중인 등번호입니다. 다른 번호를 입력해주세요.');
        return;
    }

    // 새 용병 선수 객체 생성
    const newGuestPlayer = {
        id: guestPlayerIdCounter++,
        name: name,
        number: number,
        isGuest: true
    };

    // 용병 배열에 추가
    guestPlayers.push(newGuestPlayer);
    
    // 전체 선수 목록에 추가
    allPlayers.push(newGuestPlayer);
    
    // 자동으로 선택 처리
    selectedPlayers.add(newGuestPlayer.id);

    // 선택된 선수 수 업데이트
    selectedPlayerCount.textContent = selectedPlayers.size;
    totalPlayerCount.textContent = allPlayers.length;
    
    // 선수 목록 다시 렌더링
    renderPlayerList();
    
    // 모달 닫기
    guestPlayerModal.classList.remove('active');
}

// 선수 데이터 로드 함수
function loadPlayers() {
    // 실제로는 API 호출이 필요함
    allPlayers = dummyPlayers;
    
    // 총 선수 수 표시
    totalPlayerCount.textContent = allPlayers.length;
    
    // 선수 목록 렌더링
    renderPlayerList();
}

// 선수 목록 렌더링 함수 (수정)
function renderPlayerList() {
    playerList.innerHTML = '';
    
    allPlayers.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = `player-card${selectedPlayers.has(player.id) ? ' selected' : ''}`;
        
        // 용병인 경우 스타일 클래스 추가
        if (player.isGuest) {
            playerCard.classList.add('guest-player');
        }
        
        playerCard.dataset.playerId = player.id;
        
        const playerNumber = document.createElement('div');
        playerNumber.className = 'player-card-number';
        playerNumber.textContent = player.number;
        
        const playerName = document.createElement('div');
        playerName.className = 'player-card-name';
        playerName.textContent = player.name;
        
        playerCard.appendChild(playerNumber);
        playerCard.appendChild(playerName);
        
        // 선수 카드 클릭 이벤트 - 선택/해제 토글
        playerCard.addEventListener('click', function() {
            togglePlayerSelection(player.id);
        });
        
        playerList.appendChild(playerCard);
    });
}

// 선수 선택/해제 토글 함수
function togglePlayerSelection(playerId) {
    if (selectedPlayers.has(playerId)) {
        // 이미 선택된 선수라면 선택 해제
        selectedPlayers.delete(playerId);
    } else {
        // 선택되지 않은 선수라면 선택 추가
        selectedPlayers.add(playerId);
    }
    
    // 선택된 선수 수 업데이트
    selectedPlayerCount.textContent = selectedPlayers.size;
    
    // 선수 목록 UI 업데이트
    const playerCard = playerList.querySelector(`[data-player-id="${playerId}"]`);
    if (playerCard) {
        playerCard.classList.toggle('selected');
    }
}

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
    // 지도 영역 토글
    if (mapContainer.style.display === 'none' || mapContainer.style.display === '') {
        mapContainer.style.display = 'block';
        
        // 지도가 아직 초기화되지 않았다면 초기화
        if (!map) {
            initMap();
        }
    } else {
        mapContainer.style.display = 'none';
    }
});

// 키워드 검색 버튼 클릭 시
searchKeywordBtn.addEventListener('click', function() {
    searchPlaces();
});

// 키워드 입력창에서 엔터 키 입력 시
keywordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchPlaces();
    }
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
    if (!matchInfo.date || !matchInfo.time || !matchInfo.opponentTeam || !matchInfo.location || !matchInfo.address) {
        alert('경기 정보(일시, 상대팀, 장소)를 모두 입력해주세요.');
        return;
    }
    
    // 경기 정보와 포메이션 정보를 함께 저장
    const matchData = {
        info: matchInfo,
        formations: formations
    };
    
    // 서버에 저장하는 API 호출 (향후 구현)
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
    
    // 포지션 컨테이너 생성
    const positionsContainer = document.createElement('div');
    positionsContainer.className = 'positions-container';
    positionsContainer.style.marginTop = '35px'; // 인라인 스타일로 마진 추가
    
    // 선택된 포메이션 레이아웃 가져오기
    const layout = formation.getLayouts()[formationType]
    
    // 포지션을 행별로 그룹화
    const positionsByRow = {};
    layout.forEach(pos => {
        if (!positionsByRow[pos.row]) {
            positionsByRow[pos.row] = [];
        }
        positionsByRow[pos.row].push(pos);
    });
    
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
                positionElement.dataset.position = `${layout.indexOf(pos)}`;
                
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

// 저장된 선수 포지션 정보 적용
function applyPlayerPositions() {
    // 현재 쿼터에 저장된 선수 정보 가져오기
    const currentPlayers = formations[currentQuarter].players;
    
    // 모든 포지션 요소 가져오기
    const positionElements = document.querySelectorAll('.formation-position');
    
    // 각 포지션에 선수 정보 적용
    positionElements.forEach(positionElement => {
        const position = positionElement.dataset.position;
        const playerId = currentPlayers[position];
        
        // 선수 ID가 있으면 해당 선수 정보 표시
        if (playerId) {
            const player = allPlayers.find(p => p.id === playerId);
            if (player) {
                const jersey = positionElement.querySelector('.jersey');
                
                // 빈 포지션 클래스 제거
                jersey.classList.remove('empty-position');
                
                // 기존 번호와 이름 요소가 있으면 제거
                const existingNumber = jersey.querySelector('.player-number');
                if (existingNumber) existingNumber.remove();
                
                const existingName = positionElement.querySelector('.player-name-display');
                if (existingName) existingName.remove();
                
                // 선수 번호 추가
                const playerNumber = document.createElement('div');
                playerNumber.className = 'player-number';
                playerNumber.textContent = player.number;
                jersey.appendChild(playerNumber);
                
                // 선수 이름 추가
                const playerName = document.createElement('div');
                playerName.className = 'player-name-display';
                playerName.textContent = player.name;
                positionElement.appendChild(playerName);
            }
        } else {
            // 선수가 배정되지 않은 포지션은 빈 상태로 초기화
            const jersey = positionElement.querySelector('.jersey');
            jersey.classList.add('empty-position');
            
            // 기존 번호와 이름 요소 제거
            const existingNumber = jersey.querySelector('.player-number');
            if (existingNumber) existingNumber.remove();
            
            const existingName = positionElement.querySelector('.player-name-display');
            if (existingName) existingName.remove();
        }
    });
}

// 선수를 포지션에 배치하는 함수
function assignPlayerToPosition(position, player) {
    // 현재 쿼터의 포메이션 정보에 선수 저장
    formations[currentQuarter].players[position] = player.id;
    
    // UI 업데이트
    const positionElement = document.querySelector(`.formation-position[data-position="${position}"]`);
    if (positionElement) {
        const jersey = positionElement.querySelector('.jersey');
        
        // 빈 포지션 클래스 제거
        jersey.classList.remove('empty-position');
        
        // 기존 번호와 이름 요소가 있으면 제거
        const existingNumber = jersey.querySelector('.player-number');
        if (existingNumber) existingNumber.remove();
        
        const existingName = positionElement.querySelector('.player-name-display');
        if (existingName) existingName.remove();
        
        // 선수 번호 추가
        const playerNumber = document.createElement('div');
        playerNumber.className = 'player-number';
        playerNumber.textContent = player.number;
        jersey.appendChild(playerNumber);
        
        // 선수 이름 추가
        const playerName = document.createElement('div');
        playerName.className = 'player-name-display';
        playerName.textContent = player.name;
        positionElement.appendChild(playerName);
    }
}

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

// 모달에 선수 목록 채우기 (수정된 버전)
function populateModalPlayerList(position) {
    modalPlayerList.innerHTML = '';
    
    // 선택된 선수들에 대한 목록 생성
    let hasSelectedPlayers = false;
    
    allPlayers.forEach(player => {
        if (selectedPlayers.has(player.id)) {
            hasSelectedPlayers = true;
            
            const playerItem = document.createElement('div');
            playerItem.className = 'modal-player-item';
            playerItem.dataset.playerId = player.id;
            
            // 용병 선수는 표시
            if (player.isGuest) {
                playerItem.classList.add('guest-player-item');
            }
            
            // 이미 포지션에 할당된 선수인지 확인
            const isAssigned = isPlayerAssignedToAnyPosition(player.id);
            if (isAssigned) {
                playerItem.classList.add('assigned');
            }
            
            // 내부 요소 생성
            const playerNumber = document.createElement('div');
            playerNumber.className = 'player-number';
            playerNumber.textContent = player.number;
            
            const playerName = document.createElement('div');
            playerName.className = 'player-name';
            playerName.textContent = player.name;
            
            playerItem.appendChild(playerNumber);
            playerItem.appendChild(playerName);
            
            // 클릭 이벤트 - 선수를 포지션에 할당
            playerItem.addEventListener('click', function() {
                if (!isAssigned || isPlayerAssignedToPosition(player.id, position)) {
                    assignPlayerToPosition(position, player);
                    playerSelectModal.classList.remove('active');
                } else {
                    alert('이미 다른 포지션에 배치된 선수입니다.');
                }
            });
            
            modalPlayerList.appendChild(playerItem);
        }
    });
    
    // 선택된 선수가 없을 경우 메시지 표시
    if (!hasSelectedPlayers) {
        const noPlayersMsg = document.createElement('div');
        noPlayersMsg.className = 'no-players-message';
        noPlayersMsg.textContent = '선택된 선수가 없습니다. 먼저 선수를 선택해주세요.';
        modalPlayerList.appendChild(noPlayersMsg);
    }
}

// 선수가 이미 다른 포지션에 할당되어 있는지 확인
function isPlayerAssignedToAnyPosition(playerId) {
    const positionEntries = Object.entries(formations[currentQuarter].players);
    return positionEntries.some(([pos, id]) => id && id === playerId);
}

// 선수가 특정 포지션에 할당되어 있는지 확인
function isPlayerAssignedToPosition(playerId, position) {
    const assignedPlayer = formations[currentQuarter].players[position];
    return assignedPlayer && assignedPlayer.id === playerId;
}

// 카카오맵 초기화 함수
function initMap() {
    // 지도 객체 생성
    const options = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 서울 시청
        level: 3
    };
    map = new kakao.maps.Map(mapElement, options);
    
    // 장소 검색 객체 생성
    ps = new kakao.maps.services.Places();
    
    // 인포윈도우 객체 생성
    infoWindow = new kakao.maps.InfoWindow({zIndex: 1});
}

// 키워드로 장소 검색
function searchPlaces() {
    const keyword = keywordInput.value;
    
    if (!keyword.trim()) {
        alert('검색어를 입력해주세요');
        return;
    }
    
    // 키워드 검색 실행
    ps.keywordSearch(keyword, placesSearchCB);
}

// 장소검색 콜백함수
function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        // 검색 결과 목록과 마커를 표출
        displayPlaces(data);
        
        // 페이지 번호 표시
        // displayPagination(pagination); // 필요시 구현
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 없습니다.');
    } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 중 오류가 발생했습니다.');
    }
}

// 검색 결과 표시 함수
function displayPlaces(places) {
    // 이전 마커들 제거
    removeAllMarkers();
    
    const bounds = new kakao.maps.LatLngBounds();
    
    // 검색 결과 목록 생성
    const listEl = document.createElement('div');
    listEl.className = 'place-list';
    
    // 기존에 결과 목록이 있으면 제거
    const existingList = document.querySelector('.place-list');
    if (existingList) {
        existingList.remove();
    }
    
    // 마커와 인포윈도우 표시
    for (let i = 0; i < places.length; i++) {
        // 마커 생성
        const position = new kakao.maps.LatLng(places[i].y, places[i].x);
        const marker = addMarker(position, i);
        
        // 검색 결과 항목 생성
        const itemEl = getListItem(i, places[i]);
        
        // 마커에 클릭 이벤트 추가
        (function(marker, place, item) {
            // 마커 클릭 시
            kakao.maps.event.addListener(marker, 'click', function() {
                // 인포윈도우에 장소 정보 표시
                displayInfoWindow(marker, place);
                
                // 선택한 장소 정보 저장
                selectPlace(place);
            });
            
            // 마커에 마우스 오버 시
            kakao.maps.event.addListener(marker, 'mouseover', function() {
                displayInfoWindow(marker, place);
            });
            
            // 마커에 마우스 아웃 시
            kakao.maps.event.addListener(marker, 'mouseout', function() {
                infoWindow.close();
            });
            
            // 목록 아이템 클릭 시
            itemEl.onclick = function() {
                // 해당 마커를 클릭하여 마커 정보창 표시
                map.panTo(position);
                displayInfoWindow(marker, place);
                
                // 선택한 장소 정보 저장
                selectPlace(place);
                
                // 선택된 항목 스타일 적용
                const selected = document.querySelector('.place-item.selected');
                if (selected) {
                    selected.classList.remove('selected');
                }
                this.classList.add('selected');
            };
        })(marker, places[i], itemEl);
        
        listEl.appendChild(itemEl);
        bounds.extend(position);
    }
    
    // 검색 결과 목록을 지도 아래에 추가
    mapContainer.appendChild(listEl);
    
    // 검색된 장소 위치를 기준으로 지도 범위 재설정
    map.setBounds(bounds);
}

// 검색 결과 항목 생성 함수
function getListItem(index, place) {
    const item = document.createElement('div');
    item.className = 'place-item';
    
    const itemStr = `
        <div class="place-item-inner">
            <div class="place-marker">${index + 1}</div>
            <div class="place-info">
                <h5 class="place-name">${place.place_name}</h5>
                <span class="place-category">${place.category_name}</span>
                <span class="place-address">${place.address_name}</span>
                ${place.road_address_name ? 
                    `<span class="place-road-address">${place.road_address_name}</span>` : ''}
                ${place.phone ? 
                    `<span class="place-phone">${place.phone}</span>` : ''}
            </div>
            <button class="select-place-btn">선택</button>
        </div>
    `;
    
    item.innerHTML = itemStr;
    
    // 선택 버튼 클릭 이벤트
    item.querySelector('.select-place-btn').addEventListener('click', function(e) {
        e.stopPropagation(); // 버블링 방지
        selectPlace(place);
    });
    
    return item;
}

// 마커 생성 함수
function addMarker(position, idx) {
    const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
    const imageSize = new kakao.maps.Size(36, 37);  // 마커 이미지의 크기
    const imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691),    // 스프라이트 이미지의 크기
        spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10),    // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
        offset: new kakao.maps.Point(13, 37)    // 마커 좌표에 일치시킬 이미지 내에서의 좌표
    };
    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
    const marker = new kakao.maps.Marker({
        position: position,
        image: markerImage
    });
    
    marker.setMap(map);
    markers.push(marker);
    
    return marker;
}

// 모든 마커 제거 함수
function removeAllMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

// 인포윈도우 표시 함수
function displayInfoWindow(marker, place) {
    const content = `
        <div class="place-info-window">
            <div class="place-info-name">${place.place_name}</div>
            <div class="place-info-address">${place.address_name}</div>
        </div>
    `;
    
    infoWindow.setContent(content);
    infoWindow.open(map, marker);
}

// 장소 선택 함수
function selectPlace(place) {
    // 선택한 장소 정보 저장
    matchLocationInput.value = place.place_name;
    matchAddressInput.value = place.address_name;
    matchInfo.location = place.place_name;
    matchInfo.address = place.address_name;
    matchInfo.latitude = place.y;
    matchInfo.longitude = place.x;
    
    // 주소 선택 효과 추가
    matchLocationInput.classList.add('address-selected');
    matchAddressInput.classList.add('address-selected');
    
    // 지도 숨기기
    mapContainer.style.display = 'none';
    
    // 선택 확인 메시지 표시
    showAddressSelectionMessage();
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
    messageElement.textContent = '장소가 성공적으로 선택되었습니다.';
    
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