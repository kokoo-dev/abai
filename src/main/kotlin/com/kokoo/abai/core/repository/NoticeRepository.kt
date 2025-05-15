package com.kokoo.abai.core.repository

import com.kokoo.abai.core.domain.Member
import com.kokoo.abai.core.domain.Notice
import com.kokoo.abai.core.domain.NoticeCategory
import com.kokoo.abai.core.row.NoticeRow
import com.kokoo.abai.core.row.toNoticeRow
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.plus
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class NoticeRepository {
    fun save(row: NoticeRow, id: Long? = null): NoticeRow {
        return if (id != null) {
            Notice.update({ Notice.id eq id }) {
                it[memberId] = row.memberId
                it[categoryId] = row.categoryId
                it[title] = row.title
                it[content] = row.content
                it[updatedAt] = LocalDateTime.now()
            }
            findById(id)!!
        } else {
            val result = Notice.insert {
                it[memberId] = row.memberId
                it[categoryId] = row.categoryId
                it[title] = row.title
                it[content] = row.content
            }.resultedValues!!.first()
            findById(result[Notice.id])!!
        }
    }

    fun increaseViewCount(id: Long) {
        Notice.update({ Notice.id eq id}) {
            it[viewCount] = Notice.viewCount + 1
        }
    }

    fun delete(id: Long) = Notice.deleteWhere { Notice.id.eq(id) }

    fun findById(id: Long): NoticeRow? = Notice.innerJoin(Member)
        .innerJoin(NoticeCategory)
        .selectAll()
        .where { Notice.id.eq(id) }
        .singleOrNull()?.toNoticeRow()

    fun findAll(): List<NoticeRow> = Notice.innerJoin(Member)
        .innerJoin(NoticeCategory)
        .selectAll()
        .orderBy(Notice.id to SortOrder.DESC)
        .map { it.toNoticeRow() }

    fun findByCategory(categoryId: Long): List<NoticeRow> = Notice.select(Notice.columns)
        .where { Notice.categoryId.eq(categoryId) }
        .orderBy(Notice.id to SortOrder.DESC)
        .map { it.toNoticeRow() }
} 