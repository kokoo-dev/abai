package com.kokoo.abai.core.member.service

import com.kokoo.abai.common.error.ErrorCode
import com.kokoo.abai.common.exception.BusinessException
import com.kokoo.abai.core.member.dto.PositionGroupResponse
import com.kokoo.abai.core.member.dto.MemberResponse
import com.kokoo.abai.core.member.dto.MemberWithPositionResponse
import com.kokoo.abai.core.member.dto.toResponse
import com.kokoo.abai.core.member.enums.MemberStatus
import com.kokoo.abai.core.member.enums.PositionGroup
import com.kokoo.abai.core.member.repository.MemberAttributeRepository
import com.kokoo.abai.core.member.repository.MemberPositionRepository
import com.kokoo.abai.core.member.repository.MemberRepository
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
    fun getMembersWithPositions(): List<MemberWithPositionResponse> =
        memberPositionRepository.findAll()
            .groupBy { it.memberId }
            .map {
                val positions = if (it.value[0].position == null) {
                    emptyList()
                } else {
                    it.value.map { member -> member.position!! }
                }

                MemberWithPositionResponse(
                    id = it.key,
                    name = it.value[0].name,
                    uniformNumber = it.value[0].uniformNumber,
                    positions = positions
                )
            }
            .sortedBy { it.uniformNumber }

    @Transactional(readOnly = true)
    fun getMember(id: Long): MemberResponse {
        val member = memberRepository.findById(id) ?: throw BusinessException(ErrorCode.NOT_FOUND)

        return member.toResponse().also {
            memberAttributeRepository.findById(id)?.let { attribute ->
                it.attribute = attribute.toResponse()
            }
        }
    }

    @Transactional(readOnly = true)
    fun getUpcomingBirthdays() = memberRepository.findUpcomingBirthdays().map { it.toResponse() }

    fun getPositionGroups(): List<PositionGroupResponse> =
        PositionGroup.entries
            .map {
                PositionGroupResponse(
                    group = it.name,
                    positions = it.positions.map { position -> position.name })
            }
}