package com.kokoo.abai.core.domain

object MemberRole : BaseTable("member_role") {
    val memberId = reference("member_id", Member.id)
    val roleId = reference("role_id", Role.id)
}