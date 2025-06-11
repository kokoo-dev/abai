package com.kokoo.abai.core.match.domain

import com.kokoo.abai.core.common.domain.BaseTable
import com.kokoo.abai.core.member.domain.Member
import org.jetbrains.exposed.sql.alias
import org.jetbrains.exposed.sql.count
import org.jetbrains.exposed.sql.sum

object MatchMember : BaseTable("match_member") {
    val id = long("id").autoIncrement()
    val matchId = reference("match_id", Match.id)
    val memberId = reference("member_id", Member.id)
    val goalsFor = integer("goals_for").default(0)
    val assist = integer("assist").default(0)

    override val primaryKey = PrimaryKey(id)

    init {
        uniqueIndex(matchId, memberId)
    }

    val idCount = id.count().alias("id_count")
    val goalsForSum = goalsFor.sum().alias("goals_for")
    val assistSum = assist.sum().alias("assist")
}