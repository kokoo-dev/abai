package com.kokoo.abai.core.member.repository

import com.kokoo.abai.common.pagination.Slice
import com.kokoo.abai.core.member.domain.Member
import com.kokoo.abai.core.member.domain.MemberPosition
import com.kokoo.abai.core.common.dto.CursorRequest
import com.kokoo.abai.core.member.row.MemberPositionRow
import com.kokoo.abai.core.member.row.toMemberPositionRow
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.less
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class MemberPositionRepository {
    fun save(row: MemberPositionRow, id: Long? = null): MemberPositionRow {
        return if (id != null) {
            MemberPosition.update({ MemberPosition.id eq id }) {
                it[memberId] = row.memberId
                it[position] = row.position
                it[updatedAt] = LocalDateTime.now()
            }
            findById(id)!!
        } else {
            val result = MemberPosition.insert {
                it[memberId] = row.memberId
                it[position] = row.position
            }.resultedValues!!.first()
            findById(result[MemberPosition.id])!!
        }
    }

    fun saveAll(rows: List<MemberPositionRow>) = MemberPosition.batchInsert(rows) {
        this[MemberPosition.memberId] = it.memberId
        this[MemberPosition.position] = it.position
    }.map { it.toMemberPositionRow() }

    fun delete(id: Long) = MemberPosition.deleteWhere { MemberPosition.id eq id }

    fun findById(id: Long): MemberPositionRow? = MemberPosition.selectAll()
        .where { MemberPosition.id eq id }
        .singleOrNull()?.toMemberPositionRow()

    fun findAll(): List<MemberPositionRow> = MemberPosition.rightJoin(Member)
        .selectAll()
        .map { it.toMemberPositionRow() }

    fun findByMemberId(memberId: Long): List<MemberPositionRow> = MemberPosition
        .selectAll()
        .where { MemberPosition.memberId eq memberId }
        .map { it.toMemberPositionRow() }

    fun findAll(request: CursorRequest<Long>): Slice<MemberPositionRow> {
        var contents = MemberPosition.selectAll()
            .where { lessThanId(request.lastId) }
            .orderBy(MemberPosition.id to SortOrder.DESC)
            .limit(request.size + 1)
            .map { it.toMemberPositionRow() }

        val hasNext: Boolean = contents.size > request.size
        if (hasNext) {
            contents = contents.dropLast(1)
        }

        return Slice(contents, contents.size, hasNext)
    }

    private fun lessThanId(id: Long?): Op<Boolean> {
        return when (id) {
            null -> Op.TRUE
            else -> MemberPosition.id.less(id)
        }
    }
} 