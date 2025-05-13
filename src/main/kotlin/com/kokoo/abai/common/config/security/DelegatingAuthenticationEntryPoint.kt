package com.kokoo.abai.common.config.security

import com.fasterxml.jackson.databind.ObjectMapper
import com.kokoo.abai.common.constant.RequestPath
import com.kokoo.abai.common.error.ErrorCode
import com.kokoo.abai.common.error.ErrorResponse
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.MediaType
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.stereotype.Component
import kotlin.text.Charsets.UTF_8

@Component
class DelegatingAuthenticationEntryPoint(
    private val objectMapper: ObjectMapper
) : AuthenticationEntryPoint {

    override fun commence(
        request: HttpServletRequest,
        response: HttpServletResponse,
        authException: AuthenticationException
    ) {
        if (!request.requestURI.startsWith(RequestPath.API_PREFIX)) {
            response.sendRedirect("/login")
        }

        val errorCode = ErrorCode.UNAUTHORIZED
        response.status = errorCode.httpStatus
        response.contentType = MediaType(MediaType.APPLICATION_JSON, UTF_8).toString()
        objectMapper.writeValue(response.writer, ErrorResponse(errorCode))
    }
}