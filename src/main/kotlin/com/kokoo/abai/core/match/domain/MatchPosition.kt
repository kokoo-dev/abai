package com.kokoo.abai.core.match.domain

import com.kokoo.abai.core.common.domain.BaseTable
import com.kokoo.abai.core.guest.domain.Guest
import com.kokoo.abai.core.member.domain.Member
import com.kokoo.abai.core.match.enums.PlayerType

object MatchPosition : BaseTable("match_position") {
    val id = long("id").autoIncrement()
    val memberId = reference("member_id", Member.id).nullable()
    val guestId = reference("guest_id", Guest.id).nullable()
    val matchFormationId = reference("match_formation_id", MatchFormation.id)
    val position = integer("position")
    val playerType = enumerationByName("player_type", 30, PlayerType::class).default(PlayerType.MEMBER)
    val playerName = varchar("player_name", 50)

    override val primaryKey = PrimaryKey(id)
}