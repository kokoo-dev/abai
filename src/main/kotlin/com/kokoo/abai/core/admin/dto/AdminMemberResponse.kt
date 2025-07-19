package com.kokoo.abai.core.admin.dto

import com.kokoo.abai.core.member.dto.MemberAttributeResponse
import com.kokoo.abai.core.member.dto.MemberPositionResponse
import com.kokoo.abai.core.member.enums.MemberStatus
import com.kokoo.abai.core.member.enums.RoleId
import com.kokoo.abai.core.member.row.MemberRow
import java.time.LocalDate

data class AdminMemberResponse(
    val id: Long,
    val loginId: String,
    val name: String,
    val status: MemberStatus,
    val birthday: LocalDate,
    val height: Int,
    val weight: Int,
    val uniformNumber: Int,
    val leftFoot: Int,
    val rightFoot: Int,
    var positions: List<MemberPositionResponse> = emptyList(),
    var roles: List<RoleId> = emptyList(),
    var attribute: MemberAttributeResponse? = null,
    var isEditable: Boolean = false
)

fun MemberRow.toAdminResponse(
    positions: List<MemberPositionResponse> = emptyList(),
    roles: List<RoleId> = emptyList()
) = AdminMemberResponse(
    id = this.id,
    loginId = this.loginId,
    name = this.name,
    status = this.status,
    birthday = this.birthday,
    height = this.height,
    weight = this.weight,
    uniformNumber = this.uniformNumber,
    leftFoot = this.leftFoot,
    rightFoot = this.rightFoot,
    positions = positions,
    roles = roles
)