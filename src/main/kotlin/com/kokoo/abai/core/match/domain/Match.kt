package com.kokoo.abai.core.match.domain

import com.kokoo.abai.core.common.domain.BaseTable
import com.kokoo.abai.core.match.enums.MatchResult
import com.kokoo.abai.core.match.enums.MatchStatus
import org.jetbrains.exposed.sql.alias
import org.jetbrains.exposed.sql.count
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.sum

object Match : BaseTable("match") {
    val id = long("id").autoIncrement()
    val matchAt = datetime("match_at")
    val opponentName = varchar("opponent_name", 30)
    val location = varchar("location", 50)
    val address = varchar("address", 100)
    val longitude = decimal("longitude", 9, 6)
    val latitude = decimal("latitude", 9, 6)
    val status = enumerationByName("status", 30, MatchStatus::class).default(MatchStatus.READY)
    val result = enumerationByName("result", 30, MatchResult::class).default(MatchResult.READY)
    val goalsFor = integer("goals_for").default(0)
    val goalsAgainst = integer("goals_against").default(0)
    val assist = integer("assist").default(0)
    val deleted = bool("deleted").default(false)

    override val primaryKey = PrimaryKey(id)

    init {
        index(isUnique = false, matchAt)
    }

    val idCount = id.count().alias("id_count")
    val goalsForSum = goalsFor.sum().alias("goals_for")
    val goalsAgainstSum = goalsAgainst.sum().alias("goals_against")
    val assistSum = assist.sum().alias("assist")
}