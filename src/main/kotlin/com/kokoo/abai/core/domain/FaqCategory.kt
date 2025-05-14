package com.kokoo.abai.core.domain

object FaqCategory : BaseTable("faq_category") {
    val id = long("id").autoIncrement()
    val name = varchar("name", 50)

    override val primaryKey = PrimaryKey(id)
} 