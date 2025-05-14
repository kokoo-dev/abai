package com.kokoo.abai.core.dto

import com.kokoo.abai.core.row.FaqRow
import java.time.LocalDateTime

data class FaqResponse(
    val id: Long,
    val categoryId: Long,
    val question: String,
    val answer: String,
    val createdAt: LocalDateTime = LocalDateTime.now(),
)

fun FaqRow.toResponse() = FaqResponse(
    id = this.id,
    categoryId = this.categoryId,
    question = this.question,
    answer = this.answer,
    createdAt = this.createdAt
)