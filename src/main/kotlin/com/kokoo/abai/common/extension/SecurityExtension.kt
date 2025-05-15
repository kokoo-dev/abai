package com.kokoo.abai.common.extension

import com.kokoo.abai.common.config.security.CustomUserDetails
import com.kokoo.abai.common.error.ErrorCode
import com.kokoo.abai.common.exception.BusinessException
import com.kokoo.abai.core.enums.RoleId
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContext

fun SecurityContext.getPrincipalOrThrow(): CustomUserDetails {
    val authentication = this.authentication
    if (authentication == null || !authentication.isAuthenticated) {
        throw BusinessException(ErrorCode.UNAUTHORIZED)
    }

    return authentication.principal as CustomUserDetails
}

fun SecurityContext.getPrincipalOrThrow(memberId: Long): CustomUserDetails {
    val authentication = this.authentication
    if (authentication == null || !authentication.isAuthenticated) {
        throw BusinessException(ErrorCode.UNAUTHORIZED)
    }

    val userDetails = authentication.principal as CustomUserDetails
    if (!userDetails.authorities.contains(SimpleGrantedAuthority(RoleId.SERVICE_ADMIN.name)) && userDetails.id != memberId) {
        throw BusinessException(ErrorCode.FORBIDDEN)
    }

    return userDetails
}

fun SecurityContext.hasPermission(memberId: Long): Boolean {
    val authentication = this.authentication
    if (authentication == null || !authentication.isAuthenticated) {
        throw BusinessException(ErrorCode.UNAUTHORIZED)
    }

    val userDetails = authentication.principal as CustomUserDetails

    return userDetails.authorities.contains(SimpleGrantedAuthority(RoleId.SERVICE_ADMIN.name)) || userDetails.id == memberId
}