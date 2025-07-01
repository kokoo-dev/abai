package com.kokoo.abai.core.member.row

import com.kokoo.abai.core.member.domain.Member
import com.kokoo.abai.core.member.domain.LoginHistory
import org.jetbrains.exposed.sql.ResultRow
import java.time.LocalDateTime

data class LoginHistoryRow(
    val id: Long = 0,
    val memberId: Long,
    val ip: String,
    val createdAt: LocalDateTime? = LocalDateTime.now(),
    val updatedAt: LocalDateTime? = LocalDateTime.now(),
    val member: MemberRow? = null
)

fun ResultRow.toLoginHistoryRow() = LoginHistoryRow(
    id = this[LoginHistory.id],
    memberId = this[LoginHistory.memberId],
    ip = this[LoginHistory.ip],
    createdAt = this[LoginHistory.createdAt],
    updatedAt = this[LoginHistory.updatedAt],
    member = this.let {
        if (this.hasValue(Member.id)) {
            this.toMemberRow()
        } else {
            null
        }
    }
) 