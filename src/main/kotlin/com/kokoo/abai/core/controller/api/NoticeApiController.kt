package com.kokoo.abai.core.controller.api

import com.kokoo.abai.common.constant.RequestPath
import com.kokoo.abai.core.dto.NoticeRequest
import com.kokoo.abai.core.dto.NoticeResponse
import com.kokoo.abai.core.service.NoticeService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${RequestPath.API_PREFIX}/v1/notices")
class NoticeApiController(
    private val noticeService: NoticeService
) {

    @PostMapping("")
    fun createNotice(@RequestBody @Valid request: NoticeRequest): ResponseEntity<NoticeResponse> {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(noticeService.create(request))
    }

    @PutMapping("/{id}")
    fun updateNotice(
        @PathVariable(name = "id") id: Long,
        @RequestBody @Valid request: NoticeRequest
    ): ResponseEntity<NoticeResponse> {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(noticeService.update(id, request))
    }

    @DeleteMapping("/{id}")
    fun deleteNotice(@PathVariable(name = "id") id: Long): ResponseEntity<Unit> {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(noticeService.delete(id))
    }

    @PostMapping("/{id}/views")
    fun increaseViewCount(@PathVariable(name = "id") id: Long): ResponseEntity<Unit> {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(noticeService.increaseViewCount(id))
    }
}