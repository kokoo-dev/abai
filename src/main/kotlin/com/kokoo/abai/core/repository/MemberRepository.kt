package com.kokoo.abai.core.repository

import com.kokoo.abai.core.domain.Member
import org.jetbrains.exposed.sql.ResultRow
import org.springframework.stereotype.Repository

@Repository
class MemberRepository {
    fun findByLoginId(loginId: String): ResultRow? {
        return Member.select(Member.columns)
            .where { Member.loginId.eq(loginId) }
            .singleOrNull()
    }
}