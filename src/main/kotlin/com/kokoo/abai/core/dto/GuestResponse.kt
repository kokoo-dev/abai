package com.kokoo.abai.core.dto

import com.kokoo.abai.core.row.GuestRow

data class GuestResponse(
    val id: String,
    val name: String
)

fun GuestRow.toResponse() = GuestResponse(
    id = this.id,
    name = this.name
)