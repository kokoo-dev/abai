package com.kokoo.abai.core.dto

import com.kokoo.abai.core.enums.Position
import com.kokoo.abai.core.row.MemberPositionRow

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