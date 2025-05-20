package com.kokoo.abai.core.service

import com.kokoo.abai.core.dto.MemberResponse
import com.kokoo.abai.core.dto.toResponse
import com.kokoo.abai.core.enums.MemberStatus
import com.kokoo.abai.core.repository.MemberRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class MemberService(
    private val memberRepository: MemberRepository
) {
    @Transactional(readOnly = true)
    fun getActivatedMembers(): List<MemberResponse> =
        memberRepository.findByStatus(MemberStatus.ACTIVATED).map { it.toResponse() }
}