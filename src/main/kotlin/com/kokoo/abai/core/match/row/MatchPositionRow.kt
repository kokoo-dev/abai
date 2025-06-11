package com.kokoo.abai.core.match.row

import com.kokoo.abai.core.match.domain.MatchPosition
import com.kokoo.abai.core.match.enums.PlayerType
import org.jetbrains.exposed.sql.ResultRow
import java.time.LocalDateTime

data class MatchPositionRow(
    val id: Long = 0,
    val memberId: Long?,
    val guestId: String?,
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
    guestId = this[MatchPosition.guestId],
    matchFormationId = this[MatchPosition.matchFormationId],
    position = this[MatchPosition.position],
    playerType = this[MatchPosition.playerType],
    playerName = this[MatchPosition.playerName],
    createdAt = this[MatchPosition.createdAt],
    updatedAt = this[MatchPosition.updatedAt]
) 