package com.kokoo.abai.core.admin.dto

import com.kokoo.abai.core.member.enums.MemberStatus
import com.kokoo.abai.core.member.enums.Position
import com.kokoo.abai.core.member.enums.RoleId
import com.kokoo.abai.core.member.row.MemberRow
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate

data class AdminMemberSaveRequest(
    @field:NotBlank
    @field:Size(min = 1, max = 50)
    val loginId: String,

    @field:NotBlank
    @field:Size(min = 1, max = 50)
    val name: String,

    @field:NotNull
    val status: MemberStatus,

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    val birthday: LocalDate,

    val height: Int = 100,

    val weight: Int = 30,

    @field:NotNull
    val uniformNumber: Int,

    val leftFoot: Int = 1,

    val rightFoot: Int = 1,

    val positions: List<Position> = emptyList(),

    val roles: List<RoleId> = emptyList()
)

fun AdminMemberSaveRequest.toRow(password: String) = MemberRow(
    loginId = this.loginId,
    password = password,
    name = this.name,
    status = this.status,
    birthday = this.birthday,
    height = this.height,
    weight = this.weight,
    uniformNumber = this.uniformNumber,
    leftFoot = this.leftFoot,
    rightFoot = this.rightFoot
)