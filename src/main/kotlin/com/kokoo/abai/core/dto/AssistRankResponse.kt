package com.kokoo.abai.core.dto

import com.kokoo.abai.core.row.AssistRankRow

data class AssistRankResponse(
    val memberId: Long,
    val name: String,
    val assist: Int
)

fun AssistRankRow.toResponse() = AssistRankResponse(
    memberId = this.memberId,
    name = this.name,
    assist = this.assist
)