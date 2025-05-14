package com.kokoo.abai.core.domain

object NoticeCategory : BaseTable("notice_category") {
    val id = long("id").autoIncrement()
    val name = varchar("name", 50)
    val order = integer("order").default(1)

    override val primaryKey = PrimaryKey(id)
} 