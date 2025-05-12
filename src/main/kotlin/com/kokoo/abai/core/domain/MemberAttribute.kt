package com.kokoo.abai.core.domain

import org.jetbrains.exposed.sql.ReferenceOption

object MemberAttribute : BaseTable("member_attribute") {
    val id = long("id").references(Member.id, onDelete = ReferenceOption.CASCADE)
    val speed = uinteger("speed")
    val shooting = uinteger("shooting")
    val pass = uinteger("pass")
    val dribble = uinteger("dribble")
    val defence = uinteger("defence")
    val stamina = uinteger("stamina")

    override val primaryKey = PrimaryKey(id)
}