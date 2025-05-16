package com.kokoo.abai.core.dto

import com.kokoo.abai.core.enums.PlayerType
import com.kokoo.abai.core.row.MatchPositionRow

data class MatchPositionResponse(
    val id: Long,
    val memberId: Long?,
    val matchFormationId: Long,
    val position: Int,
    val playerType: PlayerType,
    val playerName: String,
)

fun MatchPositionRow.toResponse() = MatchPositionResponse(
    id = this.id,
    memberId = this.memberId,
    matchFormationId = this.matchFormationId,
    position = this.position,
    playerType = this.playerType,
    playerName = this.playerName
)