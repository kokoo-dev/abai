package com.kokoo.abai.core.member.row

import com.kokoo.abai.core.member.domain.Role
import com.kokoo.abai.core.member.enums.RoleId
import org.jetbrains.exposed.sql.ResultRow

data class RoleRow(
    val role: RoleId
)

fun ResultRow.toRoleRow() = RoleRow(
    role = this[Role.id]
)