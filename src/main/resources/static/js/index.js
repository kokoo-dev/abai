import ApiClient from "./common/ApiClient.js"
import CommonUtils from "./common/CommonUtils.js"

document.addEventListener('DOMContentLoaded', function () {
    member.getUpcomingBirthday()
    match.getUpcoming()
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