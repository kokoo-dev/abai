package com.kokoo.abai.core.dto

import com.kokoo.abai.core.row.MatchSummaryRow

data class MatchSummaryResponse(
    val matchCount: Long,
    val goalsFor: Int,
    val goalsAgainst: Int,
    val assist: Int
)

fun MatchSummaryRow.toResponse() = MatchSummaryResponse(
    matchCount = this.matchCount,
    goalsFor = this.goalsFor,
    goalsAgainst = this.goalsAgainst,
    assist = this.assist
)