package com.kokoo.abai.core.match.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.kokoo.abai.core.match.enums.MatchStatus
import com.kokoo.abai.core.match.enums.MatchResult
import com.kokoo.abai.core.match.row.MatchRow
import java.math.BigDecimal
import java.time.OffsetDateTime
import java.time.ZoneOffset

data class MatchResponse(
    val id: Long,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    val matchAt: OffsetDateTime,
    val opponentName: String,
    val location: String,
    val address: String,
    val longitude: BigDecimal,
    val latitude: BigDecimal,
    val status: MatchStatus,
    val result: MatchResult,
    val goalsFor: Int,
    val goalsAgainst: Int,
    val assist: Int
)

fun MatchRow.toResponse() = MatchResponse(
    id = this.id,
    matchAt = this.matchAt.atOffset(ZoneOffset.UTC),
    opponentName = this.opponentName,
    location = this.location,
    address = this.address,
    longitude = this.longitude,
    latitude = this.latitude,
    status = this.status,
    result = this.result,
    goalsFor = this.goalsFor,
    goalsAgainst = this.goalsAgainst,
    assist = this.assist
)