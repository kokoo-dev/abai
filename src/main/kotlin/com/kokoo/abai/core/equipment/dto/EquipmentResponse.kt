package com.kokoo.abai.core.equipment.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.kokoo.abai.core.equipment.enums.EquipmentStatus
import com.kokoo.abai.core.equipment.enums.EquipmentType
import com.kokoo.abai.core.equipment.row.EquipmentRow
import com.kokoo.abai.core.member.dto.MemberResponse
import com.kokoo.abai.core.member.dto.toResponse
import java.time.OffsetDateTime
import java.time.ZoneOffset

data class EquipmentResponse(
    val id: Long,
    val memberId: Long,
    val name: String,
    val description: String?,
    val type: EquipmentType,
    val status: EquipmentStatus,

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    val createdAt: OffsetDateTime = OffsetDateTime.now(),
    val member: MemberResponse? = null
)

fun EquipmentRow.toResponse() = EquipmentResponse(
    id = this.id,
    memberId = this.memberId,
    name = this.name,
    description = this.description,
    type = this.type,
    status = this.status,
    createdAt = this.createdAt!!.atOffset(ZoneOffset.UTC),
    member = this.member?.toResponse()
)