package com.kokoo.abai.core.domain

object Member : BaseTable("member") {
    val id = long("id").autoIncrement()
    val password = varchar("password", 100)
    val name = varchar("name", 50)

    override val primaryKey = PrimaryKey(id)
}