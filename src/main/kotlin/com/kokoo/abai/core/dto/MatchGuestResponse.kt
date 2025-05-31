package com.kokoo.abai.core.dto

import com.kokoo.abai.core.row.MatchGuestRow

data class MatchGuestResponse(
    val id: Long,
    val matchId: Long,
    val guestId: String,
    val goalsFor: Int,
    val guest: GuestResponse? = null,
)

fun MatchGuestRow.toResponse() = MatchGuestResponse(
    id = this.id,
    matchId = this.matchId,
    guestId = this.guestId,
    goalsFor = this.goalsFor,
    guest = this.guest?.toResponse()
)