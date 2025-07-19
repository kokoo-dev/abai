package com.kokoo.abai.web

import com.kokoo.abai.core.member.service.MemberService
import com.kokoo.abai.core.member.service.RoleService
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/admin")
class AdminWebController(
    private val memberService: MemberService,
    private val roleService: RoleService
) {

    @GetMapping("/members")
    fun members(model: Model): String {
        model.addAttribute("positionGroups", memberService.getPositionGroups())
        model.addAttribute("memberStatuses", memberService.getMemberStatuses())
        model.addAttribute("lowerRoles", roleService.getLowerRoles())

        return "admin/members"
    }
} 