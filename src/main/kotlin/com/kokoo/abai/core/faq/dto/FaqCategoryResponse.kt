package com.kokoo.abai.core.faq.dto

import com.kokoo.abai.core.faq.row.FaqCategoryRow

data class FaqCategoryResponse(
    val id: Long,
    val name: String,
    val order: Int
)

fun FaqCategoryRow.toResponse() = FaqCategoryResponse(
    id = this.id,
    name = this.name,
    order = this.order
)