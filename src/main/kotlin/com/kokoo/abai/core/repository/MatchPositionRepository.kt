package com.kokoo.abai.core.repository

import com.kokoo.abai.common.pagination.Slice
import com.kokoo.abai.core.domain.MatchPosition
import com.kokoo.abai.core.dto.CursorRequest
import com.kokoo.abai.core.row.MatchPositionRow
import com.kokoo.abai.core.row.toMatchPositionRow
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.inList
import org.jetbrains.exposed.sql.SqlExpressionBuilder.less
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class MatchPositionRepository {
    fun save(row: MatchPositionRow, id: Long? = null): MatchPositionRow {
        return if (id != null) {
            MatchPosition.update({ MatchPosition.id eq id }) {
                it[memberId] = row.memberId
                it[matchFormationId] = row.matchFormationId
                it[position] = row.position
                it[playerType] = row.playerType
                it[playerName] = row.playerName
                it[updatedAt] = LocalDateTime.now()
            }
            findById(id)!!
        } else {
            val result = MatchPosition.insert {
                it[memberId] = row.memberId
                it[matchFormationId] = row.matchFormationId
                it[position] = row.position
                it[playerType] = row.playerType
                it[playerName] = row.playerName
            }.resultedValues!!.first()
            findById(result[MatchPosition.id])!!
        }
    }

    fun saveAll(rows: List<MatchPositionRow>) = MatchPosition.batchInsert(rows) {
        this[MatchPosition.memberId] = it.memberId
        this[MatchPosition.matchFormationId] = it.matchFormationId
        this[MatchPosition.position] = it.position
        this[MatchPosition.playerType] = it.playerType
        this[MatchPosition.playerName] = it.playerName
    }.map { it.toMatchPositionRow() }

    fun delete(id: Long) = MatchPosition.deleteWhere { MatchPosition.id eq id }
    fun deleteByFormationIds(formationIds: List<Long>) =
        MatchPosition.deleteWhere { MatchPosition.matchFormationId inList formationIds }

    fun findById(id: Long): MatchPositionRow? = MatchPosition.selectAll()
        .where { MatchPosition.id eq id }
        .singleOrNull()?.toMatchPositionRow()

    fun findAll(request: CursorRequest<Long>): Slice<MatchPositionRow> {
        var contents = MatchPosition.selectAll()
            .where { lessThanId(request.lastId) }
            .orderBy(MatchPosition.id to SortOrder.DESC)
            .limit(request.size + 1)
            .map { it.toMatchPositionRow() }

        val hasNext: Boolean = contents.size > request.size
        if (hasNext) {
            contents = contents.dropLast(1)
        }

        return Slice(contents, contents.size, hasNext)
    }

    private fun lessThanId(id: Long?): Op<Boolean> {
        return when (id) {
            null -> Op.TRUE
            else -> MatchPosition.id.less(id)
        }
    }
} 