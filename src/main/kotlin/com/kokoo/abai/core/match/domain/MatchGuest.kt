package com.kokoo.abai.core.match.domain

import com.kokoo.abai.core.common.domain.BaseTable
import com.kokoo.abai.core.guest.domain.Guest

object MatchGuest : BaseTable("match_guest") {
    val id = long("id").autoIncrement()
    val matchId = reference("match_id", Match.id)
    val guestId = reference("guest_id", Guest.id)
    val goalsFor = integer("goals_for").default(0)
    val assist = integer("assist").default(0)

    override val primaryKey = PrimaryKey(id)

    init {
        uniqueIndex(matchId, guestId)
    }
}