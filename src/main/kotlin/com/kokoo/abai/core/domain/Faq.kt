package com.kokoo.abai.core.domain

object Faq : BaseTable("faq") {
    val id = long("id").autoIncrement()
    val categoryId = reference("category_id", FaqCategory.id)
    val question = varchar("question", 100)
    val answer = text("answer")

    override val primaryKey = PrimaryKey(Match.id)
} 