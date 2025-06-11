package com.kokoo.abai.core.match.row

import com.kokoo.abai.core.match.domain.MatchMember
import com.kokoo.abai.core.member.domain.Member
import com.kokoo.abai.core.member.row.MemberRow
import com.kokoo.abai.core.member.row.toMemberRow
import org.jetbrains.exposed.sql.ResultRow
import java.time.LocalDateTime

data class MatchMemberRow(
    val id: Long = 0,
    val matchId: Long,
    val memberId: Long,
    val goalsFor: Int = 0,
    val assist: Int = 0,
    val createdAt: LocalDateTime? = LocalDateTime.now(),
    val updatedAt: LocalDateTime? = LocalDateTime.now(),
    val member: MemberRow? = null
)

fun ResultRow.toMatchMemberRow() = MatchMemberRow(
    id = this[MatchMember.id],
    matchId = this[MatchMember.matchId],
    memberId = this[MatchMember.memberId],
    goalsFor = this[MatchMember.goalsFor],
    assist = this[MatchMember.assist],
    createdAt = this[MatchMember.createdAt],
    updatedAt = this[MatchMember.updatedAt],
    member = this.let {
        if (this.hasValue(Member.id)) {
            this.toMemberRow()
        } else {
            null
        }
    }
) 