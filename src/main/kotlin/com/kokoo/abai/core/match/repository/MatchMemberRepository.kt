package com.kokoo.abai.core.match.repository

import com.kokoo.abai.common.pagination.Slice
import com.kokoo.abai.core.match.domain.Match
import com.kokoo.abai.core.match.domain.MatchMember
import com.kokoo.abai.core.member.domain.Member
import com.kokoo.abai.core.common.dto.CursorRequest
import com.kokoo.abai.core.match.row.MatchMemberRow
import com.kokoo.abai.core.match.row.toMatchMemberRow
import com.kokoo.abai.core.record.row.AssistRankRow
import com.kokoo.abai.core.record.row.GoalRankRow
import com.kokoo.abai.core.record.row.MemberRecordRow
import com.kokoo.abai.core.record.row.toAssistRankRow
import com.kokoo.abai.core.record.row.toGoalRankRow
import com.kokoo.abai.core.record.row.toMemberRecordRow
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.isNull
import org.jetbrains.exposed.sql.SqlExpressionBuilder.less
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class MatchMemberRepository {
    fun save(row: MatchMemberRow, id: Long? = null): MatchMemberRow {
        return if (id != null) {
            MatchMember.update({ MatchMember.id eq id }) {
                it[matchId] = row.matchId
                it[memberId] = row.memberId
                it[goalsFor] = row.goalsFor
                it[assist] = row.assist
                it[updatedAt] = LocalDateTime.now()
            }
            findById(id)!!
        } else {
            val result = MatchMember.insert {
                it[matchId] = row.matchId
                it[memberId] = row.memberId
                it[goalsFor] = row.goalsFor
                it[assist] = row.assist
            }.resultedValues!!.first()
            findById(result[MatchMember.id])!!
        }
    }

    fun saveAll(rows: List<MatchMemberRow>) = MatchMember.batchInsert(rows) {
        this[MatchMember.matchId] = it.matchId
        this[MatchMember.memberId] = it.memberId
        this[MatchMember.goalsFor] = it.goalsFor
        this[MatchMember.assist] = it.assist
    }.map { it.toMatchMemberRow() }

    fun delete(id: Long) = MatchMember.deleteWhere { MatchMember.id eq id }
    fun deleteByMatchId(matchId: Long) = MatchMember.deleteWhere { MatchMember.matchId eq matchId }

    fun findById(id: Long): MatchMemberRow? = MatchMember.selectAll()
        .where { MatchMember.id eq id }
        .singleOrNull()?.toMatchMemberRow()

    fun findAll(request: CursorRequest<Long>): Slice<MatchMemberRow> {
        var contents = MatchMember.selectAll()
            .where { lessThanId(request.lastId) }
            .orderBy(MatchMember.id to SortOrder.DESC)
            .limit(request.size + 1)
            .map { it.toMatchMemberRow() }

        val hasNext: Boolean = contents.size > request.size
        if (hasNext) {
            contents = contents.dropLast(1)
        }

        return Slice(contents, contents.size, hasNext)
    }

    fun findByMatchId(matchId: Long): List<MatchMemberRow> =
        MatchMember.innerJoin(Member).selectAll()
            .where { MatchMember.matchId eq matchId }
            .map { it.toMatchMemberRow() }

    fun topGoalsByMatchAtBetween(
        startAt: LocalDateTime,
        endAt: LocalDateTime,
        limit: Int = 1
    ): List<GoalRankRow> {
        val topGoal = topGoalsOrAssistsSubQuery(startAt, endAt)

        return Member
            .join(
                otherTable = topGoal,
                joinType = JoinType.LEFT,
                onColumn = Member.id,
                otherColumn = topGoal[MatchMember.memberId]
            )
            .select(
                Member.id,
                Member.name,
                topGoal[MatchMember.goalsForSum],
                topGoal[MatchMember.assistSum]
            )
            .orderBy(
                topGoal[MatchMember.goalsForSum].isNull() to SortOrder.ASC,
                MatchMember.goalsForSum to SortOrder.DESC,
                MatchMember.assistSum to SortOrder.DESC
            )
            .limit(limit)
            .map { it.toGoalRankRow(topGoal) }
    }

    fun topAssistsByMatchAtBetween(
        startAt: LocalDateTime,
        endAt: LocalDateTime,
        limit: Int = 1
    ): List<AssistRankRow> {
        val topAssist = topGoalsOrAssistsSubQuery(startAt, endAt)

        return Member
            .join(
                otherTable = topAssist,
                joinType = JoinType.LEFT,
                onColumn = Member.id,
                otherColumn = topAssist[MatchMember.memberId]
            )
            .select(
                Member.id,
                Member.name,
                topAssist[MatchMember.goalsForSum],
                topAssist[MatchMember.assistSum]
            )
            .orderBy(
                topAssist[MatchMember.assistSum].isNull() to SortOrder.ASC,
                MatchMember.assistSum to SortOrder.DESC,
                MatchMember.goalsForSum to SortOrder.DESC
            )
            .limit(limit)
            .map { it.toAssistRankRow(topAssist) }
    }

    fun findAllByMatchAtBetween(
        startAt: LocalDateTime,
        endAt: LocalDateTime
    ): List<MemberRecordRow> {
        val record = MatchMember.innerJoin(Match)
            .select(
                MatchMember.memberId,
                MatchMember.idCount,
                MatchMember.goalsForSum,
                MatchMember.assistSum
            )
            .where { Match.matchAt.between(startAt, endAt) }
            .andWhere { Match.deleted eq false }
            .groupBy(MatchMember.memberId)
            .alias("record")

        return Member
            .join(
                otherTable = record,
                joinType = JoinType.LEFT,
                onColumn = Member.id,
                otherColumn = record[MatchMember.memberId]
            )
            .select(
                Member.id,
                Member.name,
                Member.uniformNumber,
                record[MatchMember.idCount],
                record[MatchMember.goalsForSum],
                record[MatchMember.assistSum]
            )
            .map { it.toMemberRecordRow(record) }
    }

    private fun topGoalsOrAssistsSubQuery(
        startAt: LocalDateTime,
        endAt: LocalDateTime
    ): QueryAlias = MatchMember.innerJoin(Match)
        .select(
            MatchMember.memberId,
            MatchMember.goalsForSum,
            MatchMember.assistSum
        )
        .where { Match.matchAt.between(startAt, endAt) }
        .andWhere { Match.deleted eq false }
        .groupBy(MatchMember.memberId)
        .alias("top")

    private fun lessThanId(id: Long?): Op<Boolean> {
        return when (id) {
            null -> Op.TRUE
            else -> MatchMember.id.less(id)
        }
    }
} 