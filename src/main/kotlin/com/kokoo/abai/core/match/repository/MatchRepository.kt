package com.kokoo.abai.core.match.repository

import com.kokoo.abai.common.pagination.Slice
import com.kokoo.abai.core.match.domain.Match
import com.kokoo.abai.core.match.enums.MatchStatus
import com.kokoo.abai.core.match.row.MatchRow
import com.kokoo.abai.core.record.row.MatchSummaryRow
import com.kokoo.abai.core.match.row.toMatchRow
import com.kokoo.abai.core.record.row.toMatchSummaryRow
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.less
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class MatchRepository {
    fun save(row: MatchRow, id: Long? = null): MatchRow {
        return if (id != null) {
            Match.update({ Match.id eq id }) {
                it[matchAt] = row.matchAt
                it[opponentName] = row.opponentName
                it[location] = row.location
                it[address] = row.address
                it[longitude] = row.longitude
                it[latitude] = row.latitude
                it[status] = row.status
                it[result] = row.result
                it[goalsFor] = row.goalsFor
                it[goalsAgainst] = row.goalsAgainst
                it[assist] = row.assist
                it[deleted] = row.deleted
                it[updatedAt] = LocalDateTime.now()
            }
            findById(id)!!
        } else {
            val result = Match.insert {
                it[matchAt] = row.matchAt
                it[opponentName] = row.opponentName
                it[location] = row.location
                it[address] = row.address
                it[longitude] = row.longitude
                it[latitude] = row.latitude
                it[status] = row.status
                it[result] = row.result
                it[goalsFor] = row.goalsFor
                it[goalsAgainst] = row.goalsAgainst
                it[assist] = row.assist
            }.resultedValues!!.first()
            findById(result[Match.id])!!
        }
    }

    fun delete(id: Long) = Match.deleteWhere { Match.id eq id }
    fun deleteSoft(id: Long) {
        Match.update({ Match.id eq id }) {
            it[deleted] = true
        }
    }

    fun findById(id: Long): MatchRow? = Match.selectAll()
        .where { Match.id eq id }
        .andWhere { Match.deleted eq false }
        .singleOrNull()?.toMatchRow()

    fun findAll(
        matchAt: LocalDateTime?,
        id: Long?,
        status: MatchStatus?,
        size: Int
    ): Slice<MatchRow> {
        var contents = Match.selectAll()
            .where { lessThanMatchAtAndId(matchAt, id) }
            .andWhere { equalStatus(status) }
            .andWhere { Match.deleted eq false }
            .orderBy(Match.matchAt to SortOrder.DESC, Match.id to SortOrder.DESC)
            .limit(size + 1)
            .map { it.toMatchRow() }

        val hasNext: Boolean = contents.size > size
        if (hasNext) {
            contents = contents.dropLast(1)
        }

        return Slice(contents, contents.size, hasNext)
    }

    fun findByMatchAtBetween(startAt: LocalDateTime, endAt: LocalDateTime): List<MatchRow> = Match.selectAll()
        .where { Match.matchAt.between(startAt, endAt) }
        .andWhere { Match.deleted eq false }
        .map { it.toMatchRow() }

    fun sumByMatchAtBetween(startAt: LocalDateTime, endAt: LocalDateTime): MatchSummaryRow = Match
        .select(
            Match.idCount,
            Match.goalsForSum,
            Match.goalsAgainstSum,
            Match.assistSum
        )
        .where { Match.matchAt.between(startAt, endAt) }
        .andWhere { Match.status eq MatchStatus.COMPLETED }
        .andWhere { Match.deleted eq false }
        .single()
        .toMatchSummaryRow()
    
    fun findByStatusAndMatchAtGraterThan(matchAt: LocalDateTime): MatchRow? = Match.selectAll()
        .where { Match.matchAt greater matchAt }
        .andWhere { Match.status eq MatchStatus.READY }
        .andWhere { Match.deleted eq false }
        .orderBy(Match.matchAt to SortOrder.ASC)
        .limit(1)
        .singleOrNull()?.toMatchRow()

    private fun lessThanMatchAtAndId(matchAt: LocalDateTime?, id: Long?): Op<Boolean> {
        return when {
            matchAt == null || id == null -> Op.TRUE
            else -> Match.matchAt.less(matchAt)
                .or { Match.matchAt.less(matchAt).and { Match.id.less(id) } }
        }
    }

    private fun equalStatus(status: MatchStatus?): Op<Boolean> {
        return when (status) {
            null -> Op.TRUE
            else -> Match.status eq status
        }
    }
} 