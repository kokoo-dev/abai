package com.kokoo.abai.core.guest.row

import com.kokoo.abai.core.guest.domain.Guest
import org.jetbrains.exposed.sql.ResultRow
import java.time.LocalDateTime
import java.util.*

data class GuestRow(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val createdAt: LocalDateTime? = LocalDateTime.now(),
    val updatedAt: LocalDateTime? = LocalDateTime.now()
)

fun ResultRow.toGuestRow() = GuestRow(
    id = this[Guest.id],
    name = this[Guest.name],
    createdAt = this[Guest.createdAt],
    updatedAt = this[Guest.updatedAt]
) 