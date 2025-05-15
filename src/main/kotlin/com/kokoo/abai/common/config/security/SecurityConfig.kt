package com.kokoo.abai.common.config.security

import com.kokoo.abai.core.enums.RoleId
import org.apache.catalina.util.URLEncoder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import kotlin.text.Charsets.UTF_8

@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val customUserDetailsService: CustomUserDetailsService,
    private val authEntryPoint: DelegatingAuthenticationEntryPoint,
    private val accessDeniedHandler: DelegatingAccessDeniedHandler
) {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/login").anonymous()
//                    .requestMatchers("/schedules", "/schedules/**").hasAuthority(RoleName.SERVICE_ADMIN.name)
//                    .requestMatchers("/teams", "/teams/**").hasAnyAuthority(RoleId.TEAM_ADMIN.name, RoleId.TEAM_USER.name)
//                    .requestMatchers("/api/test").hasAnyAuthority(RoleName.TEAM_ADMIN.name)
                    .requestMatchers("/api/**").permitAll() // TODO 완료 후 권한 적용
                    .requestMatchers("/css/**", "/js/**", "/images/**").permitAll() // resource
                    .requestMatchers("/health-check").anonymous() // health check
                    .anyRequest().authenticated()
            }
            .csrf { csrf ->
                csrf.ignoringRequestMatchers("/api/**") // TODO 완료 후 권한 적용
            }
            .formLogin { form ->
                form
                    .loginPage("/login")
                    .defaultSuccessUrl("/", false)
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
            .exceptionHandling { exception ->
                exception
                    .authenticationEntryPoint(authEntryPoint)
                    .accessDeniedHandler(accessDeniedHandler)
            }

        return http.build()
    }

    @Bean
    fun bCryptPasswordEncoder(): BCryptPasswordEncoder = BCryptPasswordEncoder()
}