package com.kokoo.abai.core.notice.domain

import com.kokoo.abai.core.common.domain.BaseTable
import com.kokoo.abai.core.notice.enums.NoticeCategoryMarkColor

object NoticeCategory : BaseTable("notice_category") {
    val id = long("id").autoIncrement()
    val name = varchar("name", 50)
    val order = integer("order").default(1)
    val markColor = enumerationByName("mark_color", 30, NoticeCategoryMarkColor::class).default(
        NoticeCategoryMarkColor.BLUE)

    override val primaryKey = PrimaryKey(id)
} 