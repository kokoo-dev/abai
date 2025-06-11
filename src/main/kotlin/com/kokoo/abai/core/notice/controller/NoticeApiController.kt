package com.kokoo.abai.core.notice.controller

import com.kokoo.abai.common.constant.RequestPath
import com.kokoo.abai.core.notice.dto.NoticeRequest
import com.kokoo.abai.core.notice.dto.NoticeResponse
import com.kokoo.abai.core.notice.service.NoticeService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${RequestPath.Companion.API_PREFIX}/v1/notices")
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