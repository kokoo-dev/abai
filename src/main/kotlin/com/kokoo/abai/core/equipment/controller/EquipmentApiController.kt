package com.kokoo.abai.core.equipment.controller

import com.kokoo.abai.common.constant.RequestPath
import com.kokoo.abai.core.equipment.service.EquipmentService
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${RequestPath.API_PREFIX}/v1/equipments")
class EquipmentApiController(
    private val equipmentService: EquipmentService
) {
}