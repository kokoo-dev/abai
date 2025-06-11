package com.kokoo.abai.core.member.domain

import com.kokoo.abai.core.common.domain.BaseTable

object MemberRole : BaseTable("member_role") {
    val memberId = reference("member_id", Member.id)
    val roleId = reference("role_id", Role.id)
}