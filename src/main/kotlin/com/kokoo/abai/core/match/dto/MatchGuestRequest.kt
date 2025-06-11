package com.kokoo.abai.core.match.dto

import com.kokoo.abai.core.match.row.MatchGuestRow

data class MatchGuestRequest(
    val matchId: Long,
    val guestId: String,
    val goalsFor: Int = 0,
    val assist: Int = 0
)

fun MatchGuestRequest.toRow() = MatchGuestRow(
    matchId = this.matchId,
    guestId = this.guestId,
    goalsFor = this.goalsFor,
    assist = this.assist,
)