package com.kokoo.abai.core.equipment.service

import com.kokoo.abai.core.common.dto.EnumResponse
import com.kokoo.abai.core.equipment.enums.EquipmentStatus
import com.kokoo.abai.core.equipment.enums.EquipmentType
import com.kokoo.abai.core.equipment.repository.EquipmentRepository
import org.springframework.stereotype.Service

@Service
class EquipmentService(
    private val equipmentRepository: EquipmentRepository
) {
    fun getEquipmentTypes() = EquipmentType.entries
        .map { EnumResponse(name = it.koreanName, value = it.name) }

    fun getEquipmentStatuses() = EquipmentStatus.entries
        .map { EnumResponse(name = it.koreanName, value = it.name) }
}