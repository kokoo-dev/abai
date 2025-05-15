package com.kokoo.abai.core.domain

import com.kokoo.abai.core.enums.NoticeCategoryMarkColor

object NoticeCategory : BaseTable("notice_category") {
    val id = long("id").autoIncrement()
    val name = varchar("name", 50)
    val order = integer("order").default(1)
    val markColor = enumerationByName("mark_color", 30, NoticeCategoryMarkColor::class).default(
        NoticeCategoryMarkColor.BLUE)

    override val primaryKey = PrimaryKey(id)
} 