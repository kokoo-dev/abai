package com.kokoo.abai.core.member.dto

import com.kokoo.abai.core.member.enums.Position

data class MemberWithPositionResponse(
    val id: Long,
    val name: String,
    val uniformNumber: Int,
    val positions: List<Position>
)
