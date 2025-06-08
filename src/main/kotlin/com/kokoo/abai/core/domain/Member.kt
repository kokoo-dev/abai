package com.kokoo.abai.core.domain

import com.kokoo.abai.core.enums.MemberStatus
import org.jetbrains.exposed.sql.javatime.date

object Member : BaseTable("member") {
    val id = long("id").autoIncrement()
    val loginId = varchar("login_id", 50).uniqueIndex()
    val password = varchar("password", 100)
    val name = varchar("name", 50)
    val status = enumerationByName("status", 30, MemberStatus::class).default(MemberStatus.ACTIVATED)
    val birthday = date("birthday")
    val height = integer("height")
    val weight = integer("weight")
    val uniformNumber = integer("uniform_number")
    val leftFoot = integer("left_foot")
    val rightFoot = integer("right_foot")

    override val primaryKey = PrimaryKey(id)

}