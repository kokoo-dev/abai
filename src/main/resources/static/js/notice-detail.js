// 공지사항 상세 페이지 스크립트
document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소
    const commentForm = document.querySelector('.comment-form');
    const commentTextarea = document.querySelector('.comment-textarea');
    const commentSubmit = document.querySelector('.comment-submit');
    const replyButtons = document.querySelectorAll('.comment-actions .btn-text');
    const adminButtons = document.querySelectorAll('.admin-actions .btn');
    const attachmentLinks = document.querySelectorAll('.attachment-link');

    // 댓글 제출 이벤트
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
        });

        commentSubmit.addEventListener('click', function() {
            const commentContent = commentTextarea.value.trim();
            
            if (!commentContent) {
                alert('댓글 내용을 입력해주세요.');
                return;
            }
            
            // 실제 구현에서는 API 호출하여 댓글 저장
            console.log('댓글 내용:', commentContent);
            
            // 댓글 저장 성공 가정 시 UI 업데이트
            const commentsList = document.querySelector('.comments-list');
            const commentsCount = document.querySelector('.comments-count');
            
            // 새 댓글 HTML 생성
            const newComment = document.createElement('li');
            newComment.className = 'comment-item';
            newComment.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">사용자</span>
                    <span class="comment-date">${getCurrentDateTime()}</span>
                </div>
                <div class="comment-body">
                    ${commentContent}
                </div>
                <div class="comment-actions">
                    <button class="btn-text">답글</button>
                </div>
            `;
            
            // 댓글 목록 상단에 추가
            commentsList.insertBefore(newComment, commentsList.firstChild);
            
            // 댓글 수 업데이트
            const currentCount = parseInt(commentsCount.textContent);
            commentsCount.textContent = currentCount + 1;
            
            // 입력창 초기화
            commentTextarea.value = '';
            
            // 새로 추가된 답글 버튼에 이벤트 추가
            const newReplyButton = newComment.querySelector('.btn-text');
            addReplyButtonEvent(newReplyButton);
        });
    }

    // 답글 버튼 이벤트 추가 함수
    function addReplyButtonEvent(button) {
        button.addEventListener('click', function() {
            const commentItem = this.closest('.comment-item');
            
            // 이미 답글 폼이 있으면 제거
            const existingForm = commentItem.querySelector('.reply-form');
            if (existingForm) {
                existingForm.remove();
                return;
            }
            
            // 답글 폼 생성
            const replyForm = document.createElement('div');
            replyForm.className = 'reply-form';
            replyForm.innerHTML = `
                <textarea class="comment-textarea" placeholder="답글을 작성하세요..."></textarea>
                <div class="reply-actions">
                    <button class="btn-text cancel-reply">취소</button>
                    <button class="btn submit-reply">답글 작성</button>
                </div>
            `;
            
            // 답글 폼 삽입
            commentItem.appendChild(replyForm);
            
            // 취소 버튼 이벤트
            const cancelButton = replyForm.querySelector('.cancel-reply');
            cancelButton.addEventListener('click', function() {
                replyForm.remove();
            });
            
            // 답글 제출 버튼 이벤트
            const submitButton = replyForm.querySelector('.submit-reply');
            submitButton.addEventListener('click', function() {
                const replyContent = replyForm.querySelector('textarea').value.trim();
                
                if (!replyContent) {
                    alert('답글 내용을 입력해주세요.');
                    return;
                }
                
                // 실제 구현에서는 API 호출하여 답글 저장
                console.log('답글 내용:', replyContent);
                
                // 대댓글 목록 확인 또는 생성
                let repliesList = commentItem.querySelector('.replies-list');
                if (!repliesList) {
                    repliesList = document.createElement('ul');
                    repliesList.className = 'replies-list';
                    commentItem.appendChild(repliesList);
                }
                
                // 새 답글 HTML 생성
                const newReply = document.createElement('li');
                newReply.className = 'comment-item reply-item';
                newReply.innerHTML = `
                    <div class="comment-header">
                        <span class="comment-author">사용자</span>
                        <span class="comment-date">${getCurrentDateTime()}</span>
                    </div>
                    <div class="comment-body">
                        ${replyContent}
                    </div>
                `;
                
                // 답글 목록에 추가
                repliesList.appendChild(newReply);
                
                // 댓글 수 업데이트
                const commentsCount = document.querySelector('.comments-count');
                const currentCount = parseInt(commentsCount.textContent);
                commentsCount.textContent = currentCount + 1;
                
                // 답글 폼 제거
                replyForm.remove();
            });
        });
    }

    // 기존 답글 버튼에 이벤트 추가
    replyButtons.forEach(addReplyButtonEvent);

    // 관리자 버튼 이벤트
    if (adminButtons.length > 0) {
        // 수정 버튼
        const editButton = document.querySelector('.edit-btn');
        if (editButton) {
            editButton.addEventListener('click', function() {
                // 실제 구현에서는 수정 페이지로 이동
                const noticeId = getNoticeIdFromUrl();
                console.log(`공지사항 ID ${noticeId} 수정 페이지로 이동`);
                // window.location.href = `/notice-edit?id=${noticeId}`;
            });
        }
        
        // 삭제 버튼
        const deleteButton = document.querySelector('.delete-btn');
        if (deleteButton) {
            deleteButton.addEventListener('click', function() {
                const confirmDelete = confirm('정말로 이 공지사항을 삭제하시겠습니까?');
                
                if (confirmDelete) {
                    const noticeId = getNoticeIdFromUrl();
                    
                    // 실제 구현에서는 API 호출하여 공지사항 삭제
                    console.log(`공지사항 ID ${noticeId} 삭제 요청`);
                    
                    // 삭제 성공 가정 시 목록 페이지로 이동
                    alert('공지사항이 삭제되었습니다.');
                    window.location.href = '/notice';
                }
            });
        }
    }

    // 첨부파일 링크 이벤트
    attachmentLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const fileName = this.querySelector('span').textContent;
            
            // 실제 구현에서는 파일 다운로드 API 호출
            console.log(`${fileName} 파일 다운로드 요청`);
        });
    });

    // 현재 날짜와 시간 반환 함수
    function getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        return `${year}.${month}.${day} ${hours}:${minutes}`;
    }

    // URL에서 공지사항 ID 추출 함수
    function getNoticeIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || '1'; // ID가 없으면 기본값 1 반환
    }
}); 