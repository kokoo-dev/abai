package com.kokoo.abai.core.row

import com.kokoo.abai.core.domain.MatchFormation
import org.jetbrains.exposed.sql.ResultRow
import java.time.LocalDateTime

data class MatchFormationRow(
    val id: Long = 0,
    val matchId: Long,
    val quarter: Int,
    val formation: String,
    val goalsFor: Int,
    val goalsAgainst: Int,
    val createdAt: LocalDateTime? = LocalDateTime.now(),
    val updatedAt: LocalDateTime? = LocalDateTime.now()
)

fun ResultRow.toMatchFormationRow() = MatchFormationRow(
    id = this[MatchFormation.id],
    matchId = this[MatchFormation.matchId],
    quarter = this[MatchFormation.quarter],
    formation = this[MatchFormation.formation],
    goalsFor = this[MatchFormation.goalsFor],
    goalsAgainst = this[MatchFormation.goalsAgainst],
    createdAt = this[MatchFormation.createdAt],
    updatedAt = this[MatchFormation.updatedAt]
) 