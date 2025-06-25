package com.kokoo.abai.core.member.row

import com.kokoo.abai.core.member.domain.Member
import com.kokoo.abai.core.member.enums.MemberStatus
import org.jetbrains.exposed.sql.ResultRow
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import java.time.LocalDate

data class MemberRow(
    val id: Long = 0,
    val loginId: String,
    var password: String,
    val name: String,
    val status: MemberStatus,
    val birthday: LocalDate,
    val height: Int,
    val weight: Int,
    val uniformNumber: Int,
    val leftFoot: Int,
    val rightFoot: Int
) {
    fun matchPassword(password: String) = BCryptPasswordEncoder().matches(password, this.password)
}

fun ResultRow.toMemberRow() = MemberRow(
    id = this[Member.id],
    loginId = this[Member.loginId],
    password = this[Member.password],
    name = this[Member.name],
    status = this[Member.status],
    birthday = this[Member.birthday],
    height = this[Member.height],
    weight = this[Member.weight],
    uniformNumber = this[Member.uniformNumber],
    leftFoot = this[Member.leftFoot],
    rightFoot = this[Member.rightFoot]
)