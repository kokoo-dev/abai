package com.kokoo.abai.core.faq.service

import com.kokoo.abai.core.faq.dto.FaqCategoryResponse
import com.kokoo.abai.core.faq.dto.toResponse
import com.kokoo.abai.core.faq.repository.FaqCategoryRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class FaqCategoryService(
    private val faqCategoryRepository: FaqCategoryRepository
) {

    @Transactional(readOnly = true)
    fun getAll(): List<FaqCategoryResponse> = faqCategoryRepository.findAll().map { it.toResponse() }
}