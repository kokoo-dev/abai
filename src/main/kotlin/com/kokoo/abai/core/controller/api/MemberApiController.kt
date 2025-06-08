package com.kokoo.abai.core.controller.api

import com.kokoo.abai.common.constant.RequestPath
import com.kokoo.abai.core.dto.*
import com.kokoo.abai.core.enums.PositionGroup
import com.kokoo.abai.core.service.MemberService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${RequestPath.API_PREFIX}/v1/members")
class MemberApiController(
    private val memberService: MemberService
) {
    @GetMapping("")
    fun getMembers(
        @RequestParam(name = "positionGroup", required = false) positionGroup: PositionGroup? = null
    ): ResponseEntity<List<MemberResponse>> {
        return ResponseEntity.ok(memberService.getActivatedMembers(positionGroup))
    }

    @GetMapping("/with-positions")
    fun getMembersWithPositions(): ResponseEntity<List<MemberResponse>> {
        return ResponseEntity.ok(memberService.getMembersWithPositions())
    }

    @GetMapping("/{id}")
    fun getMember(
        @PathVariable(name = "id") id: Long
    ): ResponseEntity<MemberResponse> {
        return ResponseEntity.ok(memberService.getMember(id))
    }
}