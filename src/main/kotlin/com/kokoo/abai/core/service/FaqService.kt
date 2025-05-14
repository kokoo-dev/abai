package com.kokoo.abai.core.service

import com.kokoo.abai.core.dto.FaqResponse
import com.kokoo.abai.core.dto.toResponse
import com.kokoo.abai.core.repository.FaqRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class FaqService(
    private val faqRepository: FaqRepository
) {

    @Transactional(readOnly = true)
    fun getAll(): List<FaqResponse> {
        return faqRepository.findAll()
            .map { it.toResponse() }
    }
}