package com.kokoo.abai.core.domain

import com.kokoo.abai.core.enums.PositionType

object MatchPosition : BaseTable("match_position") {
    val id = long("id").autoIncrement()
    val memberId = reference("member_id", Member.id).nullable()
    val matchFormationId = reference("match_formation_id", MatchFormation.id)
    val positionType = enumerationByName("position_type", 30, PositionType::class)
    val position = integer("position")
    val playerName = varchar("player_name", 50)

    override val primaryKey = PrimaryKey(id)
}