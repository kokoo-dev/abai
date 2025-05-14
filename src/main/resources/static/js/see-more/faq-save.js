document.addEventListener('DOMContentLoaded', function() {
    const faqForm = document.querySelector('.faq-form');
    const cancelBtn = document.querySelector('.cancel-btn');
    
    // 취소 버튼 이벤트
    cancelBtn.addEventListener('click', function() {
        // FAQ 목록 페이지로 이동
        window.location.href = '/see-more/faq';
    });
    
    // 폼 제출 이벤트
    faqForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // 폼 데이터 수집
        const category = document.getElementById('faq-category').value;
        const question = document.getElementById('faq-question').value;
        const answer = document.getElementById('faq-answer').value;
        
        // 유효성 검사
        if (!question.trim()) {
            alert('질문을 입력해주세요.');
            return;
        }
        
        if (!answer.trim()) {
            alert('답변을 입력해주세요.');
            return;
        }
        
        // 여기에 폼 제출 로직 추가 (컨트롤러가 구현되면 연결)
        console.log('FAQ 등록 데이터:', { category, question, answer });
        
        // 임시로 알림 후 목록 페이지로 이동
        alert('FAQ가 등록되었습니다.');
        window.location.href = '/see-more/faq';
    });
}); 