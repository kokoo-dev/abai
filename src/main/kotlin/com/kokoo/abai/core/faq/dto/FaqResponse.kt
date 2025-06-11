package com.kokoo.abai.core.faq.dto

import com.kokoo.abai.core.faq.row.FaqRow

data class FaqResponse(
    val id: Long,
    val categoryId: Long,
    val question: String,
    val answer: String
)

fun FaqRow.toResponse() = FaqResponse(
    id = this.id,
    categoryId = this.categoryId,
    question = this.question,
    answer = this.answer
)