package com.kokoo.abai.core.member.dto

import com.kokoo.abai.core.member.row.MemberAttributeRow

data class MemberAttributeResponse(
    val id: Long,
    val speed: Int,
    val shooting: Int,
    val pass: Int,
    val dribble: Int,
    val defence: Int,
    val stamina: Int
)

fun MemberAttributeRow.toResponse() = MemberAttributeResponse(
    id = this.id,
    speed = this.speed,
    shooting = this.shooting,
    pass = this.pass,
    dribble = this.dribble,
    defence = this.defence,
    stamina = this.stamina,
)