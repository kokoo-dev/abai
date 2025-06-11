package com.kokoo.abai.core.record.row

import com.kokoo.abai.core.match.domain.MatchMember
import com.kokoo.abai.core.member.domain.Member
import org.jetbrains.exposed.sql.QueryAlias
import org.jetbrains.exposed.sql.ResultRow

data class GoalRankRow(
    val memberId: Long,
    val name: String,
    val goalsFor: Int
)

fun ResultRow.toGoalRankRow(goalRank: QueryAlias) = GoalRankRow(
    memberId = this[Member.id],
    name = this[Member.name],
    goalsFor = this[goalRank[MatchMember.goalsForSum]] ?: 0
)