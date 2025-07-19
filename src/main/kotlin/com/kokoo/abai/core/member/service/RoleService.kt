package com.kokoo.abai.core.member.service

import com.kokoo.abai.common.extension.getMyHighestRole
import com.kokoo.abai.core.common.dto.EnumResponse
import com.kokoo.abai.core.member.enums.RoleId
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class RoleService {

    fun getLowerRoles(): List<EnumResponse> {
        val myHighestRole = SecurityContextHolder.getContext().getMyHighestRole()

        return RoleId.entries
            .filter { myHighestRole.level < it.level }
            .map { EnumResponse(name = it.koreanName, value = it.name) }
    }
}