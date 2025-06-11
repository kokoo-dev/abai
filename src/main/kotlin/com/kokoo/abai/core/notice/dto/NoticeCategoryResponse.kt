package com.kokoo.abai.core.notice.dto

import com.kokoo.abai.core.notice.enums.NoticeCategoryMarkColor
import com.kokoo.abai.core.notice.row.NoticeCategoryRow

data class NoticeCategoryResponse(
    val id: Long,
    val name: String,
    val order: Int,
    val markColor: NoticeCategoryMarkColor
)

fun NoticeCategoryRow.toResponse() = NoticeCategoryResponse(
    id = this.id,
    name = this.name,
    order = this.order,
    markColor = this.markColor
)