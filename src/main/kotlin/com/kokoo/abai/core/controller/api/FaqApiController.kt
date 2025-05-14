package com.kokoo.abai.core.controller.api

import com.kokoo.abai.common.constant.RequestPath
import com.kokoo.abai.core.dto.FaqRequest
import com.kokoo.abai.core.dto.FaqResponse
import com.kokoo.abai.core.service.FaqService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${RequestPath.API_PREFIX}/v1/faq")
class FaqApiController(
    private val faqService: FaqService
) {

    @PostMapping("")
    fun createFaq(@RequestBody @Valid request: FaqRequest): ResponseEntity<FaqResponse> {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(faqService.create(request))
    }
}