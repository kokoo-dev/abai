package com.kokoo.abai.core.controller.web

import com.kokoo.abai.core.service.MemberService
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/teams")
class TeamWebController(
    private val memberService: MemberService
) {

    @GetMapping("")
    fun teams(model: Model): String {
        model.addAttribute("positionGroups", memberService.getPositionGroups())

        return "teams/teams"
    }

    @GetMapping("/{subTab}")
    fun teamsWithSubTab(
        model: Model,
        @PathVariable(name = "subTab") subTab: String
    ): String {
        model.addAttribute("subTab", subTab)
        model.addAttribute("positionGroups", memberService.getPositionGroups())

        return "teams/teams"
    }
}
