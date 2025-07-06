package com.kokoo.abai.core.match.row

import com.kokoo.abai.core.match.domain.Match
import com.kokoo.abai.core.match.enums.MatchStatus
import com.kokoo.abai.core.match.enums.MatchResult
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
    var status: MatchStatus,
    var result: MatchResult,
    var goalsFor: Int,
    var goalsAgainst: Int,
    var assist: Int,
    val deleted: Boolean = false,
    var totalMemberCount: Int = 0,
    val createdAt: LocalDateTime? = LocalDateTime.now(),
    val updatedAt: LocalDateTime? = LocalDateTime.now()
) {
    fun end(goalsFor: Int, goalsAgainst: Int, assist: Int) {
        this.status = MatchStatus.COMPLETED
        this.goalsFor = goalsFor
        this.goalsAgainst = goalsAgainst
        this.assist = assist

        this.result = when {
            goalsFor > goalsAgainst -> MatchResult.VICTORY
            goalsFor < goalsAgainst -> MatchResult.DEFEAT
            else -> MatchResult.DRAW
        }
    }
}

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
    assist = this[Match.assist],
    totalMemberCount = this[Match.totalMemberCount],
    createdAt = this[Match.createdAt],
    updatedAt = this[Match.updatedAt]
) 