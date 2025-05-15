// 설정 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 프로필 이미지 변경
    const editProfilePicture = document.querySelector('.edit-profile-picture');
    if (editProfilePicture) {
        editProfilePicture.addEventListener('click', function() {
            // 실제로는 파일 업로드 다이얼로그를 열어야 함
            alert('프로필 이미지 변경 기능은 아직 구현되지 않았습니다.');
        });
    }

    // 폼 제출 처리
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 수집
            const formData = new FormData(this);
            const userData = {};
            
            for (const [key, value] of formData.entries()) {
                userData[key] = value;
            }
            
            // API 호출 예시
            // fetch('/api/user/profile', {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(userData)
            // })
            // .then(response => {
            //     if (response.ok) {
            //         return response.json();
            //     }
            //     throw new Error('프로필 업데이트 실패');
            // })
            // .then(data => {
            //     alert('프로필이 성공적으로 업데이트되었습니다.');
            //     updateProfileUI(data);
            // })
            // .catch(error => {
            //     console.error('프로필 업데이트 중 오류 발생:', error);
            //     alert('프로필 업데이트 중 오류가 발생했습니다.');
            // });
            
            // 임시 성공 메시지
            alert('프로필이 성공적으로 업데이트되었습니다.');
        });
    }

    // 비밀번호 변경 버튼
    const changePasswordBtn = document.querySelector('.change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            // 실제로는 비밀번호 변경 모달 표시
            alert('비밀번호 변경 기능은 아직 구현되지 않았습니다.');
        });
    }

    // 로그인 기록 보기 버튼
    const viewLoginHistoryBtn = document.querySelector('.setting-item:nth-child(2) .view-btn');
    if (viewLoginHistoryBtn) {
        viewLoginHistoryBtn.addEventListener('click', function() {
            // 실제로는 로그인 기록 페이지로 이동하거나 모달 표시
            // alert('로그인 기록 기능은 아직 구현되지 않았습니다.');
        });
    }

    // 데이터 표시 설정 버튼
    const dataDisplayBtn = document.querySelector('.app-settings-card .view-btn');
    if (dataDisplayBtn) {
        dataDisplayBtn.addEventListener('click', function() {
            // 실제로는 데이터 표시 설정 페이지로 이동하거나 모달 표시
            alert('데이터 표시 설정 기능은 아직 구현되지 않았습니다.');
        });
    }

    // 언어 설정 변경
    const languageSelect = document.querySelector('.language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            
            // API 호출 예시
            // fetch('/api/user/settings/language', {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({ language: selectedLanguage })
            // })
            // .then(response => {
            //     if (response.ok) {
            //         // 언어 변경 후 페이지 새로고침
            //         window.location.reload();
            //     } else {
            //         throw new Error('언어 설정 변경 실패');
            //     }
            // })
            // .catch(error => {
            //     console.error('언어 설정 변경 중 오류 발생:', error);
            //     alert('언어 설정 변경 중 오류가 발생했습니다.');
            // });
            
            // 임시 알림
            alert('언어가 ' + this.options[this.selectedIndex].text + '(으)로 변경되었습니다.');
        });
    }

    // 다크모드 토글
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('dark-mode', 'enabled');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('dark-mode', 'disabled');
            }
        });
        
        // 저장된 다크모드 설정 적용
        if (localStorage.getItem('dark-mode') === 'enabled') {
            darkModeToggle.checked = true;
            document.body.classList.add('dark-mode');
        }
    }

    // 로그아웃 버튼
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('정말 로그아웃하시겠습니까?')) {
                document.getElementById('logout-form').submit()
            }
        });
    }

    // 프로필 데이터 로드 (실제로는 서버에서 가져올 것)
    const loadUserData = () => {
        // API 호출 예시
        // fetch('/api/user/profile')
        //     .then(response => response.json())
        //     .then(data => {
        //         updateProfileUI(data);
        //     })
        //     .catch(error => {
        //         console.error('프로필 데이터 로딩 중 오류 발생:', error);
        //     });
    };

    // 초기 데이터 로드
    loadUserData();
}); 