package com.kokoo.abai.core.dto

import com.kokoo.abai.core.row.NoticeRow
import java.time.LocalDateTime

data class NoticeResponse(
    val id: Long,
    val memberId: Long,
    val member: MemberResponse?,
    val categoryId: Long,
    val category: NoticeCategoryResponse?,
    val title: String,
    val content: String,
    val viewCount: Int,
    val createdAt: LocalDateTime = LocalDateTime.now(),
)

fun NoticeRow.toResponse() = NoticeResponse(
    id = this.id!!,
    memberId = this.memberId,
    member = this.member?.toResponse(),
    categoryId = this.categoryId,
    category = this.category?.toResponse(),
    title = this.title,
    content = this.content,
    viewCount = this.viewCount,
    createdAt = this.createdAt!!
)