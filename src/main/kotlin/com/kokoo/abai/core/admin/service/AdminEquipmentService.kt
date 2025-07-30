package com.kokoo.abai.core.admin.service

import com.kokoo.abai.common.error.ErrorCode
import com.kokoo.abai.common.exception.BusinessException
import com.kokoo.abai.core.admin.dto.*
import com.kokoo.abai.core.common.dto.CursorResponse
import com.kokoo.abai.core.equipment.repository.EquipmentRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AdminEquipmentService(
    private val equipmentRepository: EquipmentRepository
) {
    @Transactional
    fun createEquipment(request: AdminEquipmentSaveRequest): AdminEquipmentResponse {
        val row = request.toRow()
        return equipmentRepository.save(row).toAdminResponse()
    }

    @Transactional
    fun updateEquipment(id: Long, request: AdminEquipmentSaveRequest): AdminEquipmentResponse {
        val row = request.toRow()
        return equipmentRepository.save(row, id).toAdminResponse()
    }

    @Transactional
    fun deleteEquipment(id: Long) {
        equipmentRepository.delete(id)
    }

    @Transactional(readOnly = true)
    fun getAllEquipments(request: AdminEquipmentCursorRequest<Long>): CursorResponse<AdminEquipmentResponse, Long> {
        val equipments = equipmentRepository.findAll(
            id = request.lastId,
            name = request.name,
            type = request.type,
            status = request.status,
            size = request.size
        )

        val lastId = equipments.contents.lastOrNull()?.id

        return CursorResponse.of(equipments, lastId) { it.toAdminResponse() }
    }

    @Transactional(readOnly = true)
    fun getEquipment(id: Long): AdminEquipmentResponse =
        equipmentRepository.findById(id)?.toAdminResponse()
            ?: throw BusinessException(ErrorCode.NOT_FOUND)
}