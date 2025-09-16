package com.kokoo.abai.core.match.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.kokoo.abai.core.match.enums.MatchStatus
import com.kokoo.abai.core.match.enums.MatchResult
import com.kokoo.abai.core.match.row.MatchRow
import jakarta.validation.constraints.NotEmpty
import java.math.BigDecimal
import java.time.OffsetDateTime

data class MatchRequest(
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    val matchAt: OffsetDateTime,
    val opponentName: String,
    val location: String,
    val address: String,
    val longitude: BigDecimal,
    val latitude: BigDecimal,
    val status: MatchStatus = MatchStatus.READY,
    val result: MatchResult = MatchResult.READY,
    val goalsFor: Int = 0,
    val goalsAgainst: Int = 0,
    val opponentOwnGoal: Int = 0,
    val assist: Int = 0,
    val formations: List<MatchFormationRequest> = emptyList(),

    @field:NotEmpty
    val members: List<Long> = emptyList(),
    val guests: List<String> = emptyList()
)

fun MatchRequest.toRow() = MatchRow(
    matchAt = this.matchAt.toLocalDateTime(),
    opponentName = this.opponentName,
    location = this.location,
    address = this.address,
    longitude = this.longitude,
    latitude = this.latitude,
    status = this.status,
    result = this.result,
    goalsFor = this.goalsFor,
    goalsAgainst = this.goalsAgainst,
    opponentOwnGoal = this.opponentOwnGoal,
    assist = this.assist,
)