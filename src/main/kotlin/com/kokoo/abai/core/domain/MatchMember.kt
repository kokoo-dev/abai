package com.kokoo.abai.core.domain

object MatchMember : BaseTable("match_member") {
    val id = long("id").autoIncrement()
    val matchId = reference("match_id", Match.id)
    val memberId = reference("member_id", Member.id)

    override val primaryKey = PrimaryKey(id)

    init {
        uniqueIndex(matchId, memberId)
    }
}