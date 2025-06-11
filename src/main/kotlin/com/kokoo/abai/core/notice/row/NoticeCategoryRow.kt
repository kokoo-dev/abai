package com.kokoo.abai.core.notice.row

import com.kokoo.abai.core.notice.domain.NoticeCategory
import com.kokoo.abai.core.notice.enums.NoticeCategoryMarkColor
import org.jetbrains.exposed.sql.ResultRow
import java.time.LocalDateTime

data class NoticeCategoryRow(
    val id: Long,
    val name: String,
    val order: Int,
    val markColor: NoticeCategoryMarkColor = NoticeCategoryMarkColor.BLUE,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

fun ResultRow.toNoticeCategoryRow() = NoticeCategoryRow(
    id = this[NoticeCategory.id],
    name = this[NoticeCategory.name],
    order = this[NoticeCategory.order],
    markColor = this[NoticeCategory.markColor],
    createdAt = this[NoticeCategory.createdAt],
    updatedAt = this[NoticeCategory.updatedAt]
) 