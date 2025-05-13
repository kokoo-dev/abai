package com.kokoo.abai.core.row

import com.kokoo.abai.core.domain.MemberRole
import com.kokoo.abai.core.enums.RoleId
import org.jetbrains.exposed.sql.ResultRow

data class MemberRoleRow(
    val memberId: Long,
    val roleId: RoleId
)

fun ResultRow.toMemberRoleRow() = MemberRoleRow(
    memberId = this[MemberRole.memberId],
    roleId = this[MemberRole.roleId]
)