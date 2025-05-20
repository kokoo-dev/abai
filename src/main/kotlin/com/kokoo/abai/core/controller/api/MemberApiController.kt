package com.kokoo.abai.core.controller.api

import com.kokoo.abai.common.constant.RequestPath
import com.kokoo.abai.core.dto.*
import com.kokoo.abai.core.service.MemberService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${RequestPath.API_PREFIX}/v1/members")
class MemberApiController(
    private val memberService: MemberService
) {
    @GetMapping("")
    fun getMembers(): ResponseEntity<List<MemberResponse>> {
        return ResponseEntity.ok(memberService.getActivatedMembers())
    }
}