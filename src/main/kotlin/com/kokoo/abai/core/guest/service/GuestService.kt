package com.kokoo.abai.core.guest.service

import com.kokoo.abai.core.guest.dto.GuestRequest
import com.kokoo.abai.core.guest.dto.GuestResponse
import com.kokoo.abai.core.guest.dto.toResponse
import com.kokoo.abai.core.guest.dto.toRow
import com.kokoo.abai.core.guest.repository.GuestPositionRepository
import com.kokoo.abai.core.guest.repository.GuestRepository
import com.kokoo.abai.core.guest.row.GuestPositionRow
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class GuestService(
    private val guestRepository: GuestRepository,
    private val guestPositionRepository: GuestPositionRepository
) {

    @Transactional
    fun create(request: GuestRequest): GuestResponse {
        val savedGuest = guestRepository.save(request.toRow())

        val positions = request.positions
            .map { GuestPositionRow(guestId = savedGuest.id, position = it) }
        val savedPositions = guestPositionRepository.saveAll(positions)

        return savedGuest.toResponse().apply {
            this.positions = savedPositions.map { it.position }
        }
    }
}