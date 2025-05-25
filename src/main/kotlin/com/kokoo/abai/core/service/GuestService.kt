package com.kokoo.abai.core.service

import com.kokoo.abai.core.dto.GuestRequest
import com.kokoo.abai.core.dto.GuestResponse
import com.kokoo.abai.core.dto.toResponse
import com.kokoo.abai.core.dto.toRow
import com.kokoo.abai.core.repository.GuestRepository
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