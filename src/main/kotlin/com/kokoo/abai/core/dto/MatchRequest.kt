package com.kokoo.abai.core.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.kokoo.abai.core.enums.MatchResult
import com.kokoo.abai.core.enums.MatchStatus
import com.kokoo.abai.core.row.MatchRow
import jakarta.validation.constraints.NotEmpty
import java.time.OffsetDateTime

data class MatchRequest(
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    val matchAt: OffsetDateTime,
    val opponentName: String,
    val location: String,
    val address: String,
    val status: MatchStatus = MatchStatus.READY,
    val result: MatchResult = MatchResult.READY,
    val goalsFor: Int,
    val goalsAgainst: Int,
    val formations: List<MatchFormationRequest> = emptyList(),

    @field:NotEmpty
    val members: List<Long> = emptyList()
)

fun MatchRequest.toRow() = MatchRow(
    matchAt = this.matchAt.toLocalDateTime(),
    opponentName = this.opponentName,
    location = this.location,
    address = this.address,
    status = this.status,
    result = this.result,
    goalsFor = this.goalsFor,
    goalsAgainst = this.goalsAgainst
)