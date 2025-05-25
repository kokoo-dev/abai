package com.kokoo.abai.core.controller.api

import com.kokoo.abai.common.constant.RequestPath
import com.kokoo.abai.core.dto.GuestRequest
import com.kokoo.abai.core.dto.GuestResponse
import com.kokoo.abai.core.service.GuestService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${RequestPath.API_PREFIX}/v1/guests")
class GuestApiController(
    private val guestService: GuestService
) {

    @PostMapping("")
    fun createGuest(@RequestBody @Valid request: GuestRequest): ResponseEntity<GuestResponse> {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(guestService.create(request))
    }
}