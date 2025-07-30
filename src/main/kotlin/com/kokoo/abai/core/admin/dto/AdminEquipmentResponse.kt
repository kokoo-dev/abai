package com.kokoo.abai.core.admin.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.kokoo.abai.core.common.dto.EnumResponse
import com.kokoo.abai.core.equipment.row.EquipmentRow
import com.kokoo.abai.core.member.dto.MemberResponse
import com.kokoo.abai.core.member.dto.toResponse
import java.time.OffsetDateTime
import java.time.ZoneOffset

data class AdminEquipmentResponse(
    val id: Long,
    val memberId: Long,
    val name: String,
    val description: String?,
    val type: EnumResponse,
    val status: EnumResponse,

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    val createdAt: OffsetDateTime = OffsetDateTime.now(),
    val member: MemberResponse? = null
)

fun EquipmentRow.toAdminResponse() = AdminEquipmentResponse(
    id = this.id,
    memberId = this.memberId,
    name = this.name,
    description = this.description,
    type = EnumResponse(name = this.type.koreanName, value = this.type.name),
    status = EnumResponse(name = this.status.koreanName, value = this.status.name),
    createdAt = this.createdAt!!.atOffset(ZoneOffset.UTC),
    member = this.member?.toResponse()
)