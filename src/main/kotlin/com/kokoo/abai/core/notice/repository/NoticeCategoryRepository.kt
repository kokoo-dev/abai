package com.kokoo.abai.core.notice.repository

import com.kokoo.abai.core.notice.domain.NoticeCategory
import com.kokoo.abai.core.notice.row.NoticeCategoryRow
import com.kokoo.abai.core.notice.row.toNoticeCategoryRow
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class NoticeCategoryRepository {
    fun save(row: NoticeCategoryRow, id: Long? = null): NoticeCategoryRow {
        return if (id != null) {
            NoticeCategory.update({ NoticeCategory.id eq id }) {
                it[name] = row.name
                it[order] = row.order
                it[markColor] = row.markColor
                it[updatedAt] = LocalDateTime.now()
            }
            findById(id)!!
        } else {
            NoticeCategory.insert {
                it[name] = row.name
                it[order] = row.order
                it[markColor] = row.markColor
            }.resultedValues!!.first().toNoticeCategoryRow()
        }
    }

    fun delete(id: Long) = NoticeCategory.deleteWhere { NoticeCategory.id.eq(id) }

    fun findById(id: Long): NoticeCategoryRow? = NoticeCategory.select(NoticeCategory.columns)
        .where { NoticeCategory.id.eq(id) }
        .singleOrNull()?.toNoticeCategoryRow()

    fun findAll(): List<NoticeCategoryRow> = NoticeCategory.selectAll()
        .orderBy(NoticeCategory.order to SortOrder.ASC)
        .map { it.toNoticeCategoryRow() }
} 