package com.kokoo.abai.core.dto

import com.kokoo.abai.core.row.GoalRankRow

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