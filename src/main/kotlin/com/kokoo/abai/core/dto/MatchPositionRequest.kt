package com.kokoo.abai.core.dto

import com.kokoo.abai.core.enums.PlayerType
import com.kokoo.abai.core.row.MatchPositionRow

data class MatchPositionRequest(
    val memberId: Long?,
    val position: Int,
    val playerType: PlayerType,
    val playerName: String
)

fun MatchPositionRequest.toRow(matchFormationId: Long) = MatchPositionRow(
    memberId = this.memberId,
    matchFormationId = matchFormationId,
    position = this.position,
    playerType = this.playerType,
    playerName = this.playerName
)