package com.kokoo.abai.core.member.dto

import com.kokoo.abai.core.member.row.MemberRow
import java.time.LocalDate

data class MemberResponse(
    val id: Long,
    val loginId: String,
    val name: String,
    val birthday: LocalDate,
    val height: Int,
    val weight: Int,
    val uniformNumber: Int,
    val leftFoot: Int,
    val rightFoot: Int,
    val positions: List<MemberPositionResponse> = emptyList(),
    var attribute: MemberAttributeResponse? = null
)

fun MemberRow.toResponse(positions: List<MemberPositionResponse> = emptyList()) = MemberResponse(
    id = this.id,
    loginId = this.loginId,
    name = this.name,
    birthday = this.birthday,
    height = this.height,
    weight = this.weight,
    uniformNumber = this.uniformNumber,
    leftFoot = this.leftFoot,
    rightFoot = this.rightFoot,
    positions = positions
)