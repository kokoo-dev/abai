package com.kokoo.abai.web

import com.kokoo.abai.common.exception.BusinessException
import jakarta.servlet.RequestDispatcher
import jakarta.servlet.http.HttpServletRequest
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes
import org.springframework.boot.web.servlet.error.ErrorController
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.context.request.ServletWebRequest

@Controller
class ErrorWebController(
    private val errorAttributes: DefaultErrorAttributes
) : ErrorController {

    @RequestMapping(value = ["/error"])
    fun handleError(model: Model, request: HttpServletRequest): String {
        val webRequest = ServletWebRequest(request)
        val error = errorAttributes.getError(webRequest)

        if (error is BusinessException) {
            model.addAttribute("status", error.errorCode.httpStatus)
            model.addAttribute("reason", error.errorCode.message)
        } else {
            val status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE) as Int
            val reason = HttpStatus.valueOf(status).reasonPhrase

            model.addAttribute("status", status)
            model.addAttribute("reason", reason)
        }

        return "error"
    }
}