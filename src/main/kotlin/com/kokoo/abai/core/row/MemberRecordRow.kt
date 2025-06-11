package com.kokoo.abai.core.row

import com.kokoo.abai.core.domain.MatchMember
import com.kokoo.abai.core.domain.Member
import org.jetbrains.exposed.sql.QueryAlias
import org.jetbrains.exposed.sql.ResultRow

data class MemberRecordRow(
    val memberId: Long,
    val name: String,
    val uniformNumber: Int,
    val matchCount: Long,
    val goalsFor: Int,
    val assist: Int
)

fun ResultRow.toMemberRecordRow(record: QueryAlias) = MemberRecordRow(
    memberId = this[Member.id],
    name = this[Member.name],
    uniformNumber = this[Member.uniformNumber],
    matchCount = this.getOrNull(record[MatchMember.idCount]) ?: 0,
    goalsFor = this[record[MatchMember.goalsForSum]] ?: 0,
    assist = this[record[MatchMember.assistSum]] ?: 0
)