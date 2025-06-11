package com.kokoo.abai.core.match.dto

import com.kokoo.abai.core.match.enums.PlayerType
import com.kokoo.abai.core.match.row.MatchPositionRow

data class MatchPositionResponse(
    val id: Long,
    val memberId: Long?,
    val guestId: String?,
    val matchFormationId: Long,
    val position: Int,
    val playerType: PlayerType,
    val playerName: String,
)

fun MatchPositionRow.toResponse() = MatchPositionResponse(
    id = this.id,
    memberId = this.memberId,
    guestId = this.guestId,
    matchFormationId = this.matchFormationId,
    position = this.position,
    playerType = this.playerType,
    playerName = this.playerName
)