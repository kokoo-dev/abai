package com.kokoo.abai.core.row

import com.kokoo.abai.core.domain.MatchMember
import com.kokoo.abai.core.domain.Member
import org.jetbrains.exposed.sql.QueryAlias
import org.jetbrains.exposed.sql.ResultRow

data class AssistRankRow(
    val memberId: Long,
    val name: String,
    val assist: Int
)

fun ResultRow.toAssistRankRow(assistRank: QueryAlias) = AssistRankRow(
    memberId = this[Member.id],
    name = this[Member.name],
    assist = this[assistRank[MatchMember.assistSum]] ?: 0
)