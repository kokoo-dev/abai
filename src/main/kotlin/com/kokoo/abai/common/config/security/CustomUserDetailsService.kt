package com.kokoo.abai.common.config.security

import com.kokoo.abai.core.member.repository.MemberRepository
import com.kokoo.abai.core.member.repository.MemberRoleRepository
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class CustomUserDetailsService(
    private val memberRepository: MemberRepository,
    private val memberRoleRepository: MemberRoleRepository
) : UserDetailsService {

    @Transactional
    override fun loadUserByUsername(username: String): UserDetails {
        val member = memberRepository.findByLoginIdAndStatus(username)
            ?: throw UsernameNotFoundException("User not found: $username")

        val roles = memberRoleRepository.findByMemberId(member.id)
            .map { SimpleGrantedAuthority(it.roleId.name) }

        return CustomUserDetails(
            id = member.id,
            username = member.loginId,
            password = member.password,
            authorities = roles
        )
    }
}