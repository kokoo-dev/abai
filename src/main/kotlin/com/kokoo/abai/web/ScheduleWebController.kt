package com.kokoo.abai.web

import com.kokoo.abai.core.match.service.MatchService
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/schedules")
class ScheduleWebController(
    private val matchService: MatchService
) {

    @GetMapping("")
    fun schedules(model: Model): String {
        model.addAttribute("matchStatusFilters", matchService.getMatchStatusForMemberViewFilter())

        return "schedules/schedules"
    }

    @GetMapping("/{subTab}")
    fun schedulesWithSubTab(
        model: Model,
        @PathVariable(name = "subTab") subTab: String
    ): String {
        model.addAttribute("subTab", subTab)
        model.addAttribute("matchStatusFilters", matchService.getMatchStatusForMemberViewFilter())

        return "schedules/schedules"
    }

    @PostMapping("/matches")
    fun matchCreate(model: Model): String {
        model.addAttribute("saveMode", "create")

        return "schedules/match-save"
    }

    @PostMapping("/matches/{id}")
    fun matchUpdate(
        @PathVariable(name = "id") id: Long,
        model: Model
    ): String {
        model.addAttribute("saveMode", "update")
        model.addAttribute("id", id)
        model.addAttribute("match", matchService.getMatch(id))

        return "schedules/match-save"
    }

    @GetMapping("/matches/{id}")
    fun match(
        @PathVariable(name = "id") id: Long,
        model: Model
    ): String {
        model.addAttribute("id", id)
        model.addAttribute("match", matchService.getMatch(id))

        return "schedules/match-detail"
    }
}
