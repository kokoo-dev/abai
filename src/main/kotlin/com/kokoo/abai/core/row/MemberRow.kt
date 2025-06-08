package com.kokoo.abai.core.row

import com.kokoo.abai.core.domain.Member
import org.jetbrains.exposed.sql.ResultRow
import java.time.LocalDate

data class MemberRow(
    val id: Long = 0,
    val loginId: String,
    val password: String,
    val name: String,
    val birthday: LocalDate,
    val height: Int,
    val weight: Int,
    val uniformNumber: Int,
    val leftFoot: Int,
    val rightFoot: Int
)

fun ResultRow.toMemberRow() = MemberRow(
    id = this[Member.id],
    loginId = this[Member.loginId],
    password = this[Member.password],
    name = this[Member.name],
    birthday = this[Member.birthday],
    height = this[Member.height],
    weight = this[Member.weight],
    uniformNumber = this[Member.uniformNumber],
    leftFoot = this[Member.leftFoot],
    rightFoot = this[Member.rightFoot]
)