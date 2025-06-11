package com.kokoo.abai.core.match.dto

import com.kokoo.abai.core.match.row.MatchFormationRow

data class MatchFormationRequest(
    val quarter: Int,
    val formation: String,
    val goalsFor: Int = 0,
    val goalsAgainst: Int = 0,
    val positions: List<MatchPositionRequest> = emptyList()
)

fun MatchFormationRequest.toRow(matchId: Long) = MatchFormationRow(
    matchId = matchId,
    quarter = this.quarter,
    formation = this.formation,
    goalsFor = this.goalsFor,
    goalsAgainst = this.goalsAgainst
)