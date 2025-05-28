package com.kokoo.abai.core.dto

import com.kokoo.abai.core.row.MatchFormationRow

data class MatchFormationResponse(
    val id: Long,
    val matchId: Long,
    val quarter: Int,
    val formation: String,
    val goalsFor: Int,
    val goalsAgainst: Int,
    var positions: List<MatchPositionResponse> = emptyList()
)

fun MatchFormationRow.toResponse() = MatchFormationResponse(
    id = this.id,
    matchId = this.matchId,
    quarter = this.quarter,
    formation = this.formation,
    goalsFor = this.goalsFor,
    goalsAgainst = this.goalsAgainst
)