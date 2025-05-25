package com.kokoo.abai.core.domain

object MatchGuest : BaseTable("match_guest") {
    val id = long("id").autoIncrement()
    val matchId = reference("match_id", Match.id)
    val guestId = reference("guest_id", Guest.id)
    val goalsFor = integer("goals_for").default(0)

    override val primaryKey = PrimaryKey(id)

    init {
        uniqueIndex(matchId, guestId)
    }
}