package com.kokoo.abai.core.controller.web

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

        return "schedules/schedules"
    }

    @GetMapping("/{subTab}")
    fun schedulesWithSubTab(
        model: Model,
        @PathVariable(name = "subTab") subTab: String
    ): String {
        model.addAttribute("subTab", subTab)

        return "schedules/schedules"
    }

    @GetMapping("/match-write")
    fun matchWrite(model: Model): String {

        return "schedules/match-write"
    }

    @GetMapping("/match/{id}")
    fun match(
        @PathVariable(name = "id") id: Long,
        model: Model
    ): String {
        model.addAttribute("id", id)

        return "schedules/match-detail"
    }
}
