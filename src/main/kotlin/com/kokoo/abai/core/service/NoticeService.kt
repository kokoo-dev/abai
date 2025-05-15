package com.kokoo.abai.core.service

import com.kokoo.abai.common.error.ErrorCode
import com.kokoo.abai.common.exception.BusinessException
import com.kokoo.abai.common.extension.getPrincipalOrThrow
import com.kokoo.abai.common.extension.hasPermission
import com.kokoo.abai.core.dto.*
import com.kokoo.abai.core.repository.NoticeRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class NoticeService(
    private val noticeRepository: NoticeRepository
) {
    @Transactional
    fun create(request: NoticeRequest): NoticeResponse {
        val userDetails = SecurityContextHolder.getContext().getPrincipalOrThrow()

        return noticeRepository.save(request.toRow(userDetails.id)).toResponse()
    }

    @Transactional
    fun update(noticeId: Long, request: NoticeRequest): NoticeResponse {
        val notice = noticeRepository.findById(noticeId) ?: throw BusinessException(ErrorCode.NOT_FOUND)
        val userDetails = SecurityContextHolder.getContext().getPrincipalOrThrow(notice.memberId)

        return noticeRepository.save(request.toRow(userDetails.id), noticeId).toResponse()
    }

    @Transactional
    fun delete(noticeId: Long) {
        val notice = noticeRepository.findById(noticeId) ?: throw BusinessException(ErrorCode.NOT_FOUND)
        SecurityContextHolder.getContext().getPrincipalOrThrow(notice.memberId)

        noticeRepository.delete(noticeId)
    }

    @Transactional
    fun increaseViewCount(id: Long) = noticeRepository.increaseViewCount(id)

    @Transactional(readOnly = true)
    fun getAll(): List<NoticeResponse> = noticeRepository.findAll().map { it.toResponse() }

    @Transactional(readOnly = true)
    fun getAndCheckPermission(id: Long): NoticeResponse {
        val notice = get(id)
        if (!SecurityContextHolder.getContext().hasPermission(notice.memberId)) {
            throw BusinessException(ErrorCode.FORBIDDEN)
        }

        return notice
    }

    @Transactional(readOnly = true)
    fun get(id: Long): NoticeResponse =
        noticeRepository.findById(id)?.toResponse() ?: throw BusinessException(ErrorCode.NOT_FOUND)
}