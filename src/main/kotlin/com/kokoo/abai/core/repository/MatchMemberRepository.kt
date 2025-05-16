package com.kokoo.abai.core.repository

import com.kokoo.abai.common.pagination.Slice
import com.kokoo.abai.core.domain.MatchMember
import com.kokoo.abai.core.dto.CursorRequest
import com.kokoo.abai.core.row.MatchMemberRow
import com.kokoo.abai.core.row.toMatchMemberRow
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
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
                it[updatedAt] = LocalDateTime.now()
            }
            findById(id)!!
        } else {
            val result = MatchMember.insert {
                it[matchId] = row.matchId
                it[memberId] = row.memberId
                it[goalsFor] = row.goalsFor
            }.resultedValues!!.first()
            findById(result[MatchMember.id])!!
        }
    }

    fun saveAll(rows: List<MatchMemberRow>) = MatchMember.batchInsert(rows) {
        this[MatchMember.matchId] = it.matchId
        this[MatchMember.memberId] = it.memberId
        this[MatchMember.goalsFor] = it.goalsFor
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

    private fun lessThanId(id: Long?): Op<Boolean> {
        return when (id) {
            null -> Op.TRUE
            else -> MatchMember.id.less(id)
        }
    }
} 