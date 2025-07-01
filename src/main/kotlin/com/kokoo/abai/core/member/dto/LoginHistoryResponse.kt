package com.kokoo.abai.core.member.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.kokoo.abai.core.member.row.LoginHistoryRow
import java.time.OffsetDateTime
import java.time.ZoneOffset

data class LoginHistoryResponse(
    val id: Long,
    val ip: String,

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    val createdAt: OffsetDateTime = OffsetDateTime.now(),
)

fun LoginHistoryRow.toResponse() = LoginHistoryResponse(
    id = this.id,
    ip = this.ip,
    createdAt = this.createdAt!!.atOffset(ZoneOffset.UTC)
)