package com.kokoo.abai.core.my.service

import com.kokoo.abai.common.error.ErrorCode
import com.kokoo.abai.common.exception.BusinessException
import com.kokoo.abai.common.extension.getPrincipalOrThrow
import com.kokoo.abai.core.member.dto.*
import com.kokoo.abai.core.member.repository.MemberAttributeRepository
import com.kokoo.abai.core.member.repository.MemberPositionRepository
import com.kokoo.abai.core.member.repository.MemberRepository
import com.kokoo.abai.core.member.row.MemberPositionRow
import com.kokoo.abai.core.my.dto.MyProfileSaveRequest
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class MyService(
    private val memberRepository: MemberRepository,
    private val memberAttributeRepository: MemberAttributeRepository,
    private val memberPositionRepository: MemberPositionRepository
) {
    @Transactional
    fun saveProfile(request: MyProfileSaveRequest): MemberResponse {
        val memberId = SecurityContextHolder.getContext().getPrincipalOrThrow().id

        val member = memberRepository.findById(memberId)
            ?: throw BusinessException(ErrorCode.NOT_FOUND)

        member.from(request)
        memberRepository.save(member, memberId)

        if (request.deletePositions.isNotEmpty()) {
            memberPositionRepository.delete(memberId, request.deletePositions)
        }

        val positions = request.createPositions
            .map { MemberPositionRow(memberId = memberId, position = it) }
        memberPositionRepository.saveAll(positions)

        return getProfile()
    }

    @Transactional(readOnly = true)
    fun getProfile(): MemberResponse {
        val memberId = SecurityContextHolder.getContext().getPrincipalOrThrow().id
        val member =
            memberRepository.findById(memberId) ?: throw BusinessException(ErrorCode.NOT_FOUND)

        return member.toResponse().also {
            memberAttributeRepository.findById(memberId)?.let { attribute ->
                it.attribute = attribute.toResponse()
            }

            it.positions = memberPositionRepository.findByMemberId(memberId).map { position ->
                position.toResponse()
            }
        }
    }
}