package com.kokoo.abai.core.controller.web

import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping

@Controller
class IndexWebController {

    @GetMapping("")
    fun index(model: Model): String {

        return "index"
    }

    @GetMapping("/login")
    fun login(model: Model): String {

        return "login"
    }
}