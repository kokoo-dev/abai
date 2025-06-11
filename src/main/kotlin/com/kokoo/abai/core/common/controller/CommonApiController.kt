package com.kokoo.abai.core.common.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class CommonApiController {

    @GetMapping("/health-check")
    fun healthCheck() {

    }
}