package com.kokoo.abai.core.my.dto

import com.kokoo.abai.core.member.enums.Position
import jakarta.validation.constraints.NotBlank
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate

data class MyProfileSaveRequest(
    @field:NotBlank
    val name: String,
    val height: Int,
    val weight: Int,
    val leftFoot: Int,
    val rightFoot: Int,

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    val birthday: LocalDate,

    val deletePositions: List<Position>,
    val createPositions: List<Position>,
)