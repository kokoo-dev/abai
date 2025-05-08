package com.kokoo.abai.web.controller

import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/schedules")
class ScheduleWebController {

    @GetMapping("")
    fun schedules(model: Model): String {

        return "schedules"
    }

    @GetMapping("/match-write")
    fun writeMatch(model: Model): String {

        return "match-write"
    }

    @GetMapping("/match/{id}")
    fun match(
        @PathVariable(name = "id") id: Long,
        model: Model
    ): String {
        model.addAttribute("id", id)

        return "match-detail"
    }
}
