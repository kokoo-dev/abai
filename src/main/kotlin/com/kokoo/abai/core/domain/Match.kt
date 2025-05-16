package com.kokoo.abai.core.domain

import com.kokoo.abai.core.enums.MatchResult
import com.kokoo.abai.core.enums.MatchStatus
import org.jetbrains.exposed.sql.javatime.datetime

object Match : BaseTable("match") {
    val id = long("id").autoIncrement()
    val matchAt = datetime("match_at")
    val opponentName = varchar("opponent_name", 30)
    val location = varchar("location", 50)
    val address = varchar("address", 100)
    val status = enumerationByName("status", 30, MatchStatus::class).default(MatchStatus.READY)
    val result = enumerationByName("result", 30, MatchResult::class).default(MatchResult.READY)
    val goalsFor = integer("goals_for").default(0)
    val goalsAgainst = integer("goals_against").default(0)

    override val primaryKey = PrimaryKey(id)
}