package com.kokoo.abai.core.member.dto

import com.kokoo.abai.core.member.enums.Position
import com.kokoo.abai.core.member.row.MemberPositionRow

data class MemberPositionResponse(
    val id: Long,
    val memberId: Long,
    val position: Position
)

fun MemberPositionRow.toResponse() = MemberPositionResponse(
    id = this.id,
    memberId = this.memberId,
    position = this.position
)