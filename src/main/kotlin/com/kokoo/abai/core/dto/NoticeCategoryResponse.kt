package com.kokoo.abai.core.dto

import com.kokoo.abai.core.enums.NoticeCategoryMarkColor
import com.kokoo.abai.core.row.NoticeCategoryRow
import java.time.LocalDateTime

data class NoticeCategoryResponse(
    val id: Long,
    val name: String,
    val order: Int,
    val markColor: NoticeCategoryMarkColor,
    val createdAt: LocalDateTime = LocalDateTime.now(),
)

fun NoticeCategoryRow.toResponse() = NoticeCategoryResponse(
    id = this.id,
    name = this.name,
    order = this.order,
    markColor = this.markColor,
    createdAt = this.createdAt
)