package com.kokoo.abai.core.record.dto

import com.kokoo.abai.core.record.row.GoalRankRow

data class GoalRankResponse(
    val memberId: Long,
    val name: String,
    val goalsFor: Int
)

fun GoalRankRow.toResponse() = GoalRankResponse(
    memberId = this.memberId,
    name = this.name,
    goalsFor = this.goalsFor
)