package com.kokoo.abai.core.member.row

import com.kokoo.abai.core.member.domain.Member
import com.kokoo.abai.core.member.domain.MemberPosition
import com.kokoo.abai.core.member.enums.Position
import org.jetbrains.exposed.sql.ResultRow
import java.time.LocalDateTime

data class MemberPositionRow(
    val id: Long = 0,
    val memberId: Long,
    val position: Position,
    val createdAt: LocalDateTime? = LocalDateTime.now(),
    val updatedAt: LocalDateTime? = LocalDateTime.now(),
    val member: MemberRow? = null
)

fun ResultRow.toMemberPositionRow() = MemberPositionRow(
    id = this[MemberPosition.id],
    memberId = this[MemberPosition.memberId],
    position = this[MemberPosition.position],
    createdAt = this[MemberPosition.createdAt],
    updatedAt = this[MemberPosition.updatedAt],
    member = this.let {
        if (this.hasValue(Member.id)) {
            this.toMemberRow()
        } else {
            null
        }
    }
) 