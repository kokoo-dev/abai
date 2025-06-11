package com.kokoo.abai.core.notice.dto

import com.kokoo.abai.core.notice.row.NoticeRow
import jakarta.validation.constraints.NotBlank

data class NoticeRequest(
    val categoryId: Long,

    @field:NotBlank
    val title: String,

    @field:NotBlank
    val content: String
)

fun NoticeRequest.toRow(memberId: Long) = NoticeRow(
    memberId = memberId,
    categoryId = this.categoryId,
    title = this.title,
    content = this.content
)