package com.kokoo.abai.core.repository

import com.kokoo.abai.common.pagination.Slice
import com.kokoo.abai.core.domain.MatchGuest
import com.kokoo.abai.core.dto.CursorRequest
import com.kokoo.abai.core.row.MatchGuestRow
import com.kokoo.abai.core.row.toMatchGuestRow
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.less
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class MatchGuestRepository {
    fun save(row: MatchGuestRow, id: Long? = null): MatchGuestRow {
        return if (id != null) {
            MatchGuest.update({ MatchGuest.id eq id }) {
                it[matchId] = row.matchId
                it[guestId] = row.guestId
                it[goalsFor] = row.goalsFor
                it[updatedAt] = LocalDateTime.now()
            }
            findById(id)!!
        } else {
            val result = MatchGuest.insert {
                it[matchId] = row.matchId
                it[guestId] = row.guestId
                it[goalsFor] = row.goalsFor
            }.resultedValues!!.first()
            findById(result[MatchGuest.id])!!
        }
    }

    fun saveAll(rows: List<MatchGuestRow>) = MatchGuest.batchInsert(rows) {
        this[MatchGuest.matchId] = it.matchId
        this[MatchGuest.guestId] = it.guestId
        this[MatchGuest.goalsFor] = it.goalsFor
    }.map { it.toMatchGuestRow() }

    fun delete(id: Long) = MatchGuest.deleteWhere { MatchGuest.id eq id }
    fun deleteByMatchId(matchId: Long) = MatchGuest.deleteWhere { MatchGuest.matchId eq matchId }

    fun findById(id: Long): MatchGuestRow? = MatchGuest.selectAll()
        .where { MatchGuest.id eq id }
        .singleOrNull()?.toMatchGuestRow()

    fun findAll(request: CursorRequest<Long>): Slice<MatchGuestRow> {
        var contents = MatchGuest.selectAll()
            .where { lessThanId(request.lastId) }
            .orderBy(MatchGuest.id to SortOrder.DESC)
            .limit(request.size + 1)
            .map { it.toMatchGuestRow() }

        val hasNext: Boolean = contents.size > request.size
        if (hasNext) {
            contents = contents.dropLast(1)
        }

        return Slice(contents, contents.size, hasNext)
    }

    private fun lessThanId(id: Long?): Op<Boolean> {
        return when (id) {
            null -> Op.TRUE
            else -> MatchGuest.id.less(id)
        }
    }
} 