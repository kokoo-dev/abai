package com.kokoo.abai.core.dto

import com.kokoo.abai.core.enums.Position
import com.kokoo.abai.core.row.MemberRow
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
    val preferredPosition: Position
)

fun MemberRow.toResponse() = MemberResponse(
    id = this.id,
    loginId = this.loginId,
    name = this.name,
    birthday = this.birthday,
    height = this.height,
    weight = this.weight,
    uniformNumber = this.uniformNumber,
    leftFoot = this.leftFoot,
    rightFoot = this.rightFoot,
    preferredPosition = this.preferredPosition
)