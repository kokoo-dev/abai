package com.kokoo.abai.core.guest.dto

import com.kokoo.abai.core.guest.row.GuestRow
import com.kokoo.abai.core.member.enums.Position

data class GuestResponse(
    val id: String,
    val name: String,
    var positions: List<Position> = emptyList()
)

fun GuestRow.toResponse() = GuestResponse(
    id = this.id,
    name = this.name
)