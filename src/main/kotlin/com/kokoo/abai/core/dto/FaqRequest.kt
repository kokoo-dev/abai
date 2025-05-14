package com.kokoo.abai.core.dto

import com.kokoo.abai.core.row.FaqRow
import jakarta.validation.constraints.NotBlank

data class FaqRequest(
    val categoryId: Long,

    @field:NotBlank
    val question: String,

    @field:NotBlank
    val answer: String
)

fun FaqRequest.toRow() = FaqRow(
    categoryId = this.categoryId,
    question = this.question,
    answer = this.answer
)