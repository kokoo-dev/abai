import ApiClient from "./common/ApiClient.js"
import CommonUtils from "./common/CommonUtils.js"
import DateUtils from "./common/DateUtils.js"

document.addEventListener('DOMContentLoaded', function () {
    member.getUpcomingBirthday()
    match.getUpcoming()
    record.getSummary()
    notice.getList()
})

const member = {
    getUpcomingBirthday() {
        ApiClient.request({
            url: '/v1/members/upcoming-birthday',
            method: 'GET',
            onSuccess: (response) => {
                if (response.length < 1) {
                    return
                }

                const birthdayBannerNode = CommonUtils.getTemplateNode('birthday-banner-template')

                let birthdayText = response[0].name
                if (response.length > 1) {
                    birthdayText += ` 외 ${response.length - 1}명`
                }
                birthdayText += ' 생일이 다가옵니다.'

                birthdayBannerNode.querySelector('.birthday-text').textContent = birthdayText

                document.getElementById('birthday-banner-wrapper').appendChild(birthdayBannerNode)
            }
        })
    }
}

const match = {
    getUpcoming() {
        ApiClient.request({
            url: '/v1/matches/upcoming',
            method: 'GET',
            onSuccess: (response) => {
                const upcomingMatchNode = CommonUtils.getTemplateNode('upcoming-match-template')

                const dateFormatOptions = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }

                upcomingMatchNode.getElementById('matchAt').textContent = new Intl.DateTimeFormat('ko-KR', dateFormatOptions).format(new Date(response.matchAt))
                upcomingMatchNode.getElementById('opponentName').textContent = response.opponentName
                upcomingMatchNode.getElementById('location').textContent = response.location

                document.getElementById('upcoming-match-wrapper').appendChild(upcomingMatchNode)

                const matchDetailButton = document.querySelector('.attend-btn')
                matchDetailButton.addEventListener('click', function() {
                    location.href = `/schedules/matches/${response.id}`
                })
            },
            onError: (error) => {
                // ignore
            }
        })
    }
}

const record = {
    getSummary() {
        const today = new Date();
        let startDate = new Date();
        startDate.setMonth(today.getMonth() - 3)

        const formattedStartDate = DateUtils.formatDate(startDate, 'yyyy-MM-dd')
        const formattedEndDate = DateUtils.formatDate(today, 'yyyy-MM-dd')

        document.getElementById('record-start-date').textContent = `${formattedStartDate} - ${formattedEndDate}`

        ApiClient.request({
            url: '/v1/matches/results',
            method: 'GET',
            params: {
                startDate: formattedStartDate,
                endDate: formattedEndDate
            },
            onSuccess: (response) => {
                const victory = response.VICTORY ?? 0
                const draw = response.DRAW ?? 0
                const defeat = response.DEFEAT ?? 0
                document.getElementById('result-match-count').textContent = victory + draw + defeat
                document.getElementById('result-victory-count').textContent = victory
                document.getElementById('result-draw-count').textContent = draw
                document.getElementById('result-defeat-count').textContent = defeat
            }
        })
    }
}

const notice = {
    getList() {
        ApiClient.request({
            url: '/v1/notices',
            method: 'GET',
            params: {
                size: 3
            },
            onSuccess: (response) => {
                response.forEach(item => {
                    const noticeNode = CommonUtils.getTemplateNode('notice-template')

                    const noticeBadge = noticeNode.querySelector('.notice-badge')
                    noticeBadge.classList.add(`${item.category.markColor.toLowerCase()}-badge`)
                    noticeBadge.textContent = item.category.name

                    const noticeTitle = noticeNode.querySelector('.notice-title')
                    noticeTitle.href = `/see-more/notices/${item.id}`
                    noticeTitle.textContent = item.title

                    noticeNode.querySelector('.notice-date').textContent =
                        DateUtils.formatDate(item.createdAt, 'yyyy-MM-dd')

                    document.getElementById('notice-wrap').appendChild(noticeNode)
                })
            }
        })
    }
}