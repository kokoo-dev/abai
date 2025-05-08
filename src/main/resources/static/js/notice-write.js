// 공지사항 작성 페이지 스크립트
document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소
    const noticeForm = document.querySelector('.notice-form');
    const cancelBtn = document.querySelector('.cancel-btn');
    const fileInput = document.getElementById('file-upload');
    const fileUploadBox = document.querySelector('.file-upload-box');
    const fileListContainer = document.querySelector('.file-list');
    const noFilesMsg = document.querySelector('.no-files');
    const uploadedFilesList = document.querySelector('.uploaded-files');
    
    // 선택된 파일 목록
    let selectedFiles = [];
    
    // 파일 업로드 이벤트
    fileInput.addEventListener('change', handleFileSelect);
    
    // 드래그 앤 드롭 이벤트
    fileUploadBox.addEventListener('dragover', handleDragOver);
    fileUploadBox.addEventListener('dragleave', handleDragLeave);
    fileUploadBox.addEventListener('drop', handleFileDrop);
    
    // 폼 제출 이벤트
    noticeForm.addEventListener('submit', handleFormSubmit);
    
    // 취소 버튼 이벤트
    cancelBtn.addEventListener('click', function() {
        const confirmCancel = confirm('작성 중인 내용이 있습니다. 정말로 취소하시겠습니까?');
        if (confirmCancel) {
            window.location.href = '/notice';
        }
    });
    
    // 파일 선택 처리 함수
    function handleFileSelect(e) {
        const files = e.target.files;
        addFilesToList(files);
    }
    
    // 드래그 오버 처리 함수
    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        fileUploadBox.classList.add('active');
    }
    
    // 드래그 리브 처리 함수
    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        fileUploadBox.classList.remove('active');
    }
    
    // 파일 드롭 처리 함수
    function handleFileDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        fileUploadBox.classList.remove('active');
        
        const files = e.dataTransfer.files;
        addFilesToList(files);
    }
    
    // 파일을 목록에 추가하는 함수
    function addFilesToList(files) {
        if (files.length === 0) return;
        
        // 파일 없음 메시지 숨기기
        noFilesMsg.style.display = 'none';
        
        // 각 파일 처리
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // 이미 선택된 파일이 있는지 확인
            const isDuplicate = selectedFiles.some(f => f.name === file.name && f.size === file.size);
            if (isDuplicate) continue;
            
            // 파일 정보 저장
            selectedFiles.push(file);
            
            // 파일 아이템 생성
            const fileItem = document.createElement('li');
            fileItem.className = 'file-item';
            
            // 파일 크기 형식화
            const fileSize = formatFileSize(file.size);
            
            // 파일 확장자에 따른 아이콘 선택
            const fileIcon = getFileIcon(file.name);
            
            // 파일 아이템 내용 설정
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="${fileIcon} file-icon"></i>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">(${fileSize})</span>
                </div>
                <i class="fas fa-times file-remove" data-name="${file.name}"></i>
            `;
            
            // 파일 목록에 추가
            uploadedFilesList.appendChild(fileItem);
            
            // 파일 제거 버튼 이벤트 등록
            const removeBtn = fileItem.querySelector('.file-remove');
            removeBtn.addEventListener('click', function() {
                const fileName = this.getAttribute('data-name');
                removeFile(fileName, fileItem);
            });
        }
    }
    
    // 파일 제거 함수
    function removeFile(fileName, fileItem) {
        // 파일 목록에서 제거
        uploadedFilesList.removeChild(fileItem);
        
        // 선택된 파일 배열에서 제거
        selectedFiles = selectedFiles.filter(file => file.name !== fileName);
        
        // 파일이 없는 경우 메시지 표시
        if (selectedFiles.length === 0) {
            noFilesMsg.style.display = 'block';
        }
    }
    
    // 파일 크기 형식화 함수
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // 파일 아이콘 선택 함수
    function getFileIcon(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        
        const iconMap = {
            'pdf': 'fas fa-file-pdf',
            'doc': 'fas fa-file-word',
            'docx': 'fas fa-file-word',
            'xls': 'fas fa-file-excel',
            'xlsx': 'fas fa-file-excel',
            'ppt': 'fas fa-file-powerpoint',
            'pptx': 'fas fa-file-powerpoint',
            'jpg': 'fas fa-file-image',
            'jpeg': 'fas fa-file-image',
            'png': 'fas fa-file-image',
            'gif': 'fas fa-file-image',
            'zip': 'fas fa-file-archive',
            'rar': 'fas fa-file-archive',
            'txt': 'fas fa-file-alt'
        };
        
        return iconMap[extension] || 'fas fa-file';
    }
    
    // 폼 제출 처리 함수
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // 폼 데이터 수집
        const category = document.getElementById('notice-category').value;
        const title = document.getElementById('notice-title').value;
        const content = document.getElementById('notice-content').value;
        
        // 입력 값 검증
        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        
        if (!content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }
        
        // FormData 객체 생성 (실제 API 전송용)
        const formData = new FormData();
        formData.append('category', category);
        formData.append('title', title);
        formData.append('content', content);
        
        // 파일 추가
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });
        
        // 실제 구현에서는 API 호출하여 공지사항 저장
        console.log('카테고리:', category);
        console.log('제목:', title);
        console.log('내용:', content);
        console.log('첨부파일 수:', selectedFiles.length);
        
        // API 호출 성공 가정
        alert('공지사항이 등록되었습니다.');
        window.location.href = '/notice';
    }
}); 