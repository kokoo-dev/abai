package com.kokoo.abai.core.member.repository

import com.kokoo.abai.common.pagination.Slice
import com.kokoo.abai.core.member.domain.LoginHistory
import com.kokoo.abai.core.common.dto.CursorRequest
import com.kokoo.abai.core.member.row.LoginHistoryRow
import com.kokoo.abai.core.member.row.toLoginHistoryRow
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.less
import org.springframework.stereotype.Repository

@Repository
class LoginHistoryRepository {
    fun save(row: LoginHistoryRow): LoginHistoryRow = LoginHistory.insert {
        it[memberId] = row.memberId
        it[ip] = row.ip
    }.resultedValues!!.first().toLoginHistoryRow()

    fun findById(id: Long): LoginHistoryRow? = LoginHistory.selectAll()
        .where { LoginHistory.id eq id }
        .singleOrNull()?.toLoginHistoryRow()

    fun findByMemberId(
        memberId: Long,
        id: Long?,
        size: Int
    ): Slice<LoginHistoryRow> {
        var contents = LoginHistory.selectAll()
            .where { equalsMemberId(memberId) }
            .andWhere { lessThanId(id) }
            .orderBy(LoginHistory.id to SortOrder.DESC)
            .limit(size + 1)
            .map { it.toLoginHistoryRow() }

        val hasNext: Boolean = contents.size > size
        if (hasNext) {
            contents = contents.dropLast(1)
        }

        return Slice(contents, contents.size, hasNext)
    }

    private fun equalsMemberId(memberId: Long?): Op<Boolean> {
        return when (memberId) {
            null -> Op.TRUE
            else -> LoginHistory.memberId eq memberId
        }
    }

    private fun lessThanId(id: Long?): Op<Boolean> {
        return when (id) {
            null -> Op.TRUE
            else -> LoginHistory.id less id
        }
    }
} 