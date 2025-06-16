package com.kokoo.abai.core.member.row

import com.kokoo.abai.core.member.domain.Member
import com.kokoo.abai.core.member.domain.MemberPosition
import com.kokoo.abai.core.member.enums.Position
import org.jetbrains.exposed.sql.ResultRow

data class MemberWithPositionRow(
    val memberId: Long,
    val name: String,
    val uniformNumber: Int,
    val position: Position?
)

fun ResultRow.toMemberWithPositionRow() = MemberWithPositionRow(
    memberId = this[Member.id],
    name = this[Member.name],
    uniformNumber = this[Member.uniformNumber],
    position = this[MemberPosition.position]
) 