package com.kokoo.abai.core.guest.service

import com.kokoo.abai.core.guest.dto.GuestRequest
import com.kokoo.abai.core.guest.dto.GuestResponse
import com.kokoo.abai.core.guest.dto.toResponse
import com.kokoo.abai.core.guest.dto.toRow
import com.kokoo.abai.core.guest.repository.GuestRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class GuestService(
    private val guestRepository: GuestRepository
) {

    @Transactional
    fun create(request: GuestRequest): GuestResponse =
        guestRepository.save(request.toRow()).toResponse()
}