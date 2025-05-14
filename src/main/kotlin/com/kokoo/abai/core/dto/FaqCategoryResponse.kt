package com.kokoo.abai.core.dto

import com.kokoo.abai.core.row.FaqCategoryRow
import java.time.LocalDateTime

data class FaqCategoryResponse(
    val id: Long,
    val name: String,
    val order: Int,
    val createdAt: LocalDateTime = LocalDateTime.now(),
)

fun FaqCategoryRow.toResponse() = FaqCategoryResponse(
    id = this.id,
    name = this.name,
    order = this.order,
    createdAt = this.createdAt
)