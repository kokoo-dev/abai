package com.kokoo.abai.core.admin.dto

import com.kokoo.abai.core.equipment.enums.EquipmentStatus
import com.kokoo.abai.core.equipment.enums.EquipmentType
import com.kokoo.abai.core.equipment.row.EquipmentRow
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class AdminEquipmentSaveRequest(
    @field:NotNull
    val memberId: Long,

    @field:NotBlank
    @field:Size(min = 1, max = 50)
    val name: String,

    val description: String?,

    @field:NotNull
    val type: EquipmentType,

    @field:NotNull
    val status: EquipmentStatus
)

fun AdminEquipmentSaveRequest.toRow() = EquipmentRow(
    memberId = this.memberId,
    name = this.name,
    description = this.description,
    type = this.type,
    status = this.status
)