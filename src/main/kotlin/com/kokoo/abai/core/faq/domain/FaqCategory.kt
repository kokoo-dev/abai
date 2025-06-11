package com.kokoo.abai.core.faq.domain

import com.kokoo.abai.core.common.domain.BaseTable

object FaqCategory : BaseTable("faq_category") {
    val id = long("id").autoIncrement()
    val name = varchar("name", 50)
    val order = integer("order").default(1)

    override val primaryKey = PrimaryKey(id)
} 