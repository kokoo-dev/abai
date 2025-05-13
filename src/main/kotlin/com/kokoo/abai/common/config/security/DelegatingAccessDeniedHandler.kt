package com.kokoo.abai.common.config.security

import com.fasterxml.jackson.databind.ObjectMapper
import com.kokoo.abai.common.constant.RequestPath
import com.kokoo.abai.common.error.ErrorCode
import com.kokoo.abai.common.error.ErrorResponse
import jakarta.servlet.RequestDispatcher
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.MediaType
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.web.access.AccessDeniedHandler
import org.springframework.stereotype.Component

@Component
class DelegatingAccessDeniedHandler(
    private val objectMapper: ObjectMapper
) : AccessDeniedHandler {

    override fun handle(
        request: HttpServletRequest,
        response: HttpServletResponse,
        accessDeniedException: AccessDeniedException
    ) {
        val errorCode = ErrorCode.FORBIDDEN

        if (!request.requestURI.startsWith(RequestPath.API_PREFIX)) {
            response.status = errorCode.httpStatus
            request.setAttribute(RequestDispatcher.ERROR_STATUS_CODE, errorCode.httpStatus)
            request.getRequestDispatcher("/error").forward(request, response)
        }

        response.status = errorCode.httpStatus
        response.contentType = MediaType(MediaType.APPLICATION_JSON, Charsets.UTF_8).toString()
        objectMapper.writeValue(response.writer, ErrorResponse(errorCode))
    }
}