package com.kokoo.abai.core.member.dto

import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern

data class PasswordChangeRequest(
    @field:NotNull
    val currentPassword: String,

    @field:Pattern(regexp = "(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+\$).{8,20}")
    val newPassword: String
)
