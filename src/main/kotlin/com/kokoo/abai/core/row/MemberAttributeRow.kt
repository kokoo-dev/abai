package com.kokoo.abai.core.row

import com.kokoo.abai.core.domain.MemberAttribute
import org.jetbrains.exposed.sql.ResultRow

data class MemberAttributeRow(
    val id: Long = 0,
    val speed: Int,
    val shooting: Int,
    val pass: Int,
    val dribble: Int,
    val defence: Int,
    val stamina: Int
)

fun ResultRow.toMemberAttributeRow() = MemberAttributeRow(
    id = this[MemberAttribute.id],
    speed = this[MemberAttribute.speed],
    shooting = this[MemberAttribute.shooting],
    pass = this[MemberAttribute.pass],
    dribble = this[MemberAttribute.dribble],
    defence = this[MemberAttribute.defence],
    stamina = this[MemberAttribute.stamina]
) 