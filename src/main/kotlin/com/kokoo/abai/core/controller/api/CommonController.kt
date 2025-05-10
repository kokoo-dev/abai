package com.kokoo.abai.core.controller.api

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class CommonController {

    @GetMapping("/health-check")
    fun healthCheck() {

    }
}