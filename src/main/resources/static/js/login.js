// 로그인 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 탭 전환 기능
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 탭 버튼 활성화 상태 업데이트
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // 탭 컨텐츠 표시/숨김 처리
            const targetTab = this.getAttribute('data-tab');
            tabContents.forEach(content => {
                if (content.id === targetTab) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });

    // 로그인 폼 제출
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const remember = document.getElementById('remember').checked;
            
            if (!email || !password) {
                alert('이메일과 비밀번호를 모두 입력해주세요.');
                return;
            }
            
            // API 호출 예시
            // fetch('/api/auth/login', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({ email, password, remember })
            // })
            // .then(response => {
            //     if (response.ok) {
            //         return response.json();
            //     }
            //     throw new Error('로그인 실패');
            // })
            // .then(data => {
            //     // 로그인 성공 처리
            //     localStorage.setItem('auth_token', data.token);
            //     window.location.href = '/';
            // })
            // .catch(error => {
            //     console.error('로그인 중 오류 발생:', error);
            //     alert('이메일 또는 비밀번호가 올바르지 않습니다.');
            // });
            
            // 임시 코드 (실제로는 위의 API 호출이 사용됨)
            console.log('로그인 시도:', { email, password, remember });
            window.location.href = '/';
        });
    }

    // 회원가입 폼 제출
    const registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const passwordConfirm = document.getElementById('register-password-confirm').value;
            const position = document.getElementById('register-position').value;
            const agreeTerms = document.getElementById('agree-terms').checked;
            
            // 입력값 검증
            if (!name || !email || !password || !passwordConfirm) {
                alert('모든 필수 정보를 입력해주세요.');
                return;
            }
            
            if (password.length < 8) {
                alert('비밀번호는 8자 이상이어야 합니다.');
                return;
            }
            
            if (password !== passwordConfirm) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }
            
            if (!position) {
                alert('포지션을 선택해주세요.');
                return;
            }
            
            if (!agreeTerms) {
                alert('서비스 이용약관에 동의해주세요.');
                return;
            }
            
            // API 호출 예시
            // fetch('/api/auth/register', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({ name, email, password, position })
            // })
            // .then(response => {
            //     if (response.ok) {
            //         return response.json();
            //     }
            //     throw new Error('회원가입 실패');
            // })
            // .then(data => {
            //     // 회원가입 성공 처리
            //     alert('회원가입이 완료되었습니다. 로그인해주세요.');
            //     // 로그인 탭으로 전환
            //     document.querySelector('.tab-btn[data-tab="login"]').click();
            // })
            // .catch(error => {
            //     console.error('회원가입 중 오류 발생:', error);
            //     alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
            // });
            
            // 임시 코드 (실제로는 위의 API 호출이 사용됨)
            console.log('회원가입 시도:', { name, email, password, position });
            alert('회원가입이 완료되었습니다. 로그인해주세요.');
            // 로그인 탭으로 전환
            document.querySelector('.tab-btn[data-tab="login"]').click();
        });
    }

    // 소셜 로그인 버튼
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList[1]; // kakao, naver, google 등
            
            // 소셜 로그인 처리
            // window.location.href = `/api/auth/${provider}`;
            
            // 임시 코드
            alert(`${provider} 로그인 기능은 아직 구현되지 않았습니다.`);
        });
    });
}); 