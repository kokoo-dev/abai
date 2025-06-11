package com.kokoo.abai.core.guest.controller

import com.kokoo.abai.common.constant.RequestPath
import com.kokoo.abai.core.guest.dto.GuestRequest
import com.kokoo.abai.core.guest.dto.GuestResponse
import com.kokoo.abai.core.guest.service.GuestService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${RequestPath.Companion.API_PREFIX}/v1/guests")
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