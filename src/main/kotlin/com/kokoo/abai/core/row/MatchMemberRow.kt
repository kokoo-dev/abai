package com.kokoo.abai.core.row

import com.kokoo.abai.core.domain.MatchMember
import org.jetbrains.exposed.sql.ResultRow
import java.time.LocalDateTime

data class MatchMemberRow(
    val id: Long = 0,
    val matchId: Long,
    val memberId: Long,
    val goalsFor: Int = 0,
    val createdAt: LocalDateTime? = LocalDateTime.now(),
    val updatedAt: LocalDateTime? = LocalDateTime.now()
)

fun ResultRow.toMatchMemberRow() = MatchMemberRow(
    id = this[MatchMember.id],
    matchId = this[MatchMember.matchId],
    memberId = this[MatchMember.memberId],
    goalsFor = this[MatchMember.goalsFor],
    createdAt = this[MatchMember.createdAt],
    updatedAt = this[MatchMember.updatedAt]
) 