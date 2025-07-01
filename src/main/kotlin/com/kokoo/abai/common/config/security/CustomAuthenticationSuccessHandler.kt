package com.kokoo.abai.common.config.security

import com.kokoo.abai.common.extension.getClientIp
import com.kokoo.abai.core.member.repository.LoginHistoryRepository
import com.kokoo.abai.core.member.row.LoginHistoryRow
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.Authentication
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class CustomAuthenticationSuccessHandler(
    private val loginHistoryRepository: LoginHistoryRepository
) : SavedRequestAwareAuthenticationSuccessHandler() {

    @Transactional
    override fun onAuthenticationSuccess(
        request: HttpServletRequest,
        response: HttpServletResponse,
        authentication: Authentication
    ) {
        val user = authentication.principal as CustomUserDetails

        val loginHistory = LoginHistoryRow(
            memberId = user.id,
            ip = request.getClientIp()
        )

        loginHistoryRepository.save(loginHistory)

        super.onAuthenticationSuccess(request, response, authentication)
    }
}