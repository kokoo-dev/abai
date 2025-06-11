package com.kokoo.abai.core.member.domain

import com.kokoo.abai.core.common.domain.BaseTable
import com.kokoo.abai.core.member.enums.RoleId

object Role : BaseTable("role") {
    val id = enumerationByName("id", 30, RoleId::class)

    override val primaryKey = PrimaryKey(id)
}