package com.kokoo.abai.core.member.enums

enum class RoleId(
    val level: Int,
    val koreanName: String
) {
    SERVICE_ADMIN(1, "서비스 관리자"),
    TEAM_ADMIN(2, "팀 관리자"),
    TEAM_USER(3, "팀 일반 유저")
}