package com.kokoo.abai.core.row

import com.kokoo.abai.core.domain.Role
import com.kokoo.abai.core.enums.RoleId
import org.jetbrains.exposed.sql.ResultRow

data class RoleRow(
    val role: RoleId
)

fun ResultRow.toRoleRow() = RoleRow(
    role = this[Role.id]
)