package com.kokoo.abai.core.my.controller

import com.kokoo.abai.common.constant.RequestPath
import com.kokoo.abai.core.common.dto.CursorRequest
import com.kokoo.abai.core.common.dto.CursorResponse
import com.kokoo.abai.core.member.dto.MemberResponse
import com.kokoo.abai.core.member.dto.LoginHistoryResponse
import com.kokoo.abai.core.my.dto.MyProfileSaveRequest
import com.kokoo.abai.core.my.service.MyService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${RequestPath.API_PREFIX}/v1/my")
class MyApiController(
    private val myService: MyService
) {
    @PostMapping("/profile")
    fun saveProfile(@Valid @RequestBody request: MyProfileSaveRequest): ResponseEntity<MemberResponse> {
        return ResponseEntity.ok(myService.saveProfile(request))
    }

    @GetMapping("/profile")
    fun getProfile(): ResponseEntity<MemberResponse> {
        return ResponseEntity.ok(myService.getProfile())
    }

    @GetMapping("/login-histories")
    fun getLoginHistory(
        @RequestParam(required = false) lastId: Long?,
        @RequestParam(name = "size", required = false, defaultValue = "10") size: Int = 10,
    ): ResponseEntity<CursorResponse<LoginHistoryResponse, Long>> {
        val request = CursorRequest(lastId = lastId, size = size)
        return ResponseEntity.ok(myService.getLoginHistory(request))
    }
}