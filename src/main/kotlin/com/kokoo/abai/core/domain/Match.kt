package com.kokoo.abai.core.domain

import com.kokoo.abai.core.enums.MatchStatus
import org.jetbrains.exposed.sql.javatime.datetime

object Match : BaseTable("match") {
    val id = long("id").autoIncrement()
    val matchAt = datetime("match_at")
    val opponentName = varchar("opponent_name", 30)
    val location = varchar("location", 50)
    val address = varchar("address", 100)
    val status = enumerationByName("status", 30, MatchStatus::class).default(MatchStatus.READY)

    override val primaryKey = PrimaryKey(id)
}