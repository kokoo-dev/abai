package com.kokoo.abai.core.equipment.dto

import com.kokoo.abai.core.common.dto.CursorRequest
import com.kokoo.abai.core.equipment.enums.EquipmentStatus
import com.kokoo.abai.core.equipment.enums.EquipmentType

data class EquipmentCursorRequest<K>(
    override val lastId: K?,
    override val size: Int = 10,
    val type: EquipmentType?,
    val status: EquipmentStatus?
) : CursorRequest<K>(lastId, size)