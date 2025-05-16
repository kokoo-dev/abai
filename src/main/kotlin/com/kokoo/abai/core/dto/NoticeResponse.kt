package com.kokoo.abai.core.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.kokoo.abai.core.row.NoticeRow
import java.time.OffsetDateTime
import java.time.ZoneOffset

data class NoticeResponse(
    val id: Long,
    val memberId: Long,
    val member: MemberResponse?,
    val categoryId: Long,
    val category: NoticeCategoryResponse?,
    val title: String,
    val content: String,
    val viewCount: Int,

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    val createdAt: OffsetDateTime = OffsetDateTime.now(),
)

fun NoticeRow.toResponse() = NoticeResponse(
    id = this.id,
    memberId = this.memberId,
    member = this.member?.toResponse(),
    categoryId = this.categoryId,
    category = this.category?.toResponse(),
    title = this.title,
    content = this.content,
    viewCount = this.viewCount,
    createdAt = this.createdAt!!.atOffset(ZoneOffset.UTC)
)