package com.kokoo.abai.core.domain

import com.kokoo.abai.core.enums.RoleName

object Role : BaseTable("role") {
    val role = enumerationByName("role", 30, RoleName::class)

    override val primaryKey = PrimaryKey(role)
}