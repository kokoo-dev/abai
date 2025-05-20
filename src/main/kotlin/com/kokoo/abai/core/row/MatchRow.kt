package com.kokoo.abai.core.row

import com.kokoo.abai.core.domain.Match
import com.kokoo.abai.core.enums.MatchResult
import com.kokoo.abai.core.enums.MatchStatus
import org.jetbrains.exposed.sql.ResultRow
import java.math.BigDecimal
import java.time.LocalDateTime

data class MatchRow(
    val id: Long = 0,
    val matchAt: LocalDateTime,
    val opponentName: String,
    val location: String,
    val address: String,
    val longitude: BigDecimal,
    val latitude: BigDecimal,
    val status: MatchStatus,
    val result: MatchResult,
    val goalsFor: Int,
    val goalsAgainst: Int,
    val createdAt: LocalDateTime? = LocalDateTime.now(),
    val updatedAt: LocalDateTime? = LocalDateTime.now()
)

fun ResultRow.toMatchRow() = MatchRow(
    id = this[Match.id],
    matchAt = this[Match.matchAt],
    opponentName = this[Match.opponentName],
    location = this[Match.location],
    address = this[Match.address],
    longitude = this[Match.longitude],
    latitude = this[Match.latitude],
    status = this[Match.status],
    result = this[Match.result],
    goalsFor = this[Match.goalsFor],
    goalsAgainst = this[Match.goalsAgainst],
    createdAt = this[Match.createdAt],
    updatedAt = this[Match.updatedAt]
) 