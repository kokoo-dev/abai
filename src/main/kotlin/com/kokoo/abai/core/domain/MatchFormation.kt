package com.kokoo.abai.core.domain

object MatchFormation : BaseTable("match_formation") {
    val id = long("id").autoIncrement()
    val matchId = reference("match_id", Match.id)
    val quarter = integer("quarter")
    val formation = varchar("formation", 50)

    override val primaryKey = PrimaryKey(id)
}