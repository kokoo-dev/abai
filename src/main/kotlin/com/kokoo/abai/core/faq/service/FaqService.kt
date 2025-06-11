package com.kokoo.abai.core.faq.service

import com.kokoo.abai.core.faq.dto.FaqRequest
import com.kokoo.abai.core.faq.dto.FaqResponse
import com.kokoo.abai.core.faq.dto.toResponse
import com.kokoo.abai.core.faq.dto.toRow
import com.kokoo.abai.core.faq.repository.FaqRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class FaqService(
    private val faqRepository: FaqRepository
) {
    @Transactional
    fun create(request: FaqRequest): FaqResponse = faqRepository.save(request.toRow()).toResponse()

    @Transactional(readOnly = true)
    fun getAll(): List<FaqResponse> = faqRepository.findAll().map { it.toResponse() }
}