package com.kokoo.abai.core.member.repository

import com.kokoo.abai.core.member.domain.MemberRole
import com.kokoo.abai.core.member.domain.Role
import com.kokoo.abai.core.member.row.MemberRoleRow
import com.kokoo.abai.core.member.row.toMemberRoleRow
import org.springframework.stereotype.Repository

@Repository
class MemberRoleRepository {
    fun findByMemberId(memberId: Long): List<MemberRoleRow> {
        return MemberRole.innerJoin(Role)
            .select(MemberRole.columns)
            .where { MemberRole.memberId.eq(memberId) }
            .map { it.toMemberRoleRow() }
    }
}