package com.kokoo.abai.core.match.dto

import com.fasterxml.jackson.annotation.JsonFormat
import java.time.OffsetDateTime

data class MatchCursorId(
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    val matchAt: OffsetDateTime? = null,
    val id: Long? = null
)