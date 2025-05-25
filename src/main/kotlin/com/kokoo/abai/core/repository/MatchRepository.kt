package com.kokoo.abai.core.repository

import com.kokoo.abai.common.pagination.Slice
import com.kokoo.abai.core.domain.Match
import com.kokoo.abai.core.dto.CursorRequest
import com.kokoo.abai.core.dto.MatchCursorId
import com.kokoo.abai.core.enums.MatchStatus
import com.kokoo.abai.core.row.MatchRow
import com.kokoo.abai.core.row.toMatchRow
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
            }.resultedValues!!.first()
            findById(result[Match.id])!!
        }
    }

    fun delete(id: Long) = Match.deleteWhere { Match.id eq id }

    fun findById(id: Long): MatchRow? = Match.selectAll()
        .where { Match.id eq id }
        .singleOrNull()?.toMatchRow()

    fun findAll(
        matchAt: LocalDateTime?,
        id: Long?,
        status: MatchStatus?,
        size: Int
    ): Slice<MatchRow> {
        var contents = Match.selectAll()
            .where { lessThanMatchAndId(matchAt, id) }
            .andWhere { equalStatus(status) }
            .orderBy(Match.matchAt to SortOrder.DESC, Match.id to SortOrder.DESC)
            .limit(size + 1)
            .map { it.toMatchRow() }

        val hasNext: Boolean = contents.size > size
        if (hasNext) {
            contents = contents.dropLast(1)
        }

        return Slice(contents, contents.size, hasNext)
    }

    private fun lessThanMatchAndId(matchAt: LocalDateTime?, id: Long?): Op<Boolean> {
        return when {
            matchAt == null || id == null -> Op.TRUE
            else -> Match.matchAt.less(matchAt)
                .or { Match.matchAt.less(matchAt).and { Match.id.less(id) } }
        }
    }

    private fun equalStatus(status: MatchStatus?): Op<Boolean> {
        return when(status) {
            null -> Op.TRUE
            else -> Match.status eq status
        }
    }
} 