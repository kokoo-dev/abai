package com.kokoo.abai.core.match.enums

enum class MatchStatus(
    val useMemberViewFilter: Boolean,
    val koreanName: String
) {
    READY(true, "예정"),
    CANCELED(false, "취소"),
    COMPLETED(true, "완료")
}