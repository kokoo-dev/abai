package com.kokoo.abai.core.row

import com.kokoo.abai.core.domain.Guest
import com.kokoo.abai.core.domain.MatchGuest
import org.jetbrains.exposed.sql.ResultRow
import java.time.LocalDateTime

data class MatchGuestRow(
    val id: Long = 0,
    val matchId: Long,
    val guestId: String,
    val goalsFor: Int = 0,
    val createdAt: LocalDateTime? = LocalDateTime.now(),
    val updatedAt: LocalDateTime? = LocalDateTime.now(),
    val guest: GuestRow? = null
)

fun ResultRow.toMatchGuestRow() = MatchGuestRow(
    id = this[MatchGuest.id],
    matchId = this[MatchGuest.matchId],
    guestId = this[MatchGuest.guestId],
    goalsFor = this[MatchGuest.goalsFor],
    createdAt = this[MatchGuest.createdAt],
    updatedAt = this[MatchGuest.updatedAt],
    guest = this.let {
        if (this.hasValue(Guest.id)) {
            this.toGuestRow()
        } else {
            null
        }
    }
) 