package com.kokoo.abai.core.row

import com.kokoo.abai.core.domain.Match
import org.jetbrains.exposed.sql.ResultRow

data class MatchSummaryRow(
    val matchCount: Long,
    val goalsFor: Int,
    val goalsAgainst: Int,
    val assist: Int
)

fun ResultRow.toMatchSummaryRow() = MatchSummaryRow(
    matchCount = this[Match.idCount],
    goalsFor = this[Match.goalsForSum] ?: 0,
    goalsAgainst = this[Match.goalsAgainstSum] ?: 0,
    assist = this[Match.assistSum] ?: 0
)