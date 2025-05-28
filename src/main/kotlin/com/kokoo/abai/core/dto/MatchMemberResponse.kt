package com.kokoo.abai.core.dto

import com.kokoo.abai.core.row.MatchMemberRow

data class MatchMemberResponse(
    val id: Long,
    val matchId: Long,
    val memberId: Long,
    val goalsFor: Int,
    val member: MemberResponse? = null,
)

fun MatchMemberRow.toResponse() = MatchMemberResponse(
    id = this.id,
    matchId = this.matchId,
    memberId = this.memberId,
    goalsFor = this.goalsFor,
    member = this.member?.toResponse()
)