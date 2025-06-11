package com.kokoo.abai.core.dto

import com.kokoo.abai.core.row.MemberRecordRow

data class MemberRecordResponse(
    val memberId: Long,
    val name: String,
    val uniformNumber: Int,
    val matchCount: Long,
    val goalsFor: Int,
    val assist: Int
)

fun MemberRecordRow.toResponse() = MemberRecordResponse(
    memberId = this.memberId,
    name = this.name,
    uniformNumber = this.uniformNumber,
    matchCount = this.matchCount,
    goalsFor = this.goalsFor,
    assist = this.assist,
)