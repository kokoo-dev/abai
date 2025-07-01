package com.kokoo.abai.web

import com.kokoo.abai.core.faq.service.FaqCategoryService
import com.kokoo.abai.core.faq.service.FaqService
import com.kokoo.abai.core.member.service.MemberService
import com.kokoo.abai.core.notice.service.NoticeCategoryService
import com.kokoo.abai.core.notice.service.NoticeService
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/see-more")
class SeeMoreWebController(
    private val memberService: MemberService,
    private val faqService: FaqService,
    private val faqCategoryService: FaqCategoryService,
    private val noticeService: NoticeService,
    private val noticeCategoryService: NoticeCategoryService
) {

    @GetMapping("")
    fun seeMore(model: Model): String {
        model.addAttribute("positions", memberService.getPositions())

        return "see-more/see-more"
    }

    @GetMapping("/notices")
    fun notices(model: Model): String {
        model.addAttribute("categories", noticeCategoryService.getAll())
        model.addAttribute("notices", noticeService.getAll())

        return "see-more/notices"
    }

    @GetMapping("/notices/{id}")
    fun notice(
        model: Model,
        @PathVariable(name = "id") id: Long
    ): String {
        model.addAttribute("notice", noticeService.get(id))

        return "see-more/notice-detail"
    }

    @PostMapping("/notices")
    fun noticeCreate(model: Model): String {
        model.addAttribute("categories", noticeCategoryService.getAll())
        model.addAttribute("isNew", true)

        return "see-more/notice-save"
    }

    @PostMapping("/notices/{id}")
    fun noticeUpdate(
        model: Model,
        @PathVariable(name = "id") id: Long
    ): String {
        model.addAttribute("categories", noticeCategoryService.getAll())
        model.addAttribute("notice", noticeService.getAndCheckPermission(id))
        model.addAttribute("isNew", false)

        return "see-more/notice-save"
    }

    @GetMapping("/faq")
    fun faq(model: Model): String {
        model.addAttribute("categories", faqCategoryService.getAll())
        model.addAttribute("faqs", faqService.getAll())

        return "see-more/faq"
    }

    @PostMapping("/faq")
    fun faqSave(model: Model): String {
        model.addAttribute("categories", faqCategoryService.getAll())

        return "see-more/faq-save"
    }
}