package com.kokoo.abai.core.domain

import com.kokoo.abai.core.enums.RoleId

object Role : BaseTable("role") {
    val id = enumerationByName("id", 30, RoleId::class)

    override val primaryKey = PrimaryKey(id)
}