package com.kokoo.abai.core.domain

object Notice : BaseTable("notice") {
    val id = long("id").autoIncrement()
    val categoryId = reference("category_id", NoticeCategory.id)
    val title = varchar("title", 100)
    val content = text("content")

    override val primaryKey = PrimaryKey(Match.id)
} 