package com.kokoo.abai.core.guest.dto

import com.kokoo.abai.core.guest.row.GuestRow
import com.kokoo.abai.core.member.enums.Position
import jakarta.validation.constraints.NotBlank

data class GuestRequest(
    @field:NotBlank
    val name: String,

    val positions: List<Position>
)

fun GuestRequest.toRow() = GuestRow(
    name = this.name
)