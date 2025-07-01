package com.kokoo.abai.core.faq.repository

import com.kokoo.abai.core.faq.domain.Faq
import com.kokoo.abai.core.faq.domain.FaqCategory
import com.kokoo.abai.core.faq.row.FaqRow
import com.kokoo.abai.core.faq.row.toFaqRow
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class FaqRepository {
    fun save(row: FaqRow, id: Long? = null): FaqRow {
        return if (id != null) {
            Faq.update({ Faq.id eq id }) {
                it[categoryId] = row.categoryId
                it[question] = row.question
                it[answer] = row.answer
                it[updatedAt] = LocalDateTime.now()
            }
            findById(id)!!
        } else {
            Faq.insert {
                it[categoryId] = row.categoryId
                it[question] = row.question
                it[answer] = row.answer
            }.resultedValues!!.first().toFaqRow()
        }
    }

    fun delete(id: Long) = Faq.deleteWhere { Faq.id eq id }

    fun findById(id: Long): FaqRow? = Faq.select(Faq.columns)
        .where { Faq.id eq id }
        .singleOrNull()?.toFaqRow()

    fun findAll(): List<FaqRow> = Faq.innerJoin(FaqCategory)
        .selectAll()
        .orderBy(Faq.id to SortOrder.DESC)
        .map { it.toFaqRow() }

    fun findByCategory(categoryId: Long): List<FaqRow> = Faq.select(Faq.columns)
        .where { Faq.categoryId eq categoryId }
        .orderBy(Faq.id to SortOrder.DESC)
        .map { it.toFaqRow() }
} 