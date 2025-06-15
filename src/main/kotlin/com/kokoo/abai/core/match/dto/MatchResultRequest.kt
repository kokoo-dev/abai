package com.kokoo.abai.core.match.dto

import jakarta.validation.constraints.NotEmpty

data class MatchResultRequest(
    val goalsFor: Int = 0,
    val goalsAgainst: Int = 0,
    val assist: Int = 0,

    @field:NotEmpty
    val members: List<MemberResultRequest> = emptyList(),
    val guests: List<GuestResultRequest> = emptyList()
)

data class MemberResultRequest(
    val id: Long ,
    val goalsFor: Int = 0,
    val assist: Int = 0,
)

data class GuestResultRequest(
    val id: String ,
    val goalsFor: Int = 0,
    val assist: Int = 0,
)