package com.kokoo.abai.core.repository

import com.kokoo.abai.core.domain.MemberRole
import com.kokoo.abai.core.domain.Role
import org.jetbrains.exposed.sql.Query
import org.springframework.stereotype.Repository

@Repository
class MemberRoleRepository {
    fun findByMemberId(memberId: Long): Query {
        return MemberRole.innerJoin(Role)
            .select(MemberRole.columns)
            .where { MemberRole.memberId.eq(memberId) }
    }
}