package com.kokoo.abai.core.controller

import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/see-more")
class SeeMoreWebController {

    @GetMapping("")
    fun seeMore(model: Model): String {

        return "see-more/see-more"
    }

    @GetMapping("/notices")
    fun notices(model: Model): String {

        return "see-more/notices"
    }

    @GetMapping("/notice")
    fun noticeDetail(model: Model): String {

        return "see-more/notice-detail"
    }

    @GetMapping("/notice-write")
    fun noticeWrite(model: Model): String {

        return "see-more/notice-write"
    }
}