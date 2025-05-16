package com.kokoo.abai.core.dto

import com.kokoo.abai.core.enums.MatchResult
import com.kokoo.abai.core.enums.MatchStatus
import com.kokoo.abai.core.row.MatchRow
import java.time.LocalDateTime

data class MatchResponse(
    val id: Long,
    val matchAt: LocalDateTime,
    val opponentName: String,
    val location: String,
    val address: String,
    val status: MatchStatus,
    val result: MatchResult,
    val goalsFor: Int,
    val goalsAgainst: Int,
)

fun MatchRow.toResponse() = MatchResponse(
    id = this.id,
    matchAt = this.matchAt,
    opponentName = this.opponentName,
    location = this.location,
    address = this.address,
    status = this.status,
    result = this.result,
    goalsFor = this.goalsFor,
    goalsAgainst = this.goalsAgainst
)