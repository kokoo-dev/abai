package com.kokoo.abai.core.repository

import com.kokoo.abai.common.pagination.Slice
import com.kokoo.abai.core.domain.MatchFormation
import com.kokoo.abai.core.dto.CursorRequest
import com.kokoo.abai.core.row.MatchFormationRow
import com.kokoo.abai.core.row.toMatchFormationRow
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.less
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class MatchFormationRepository {
    fun save(row: MatchFormationRow, id: Long? = null): MatchFormationRow {
        return if (id != null) {
            MatchFormation.update({ MatchFormation.id eq id }) {
                it[matchId] = row.matchId
                it[quarter] = row.quarter
                it[formation] = row.formation
                it[goalsFor] = row.goalsFor
                it[goalsAgainst] = row.goalsAgainst
                it[updatedAt] = LocalDateTime.now()
            }
            findById(id)!!
        } else {
            val result = MatchFormation.insert {
                it[matchId] = row.matchId
                it[quarter] = row.quarter
                it[formation] = row.formation
                it[goalsFor] = row.goalsFor
                it[goalsAgainst] = row.goalsAgainst
            }.resultedValues!!.first()
            findById(result[MatchFormation.id])!!
        }
    }

    fun delete(id: Long) = MatchFormation.deleteWhere { MatchFormation.id eq id }
    fun deleteByMatchId(matchId: Long) = MatchFormation.deleteWhere { MatchFormation.matchId eq matchId }

    fun findById(id: Long): MatchFormationRow? = MatchFormation.selectAll()
        .where { MatchFormation.id.eq(id) }
        .singleOrNull()?.toMatchFormationRow()

    fun findAll(request: CursorRequest<Long>): Slice<MatchFormationRow> {
        var contents = MatchFormation.selectAll()
            .where { lessThanId(request.lastId) }
            .orderBy(MatchFormation.id to SortOrder.DESC)
            .limit(request.size + 1)
            .map { it.toMatchFormationRow() }

        val hasNext: Boolean = contents.size > request.size
        if (hasNext) {
            contents = contents.dropLast(1)
        }

        return Slice(contents, contents.size, hasNext)
    }

    fun findByMatchId(matchId: Long): List<MatchFormationRow> = MatchFormation.selectAll()
        .where { MatchFormation.matchId eq matchId }
        .map { it.toMatchFormationRow() }

    private fun lessThanId(id: Long?): Op<Boolean> {
        return when (id) {
            null -> Op.TRUE
            else -> MatchFormation.id.less(id)
        }
    }
} 