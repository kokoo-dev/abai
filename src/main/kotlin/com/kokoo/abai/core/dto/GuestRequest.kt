package com.kokoo.abai.core.dto

import com.kokoo.abai.core.row.GuestRow
import jakarta.validation.constraints.NotBlank

data class GuestRequest(
    @field:NotBlank
    val name: String
)

fun GuestRequest.toRow() = GuestRow(
    name = this.name
)