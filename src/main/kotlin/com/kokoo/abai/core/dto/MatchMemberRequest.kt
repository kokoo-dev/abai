package com.kokoo.abai.core.dto

import com.kokoo.abai.core.row.MatchMemberRow

data class MatchMemberRequest(
    val matchId: Long,
    val memberId: Long,
    val goalsFor: Int = 0,
)

fun MatchMemberRequest.toRow() = MatchMemberRow(
    matchId = this.matchId,
    memberId = this.memberId,
    goalsFor = this.goalsFor
)