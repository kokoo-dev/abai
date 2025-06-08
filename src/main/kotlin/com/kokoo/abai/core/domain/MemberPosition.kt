package com.kokoo.abai.core.domain

import com.kokoo.abai.core.enums.Position

object MemberPosition : BaseTable("member_position") {
    val id = long("id").autoIncrement()
    val memberId = reference("member_id", Member.id)
    val position = enumerationByName("position", 30, Position::class)

    override val primaryKey = PrimaryKey(id)
}