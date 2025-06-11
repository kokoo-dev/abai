package com.kokoo.abai.core.notice.service

import com.kokoo.abai.core.notice.dto.NoticeCategoryResponse
import com.kokoo.abai.core.notice.dto.toResponse
import com.kokoo.abai.core.notice.repository.NoticeCategoryRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class NoticeCategoryService(
    private val noticeCategoryRepository: NoticeCategoryRepository
) {

    @Transactional(readOnly = true)
    fun getAll(): List<NoticeCategoryResponse> =
        noticeCategoryRepository.findAll().map { it.toResponse() }
}