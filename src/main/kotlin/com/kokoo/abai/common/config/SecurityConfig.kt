package com.kokoo.abai.common.config

import com.kokoo.abai.core.domain.Member
import com.kokoo.abai.core.domain.MemberRole
import com.kokoo.abai.core.repository.MemberRepository
import com.kokoo.abai.core.repository.MemberRoleRepository
import org.apache.catalina.util.URLEncoder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.text.Charsets.UTF_8


@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val customUserDetailsService: CustomUserDetailsService
) {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/login").anonymous()
//                    .requestMatchers("/schedules", "/schedules/**").hasAuthority(RoleName.SERVICE_ADMIN.name)
//                    .requestMatchers("/teams", "/teams/**").hasAnyAuthority(RoleName.TEAM_ADMIN.name, RoleName.TEAM_USER.name)
                    .requestMatchers("/css/**", "/js/**", "/images/**").permitAll()
                    .anyRequest().authenticated()
            }
            .formLogin { form ->
                form
                    .loginPage("/login")
                    .defaultSuccessUrl("/", true)
                    .failureUrl("/login?message=${URLEncoder().encode("접속 정보를 다시 확인해 주세요.", UTF_8)}")
                    .permitAll()
            }
            .logout { logout ->
                logout
                    .logoutUrl("/logout")
                    .logoutSuccessUrl("/login")
                    .permitAll()
            }
            .userDetailsService(customUserDetailsService)

        return http.build()
    }

    @Bean
    fun bCryptPasswordEncoder(): BCryptPasswordEncoder {
        return BCryptPasswordEncoder()
    }

    @Service
    class CustomUserDetailsService(
        private val memberRepository: MemberRepository,
        private val memberRoleRepository: MemberRoleRepository
    ) : UserDetailsService {

        @Transactional
        override fun loadUserByUsername(username: String): UserDetails {
            val member = memberRepository.findByLoginId(username)
                ?: throw UsernameNotFoundException("User not found: $username")

            val roles = memberRoleRepository.findByMemberId(member[Member.id])
                .map { SimpleGrantedAuthority(it[MemberRole.roleId].name) }

            return User(member[Member.loginId], member[Member.password], roles)
        }
    }
}