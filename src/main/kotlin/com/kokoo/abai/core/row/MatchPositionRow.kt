package com.kokoo.abai.core.row

import com.kokoo.abai.core.domain.MatchPosition
import com.kokoo.abai.core.enums.PlayerType
import org.jetbrains.exposed.sql.ResultRow
import java.time.LocalDateTime

data class MatchPositionRow(
    val id: Long = 0,
    val memberId: Long?,
    val matchFormationId: Long,
    val position: Int,
    val playerType: PlayerType,
    val playerName: String,
    val createdAt: LocalDateTime? = LocalDateTime.now(),
    val updatedAt: LocalDateTime? = LocalDateTime.now()
)

fun ResultRow.toMatchPositionRow() = MatchPositionRow(
    id = this[MatchPosition.id],
    memberId = this[MatchPosition.memberId],
    matchFormationId = this[MatchPosition.matchFormationId],
    position = this[MatchPosition.position],
    playerType = this[MatchPosition.playerType],
    playerName = this[MatchPosition.playerName],
    createdAt = this[MatchPosition.createdAt],
    updatedAt = this[MatchPosition.updatedAt]
) 