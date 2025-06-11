package com.kokoo.abai.core.guest.dto

import com.kokoo.abai.core.guest.row.GuestRow

data class GuestResponse(
    val id: String,
    val name: String
)

fun GuestRow.toResponse() = GuestResponse(
    id = this.id,
    name = this.name
)