package com.kokoo.abai.core.notice.row

import com.kokoo.abai.core.notice.domain.Notice
import com.kokoo.abai.core.member.row.MemberRow
import com.kokoo.abai.core.member.row.toMemberRow
import org.jetbrains.exposed.sql.ResultRow
import java.time.LocalDateTime

data class NoticeRow(
    val id: Long = 0,
    val memberId: Long,
    val member: MemberRow? = null,
    val categoryId: Long,
    val category: NoticeCategoryRow? = null,
    val title: String,
    val content: String,
    val viewCount: Int = 0,
    val createdAt: LocalDateTime? = LocalDateTime.now(),
    val updatedAt: LocalDateTime? = LocalDateTime.now()
)

fun ResultRow.toNoticeRow() = NoticeRow(
    id = this[Notice.id],
    memberId = this[Notice.memberId],
    member = this.toMemberRow(),
    categoryId = this[Notice.categoryId],
    category = this.toNoticeCategoryRow(),
    title = this[Notice.title],
    content = this[Notice.content],
    viewCount = this[Notice.viewCount],
    createdAt = this[Notice.createdAt],
    updatedAt = this[Notice.updatedAt]
) 