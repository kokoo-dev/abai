package com.kokoo.abai.core.match.dto

import com.kokoo.abai.core.member.dto.MemberResponse
import com.kokoo.abai.core.member.dto.toResponse
import com.kokoo.abai.core.match.row.MatchMemberRow

data class MatchMemberResponse(
    val id: Long,
    val matchId: Long,
    val memberId: Long,
    val goalsFor: Int,
    val assist: Int,
    val member: MemberResponse? = null,
)

fun MatchMemberRow.toResponse() = MatchMemberResponse(
    id = this.id,
    matchId = this.matchId,
    memberId = this.memberId,
    goalsFor = this.goalsFor,
    assist = this.assist,
    member = this.member?.toResponse()
)