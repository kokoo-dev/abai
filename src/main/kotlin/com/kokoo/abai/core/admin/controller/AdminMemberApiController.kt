package com.kokoo.abai.core.admin.controller

import com.kokoo.abai.common.constant.RequestPath
import com.kokoo.abai.core.admin.dto.AdminMemberResponse
import com.kokoo.abai.core.admin.service.AdminMemberService
import com.kokoo.abai.core.admin.dto.AdminMemberSaveRequest
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${RequestPath.API_PREFIX}/v1/admin/members")
class AdminMemberApiController(
    private val adminMemberService: AdminMemberService
) {
    @PostMapping("")
    fun createMember(@RequestBody @Valid request: AdminMemberSaveRequest): ResponseEntity<AdminMemberResponse> {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(adminMemberService.createMember(request))
    }

    @PutMapping("/{id}")
    fun updateMember(
        @PathVariable(name = "id") id: Long,
        @RequestBody @Valid request: AdminMemberSaveRequest
    ): ResponseEntity<AdminMemberResponse> {
        return ResponseEntity.ok(adminMemberService.updateMember(id, request))
    }

    @PostMapping("/{id}/withdrawal")
    fun withdrawMember(@PathVariable(name = "id") id: Long): ResponseEntity<Unit> {
        return ResponseEntity.ok(adminMemberService.withdrawMember(id))
    }

    @DeleteMapping("/{id}")
    fun deleteMember(@PathVariable(name = "id") id: Long): ResponseEntity<Unit> {
        adminMemberService.deleteMember(id)
        return ResponseEntity.ok().build()
    }

    @GetMapping("")
    fun getAllMembers(): ResponseEntity<List<AdminMemberResponse>> {
        return ResponseEntity.ok(adminMemberService.getAllMembers())
    }

    @GetMapping("/{id}")
    fun getMember(
        @PathVariable(name = "id") id: Long
    ): ResponseEntity<AdminMemberResponse> {
        return ResponseEntity.ok(adminMemberService.getMember(id))
    }
}