package com.kokoo.abai.core.match.dto

import com.kokoo.abai.core.match.row.MatchMemberRow

data class MatchMemberRequest(
    val matchId: Long,
    val memberId: Long,
    val goalsFor: Int = 0,
    val assist: Int = 0
)

fun MatchMemberRequest.toRow() = MatchMemberRow(
    matchId = this.matchId,
    memberId = this.memberId,
    goalsFor = this.goalsFor,
    assist = this.assist,
)