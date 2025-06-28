package com.kokoo.abai.core.member.controller

import com.kokoo.abai.common.constant.RequestPath
import com.kokoo.abai.core.common.dto.EnumResponse
import com.kokoo.abai.core.member.dto.MemberResponse
import com.kokoo.abai.core.member.dto.MemberWithPositionResponse
import com.kokoo.abai.core.member.dto.PasswordChangeRequest
import com.kokoo.abai.core.member.enums.PositionGroup
import com.kokoo.abai.core.member.service.MemberService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${RequestPath.Companion.API_PREFIX}/v1/members")
class MemberApiController(
    private val memberService: MemberService
) {
    @PostMapping("/password")
    fun changePassword(@RequestBody @Valid request: PasswordChangeRequest): ResponseEntity<Unit> {
        return ResponseEntity.ok(memberService.changePassword(request))
    }

    @GetMapping("")
    fun getMembers(
        @RequestParam(name = "positionGroup", required = false) positionGroup: PositionGroup? = null
    ): ResponseEntity<List<MemberResponse>> {
        return ResponseEntity.ok(memberService.getActivatedMembers(positionGroup))
    }

    @GetMapping("/with-positions")
    fun getMembersWithPositions(): ResponseEntity<List<MemberWithPositionResponse>> {
        return ResponseEntity.ok(memberService.getMembersWithPositions())
    }

    @GetMapping("/{id}")
    fun getMember(
        @PathVariable(name = "id") id: Long
    ): ResponseEntity<MemberResponse> {
        return ResponseEntity.ok(memberService.getMember(id))
    }

    @GetMapping("/upcoming-birthday")
    fun getUpcomingBirthdayMembers(): ResponseEntity<List<MemberResponse>> {
        return ResponseEntity.ok(memberService.getUpcomingBirthdays())
    }

    @GetMapping("/positions")
    fun getPositions(): ResponseEntity<List<EnumResponse>> {
        return ResponseEntity.ok(memberService.getPositions())
    }
}