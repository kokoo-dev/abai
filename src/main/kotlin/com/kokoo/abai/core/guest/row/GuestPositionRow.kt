package com.kokoo.abai.core.guest.row

import com.kokoo.abai.core.guest.domain.GuestPosition
import com.kokoo.abai.core.member.enums.Position
import org.jetbrains.exposed.sql.ResultRow
import java.time.LocalDateTime

data class GuestPositionRow(
    val id: Long = 0,
    val guestId: String,
    val position: Position,
    val createdAt: LocalDateTime? = LocalDateTime.now(),
    val updatedAt: LocalDateTime? = LocalDateTime.now()
)

fun ResultRow.toGuestPositionRow() = GuestPositionRow(
    id = this[GuestPosition.id],
    guestId = this[GuestPosition.guestId],
    position = this[GuestPosition.position],
    createdAt = this[GuestPosition.createdAt],
    updatedAt = this[GuestPosition.updatedAt]
) 