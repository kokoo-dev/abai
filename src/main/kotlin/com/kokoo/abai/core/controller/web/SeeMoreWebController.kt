package com.kokoo.abai.core.controller.web

import com.kokoo.abai.core.service.FaqCategoryService
import com.kokoo.abai.core.service.FaqService
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/see-more")
class SeeMoreWebController(
    private val faqService: FaqService,
    private val faqCategoryService: FaqCategoryService
) {

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