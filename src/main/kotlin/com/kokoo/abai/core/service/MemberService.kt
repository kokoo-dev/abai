package com.kokoo.abai.core.service

import com.kokoo.abai.common.error.ErrorCode
import com.kokoo.abai.common.exception.BusinessException
import com.kokoo.abai.core.dto.MemberResponse
import com.kokoo.abai.core.dto.PositionGroupResponse
import com.kokoo.abai.core.dto.toResponse
import com.kokoo.abai.core.enums.MemberStatus
import com.kokoo.abai.core.enums.PositionGroup
import com.kokoo.abai.core.repository.MemberAttributeRepository
import com.kokoo.abai.core.repository.MemberPositionRepository
import com.kokoo.abai.core.repository.MemberRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class MemberService(
    private val memberRepository: MemberRepository,
    private val memberPositionRepository: MemberPositionRepository,
    private val memberAttributeRepository: MemberAttributeRepository
) {
    @Transactional(readOnly = true)
    fun getActivatedMembers(positionGroup: PositionGroup? = null): List<MemberResponse> = when {
        positionGroup != null -> memberRepository.findByPositionIn(positionGroup.positions)
        else -> memberRepository.findByStatus(MemberStatus.ACTIVATED)
    }.map { it.toResponse() }

    @Transactional(readOnly = true)
    fun getMembersWithPositions() = memberRepository.findByStatus(MemberStatus.ACTIVATED)
        .map { member ->
            val positions = memberPositionRepository.findByMemberId(member.id)
            member.toResponse(positions.map { position -> position.toResponse() })
        }

    @Transactional(readOnly = true)
    fun getMember(id: Long): MemberResponse {
        val member = memberRepository.findById(id) ?: throw BusinessException(ErrorCode.NOT_FOUND)

        return member.toResponse().also {
            memberAttributeRepository.findById(id)?.let { attribute ->
                it.attribute = attribute.toResponse()
            }
        }
    }

    fun getPositionGroups(): List<PositionGroupResponse> =
        PositionGroup.entries
            .map { PositionGroupResponse(group = it.name, positions = it.positions.map { position -> position.name }) }
}