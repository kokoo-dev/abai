package com.kokoo.abai.web.controller

import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping

@Controller
class WebController {

    @GetMapping("")
    fun index(model: Model): String {

        return "index"
    }

    @GetMapping("/login")
    fun login(model: Model): String {

        return "login"
    }

    @GetMapping("/stats")
    fun stats(model: Model): String {

        return "stats"
    }

    @GetMapping("/settings")
    fun settings(model: Model): String {

        return "settings"
    }

    @GetMapping("/notices")
    fun notices(model: Model): String {

        return "notices"
    }

    @GetMapping("/notice")
    fun noticeDetail(model: Model): String {

        return "notice-detail"
    }

    @GetMapping("/notice-write")
    fun writeNotice(model: Model): String {

        return "notice-write"
    }
}
