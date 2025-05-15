document.addEventListener('DOMContentLoaded', () => {
    // 탭 활성화
    const currentPage = window.location.pathname
    const tabLinks = document.querySelectorAll('.tab')

    tabLinks.forEach(link => {
        const href = link.getAttribute('href')
        const isMatch = href === '/'
            ? currentPage === '/'
            : currentPage.startsWith(href)

        if (isMatch) {
            link.classList.add('active')
        } else {
            link.classList.remove('active')
        }
    })
})