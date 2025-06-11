package com.kokoo.abai.core.guest.domain

import com.kokoo.abai.core.common.domain.BaseTable

object Guest : BaseTable("guest") {
    val id = varchar("id", 50)
    val name = varchar("name", 50)

    override val primaryKey = PrimaryKey(id)
}