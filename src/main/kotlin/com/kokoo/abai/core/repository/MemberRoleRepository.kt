package com.kokoo.abai.core.repository

import com.kokoo.abai.core.domain.MemberRole
import com.kokoo.abai.core.domain.Role
import com.kokoo.abai.core.row.MemberRoleRow
import com.kokoo.abai.core.row.toMemberRoleRow
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