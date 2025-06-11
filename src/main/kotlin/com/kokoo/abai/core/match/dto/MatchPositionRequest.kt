package com.kokoo.abai.core.match.dto

import com.kokoo.abai.core.match.enums.PlayerType
import com.kokoo.abai.core.match.row.MatchPositionRow

data class MatchPositionRequest(
    val memberId: Long? = null,
    val guestId: String? = null,
    val position: Int,
    val playerType: PlayerType,
    val playerName: String
)

fun MatchPositionRequest.toRow(matchFormationId: Long) = MatchPositionRow(
    memberId = this.memberId,
    guestId = this.guestId,
    matchFormationId = matchFormationId,
    position = this.position,
    playerType = this.playerType,
    playerName = this.playerName
)