package com.kokoo.abai.core.admin.dto

import com.kokoo.abai.core.common.dto.CursorRequest
import com.kokoo.abai.core.equipment.enums.EquipmentStatus
import com.kokoo.abai.core.equipment.enums.EquipmentType

data class AdminEquipmentCursorRequest<K>(
    override val lastId: K?,
    override val size: Int = 10,
    val name: String?,
    val type: EquipmentType?,
    val status: EquipmentStatus?
) : CursorRequest<K>(lastId, size)