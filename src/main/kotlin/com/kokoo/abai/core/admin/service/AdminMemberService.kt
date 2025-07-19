package com.kokoo.abai.core.admin.service

import com.kokoo.abai.common.error.ErrorCode
import com.kokoo.abai.common.exception.BusinessException
import com.kokoo.abai.common.extension.getMyHighestRole
import com.kokoo.abai.common.extension.getPrincipalOrThrow
import com.kokoo.abai.core.admin.dto.AdminMemberResponse
import com.kokoo.abai.core.admin.dto.AdminMemberSaveRequest
import com.kokoo.abai.core.admin.dto.toAdminResponse
import com.kokoo.abai.core.admin.dto.toRow
import com.kokoo.abai.core.member.dto.toResponse
import com.kokoo.abai.core.member.enums.MemberStatus
import com.kokoo.abai.core.member.enums.RoleId
import com.kokoo.abai.core.member.repository.MemberAttributeRepository
import com.kokoo.abai.core.member.repository.MemberPositionRepository
import com.kokoo.abai.core.member.repository.MemberRepository
import com.kokoo.abai.core.member.repository.MemberRoleRepository
import com.kokoo.abai.core.member.row.MemberPositionRow
import com.kokoo.abai.core.member.row.MemberRoleRow
import com.kokoo.abai.core.member.row.MemberRow
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AdminMemberService(
    private val memberRepository: MemberRepository,
    private val memberRoleRepository: MemberRoleRepository,
    private val memberPositionRepository: MemberPositionRepository,
    private val memberAttributeRepository: MemberAttributeRepository,
) {

    @Transactional
    fun createMember(request: AdminMemberSaveRequest): AdminMemberResponse {
        // 로그인 ID 중복 체크
        if (memberRepository.existsByLoginIdAndStatus(request.loginId)) {
            throw BusinessException(ErrorCode.EXISTS_LOGIN_ID)
        }

        // 등번호 중복 체크
        if (memberRepository.existsByUniformNumberAndStatus(request.uniformNumber)) {
            throw BusinessException(ErrorCode.EXISTS_UNIFORM_NUMBER)
        }

        val memberRow = request.toRow(BCryptPasswordEncoder().encode(request.uniformNumber.toString()))
        val savedMember = memberRepository.save(memberRow)

        // 포지션 저장
        if (request.positions.isNotEmpty()) {
            val memberPositions = request.positions.map { position ->
                MemberPositionRow(
                    memberId = savedMember.id,
                    position = position
                )
            }
            memberPositionRepository.saveAll(memberPositions)
        }

         // 역할 저장
        if (request.roles.isNotEmpty()) {
            val roles = request.roles.map { role ->
                MemberRoleRow(
                    memberId = savedMember.id,
                    roleId = role
                )
            }
            memberRoleRepository.saveAll(roles)
        }

        return getMember(savedMember.id)
    }

    @Transactional
    fun updateMember(id: Long, request: AdminMemberSaveRequest): AdminMemberResponse {
        val member = memberRepository.findById(id)
            ?: throw BusinessException(ErrorCode.NOT_FOUND)

        val myHighestRole = SecurityContextHolder.getContext().getMyHighestRole()
        val isHigherLevel = memberRoleRepository.findByMemberId(id)
            .any { myHighestRole.level >= it.roleId.level }
        if (isHigherLevel) {
            throw BusinessException(ErrorCode.FORBIDDEN)
        }

        // 로그인 ID 중복 체크
        if (member.loginId != request.loginId
            && memberRepository.existsByLoginIdAndStatus(request.loginId)) {
            throw BusinessException(ErrorCode.EXISTS_LOGIN_ID)
        }

        // 등번호 중복 체크
        if (member.uniformNumber != request.uniformNumber
            && memberRepository.existsByUniformNumberAndStatus(request.uniformNumber)) {
            throw BusinessException(ErrorCode.EXISTS_UNIFORM_NUMBER)
        }

        val memberRow = request.toRow(member.password)
        memberRepository.save(memberRow, id)

        // 포지션 업데이트
        memberPositionRepository.deleteByMemberId(id)
        if (request.positions.isNotEmpty()) {
            val memberPositions = request.positions.map { position ->
                MemberPositionRow(
                    memberId = id,
                    position = position
                )
            }
            memberPositionRepository.saveAll(memberPositions)
        }

        // 역할 업데이트
        memberRoleRepository.deleteByMemberId(id)
        if (request.roles.isNotEmpty()) {
            val roles = request.roles.map { role ->
                MemberRoleRow(
                    memberId = id,
                    roleId = role
                )
            }
            memberRoleRepository.saveAll(roles)
        }

        return getMember(id)
    }

    @Transactional
    fun withdrawMember(id: Long) {
        memberRepository.updateStatus(id, MemberStatus.WITHDRAWN)
    }

    @Transactional
    fun deleteMember(id: Long) {
        memberRepository.findById(id) ?: throw BusinessException(ErrorCode.NOT_FOUND)

        // 관련 데이터 삭제
        memberPositionRepository.deleteByMemberId(id)
        memberRoleRepository.deleteByMemberId(id)
        memberAttributeRepository.delete(id)

        // 멤버 삭제
        memberRepository.delete(id)
    }

    @Transactional(readOnly = true)
    fun getAllMembers(): List<AdminMemberResponse> {
        val myHighestRole = SecurityContextHolder.getContext().getMyHighestRole()

        return memberRoleRepository.findAll()
            .groupBy { it.memberId }
            .map {
                val memberRole = it.value.minBy { memberRole -> memberRole.roleId.level }

                memberRole.member!!.toAdminResponse().apply {
                    isEditable = myHighestRole.level < memberRole.roleId.level
                }
            }
    }

    @Transactional(readOnly = true)
    fun getMember(id: Long): AdminMemberResponse {
        val member = memberRepository.findById(id) ?: throw BusinessException(ErrorCode.NOT_FOUND)

        return member.toAdminResponse().also {
            memberAttributeRepository.findById(id)?.let { attribute ->
                it.attribute = attribute.toResponse()
            }

            it.positions = memberPositionRepository.findByMemberId(id)
                .map { position -> position.toResponse() }

            it.roles = memberRoleRepository.findByMemberId(id)
                .map { role -> role.roleId }
        }
    }
}