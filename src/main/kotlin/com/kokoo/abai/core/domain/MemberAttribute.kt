package com.kokoo.abai.core.domain

import org.jetbrains.exposed.sql.ReferenceOption

object MemberAttribute : BaseTable("member_attribute") {
    val id = long("id").references(Member.id, onDelete = ReferenceOption.CASCADE)
    val speed = integer("speed")
    val shooting = integer("shooting")
    val pass = integer("pass")
    val dribble = integer("dribble")
    val defence = integer("defence")
    val stamina = integer("stamina")

    override val primaryKey = PrimaryKey(id)
}