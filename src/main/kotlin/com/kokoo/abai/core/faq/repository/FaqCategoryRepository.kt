package com.kokoo.abai.core.faq.repository

import com.kokoo.abai.core.faq.domain.FaqCategory
import com.kokoo.abai.core.faq.row.FaqCategoryRow
import com.kokoo.abai.core.faq.row.toFaqCategoryRow
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class FaqCategoryRepository {
    fun save(row: FaqCategoryRow, id: Long? = null): FaqCategoryRow {
        return if (id != null) {
            FaqCategory.update({ FaqCategory.id eq id }) {
                it[name] = row.name
                it[order] = row.order
                it[updatedAt] = LocalDateTime.now()
            }
            findById(id)!!
        } else {
            FaqCategory.insert {
                it[name] = row.name
                it[order] = row.order
            }.resultedValues!!.first().toFaqCategoryRow()
        }
    }

    fun delete(id: Long) = FaqCategory.deleteWhere { FaqCategory.id.eq(id) }

    fun findById(id: Long): FaqCategoryRow? = FaqCategory.select(FaqCategory.columns)
        .where { FaqCategory.id.eq(id) }
        .singleOrNull()?.toFaqCategoryRow()

    fun findAll(): List<FaqCategoryRow> = FaqCategory.selectAll()
        .orderBy(FaqCategory.order to SortOrder.ASC)
        .map { it.toFaqCategoryRow() }
} 