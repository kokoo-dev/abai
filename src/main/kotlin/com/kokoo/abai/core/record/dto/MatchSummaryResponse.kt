package com.kokoo.abai.core.record.dto

import com.kokoo.abai.core.record.row.MatchSummaryRow

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