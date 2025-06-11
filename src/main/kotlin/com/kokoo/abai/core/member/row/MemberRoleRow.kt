package com.kokoo.abai.core.member.row

import com.kokoo.abai.core.member.domain.MemberRole
import com.kokoo.abai.core.member.enums.RoleId
import org.jetbrains.exposed.sql.ResultRow

data class MemberRoleRow(
    val memberId: Long,
    val roleId: RoleId
)

fun ResultRow.toMemberRoleRow() = MemberRoleRow(
    memberId = this[MemberRole.memberId],
    roleId = this[MemberRole.roleId]
)