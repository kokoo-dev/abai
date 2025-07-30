package com.kokoo.abai.core.admin.controller

import com.kokoo.abai.common.constant.RequestPath
import com.kokoo.abai.core.admin.dto.AdminEquipmentCursorRequest
import com.kokoo.abai.core.admin.dto.AdminEquipmentResponse
import com.kokoo.abai.core.admin.dto.AdminEquipmentSaveRequest
import com.kokoo.abai.core.admin.service.AdminEquipmentService
import com.kokoo.abai.core.common.dto.CursorResponse
import com.kokoo.abai.core.equipment.enums.EquipmentStatus
import com.kokoo.abai.core.equipment.enums.EquipmentType
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${RequestPath.API_PREFIX}/v1/admin/equipments")
class AdminEquipmentApiController(
    private val adminEquipmentService: AdminEquipmentService
) {
    @PostMapping("")
    fun createEquipment(@RequestBody @Valid request: AdminEquipmentSaveRequest): ResponseEntity<AdminEquipmentResponse> {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(adminEquipmentService.createEquipment(request))
    }

    @PutMapping("/{id}")
    fun updateEquipment(
        @PathVariable(name = "id") id: Long,
        @RequestBody @Valid request: AdminEquipmentSaveRequest
    ): ResponseEntity<AdminEquipmentResponse> {
        return ResponseEntity.ok(adminEquipmentService.updateEquipment(id, request))
    }

    @DeleteMapping("/{id}")
    fun deleteEquipment(@PathVariable(name = "id") id: Long): ResponseEntity<Unit> {
        return ResponseEntity.ok(adminEquipmentService.deleteEquipment(id))
    }

    @GetMapping("")
    fun getEquipmentsByCursor(
        @RequestParam(name = "lastId", required = false) lastId: Long?,
        @RequestParam(name = "name", required = false) name: String?,
        @RequestParam(name = "type", required = false) type: EquipmentType?,
        @RequestParam(name = "status", required = false) status: EquipmentStatus?,
        @RequestParam(name = "size", required = false, defaultValue = "10") size: Int = 10,
    ): ResponseEntity<CursorResponse<AdminEquipmentResponse, Long>> {
        return ResponseEntity.ok(
            adminEquipmentService.getAllEquipments(
                AdminEquipmentCursorRequest(
                    lastId = lastId,
                    name = name,
                    type = type,
                    status = status,
                    size = size
                )
            )
        )
    }

    @GetMapping("/{id}")
    fun getEquipment(@PathVariable(name = "id") id: Long): ResponseEntity<AdminEquipmentResponse> {
        return ResponseEntity.ok(adminEquipmentService.getEquipment(id))
    }
}