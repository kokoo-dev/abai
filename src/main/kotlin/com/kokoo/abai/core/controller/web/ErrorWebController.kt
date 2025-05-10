package com.kokoo.abai.core.controller.web

import jakarta.servlet.RequestDispatcher
import jakarta.servlet.http.HttpServletRequest
import org.springframework.boot.web.servlet.error.ErrorController
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.RequestMapping

@Controller
class ErrorWebController : ErrorController {

    @RequestMapping(value = ["/error"])
    fun handleError(model: Model, request: HttpServletRequest): String {
        val status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE) as Int
        val reason = HttpStatus.valueOf(status).reasonPhrase

        model.addAttribute("status", status)
        model.addAttribute("reason", reason)

        return "error"
    }
}