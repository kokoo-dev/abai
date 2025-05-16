package com.kokoo.abai.core.row

import com.kokoo.abai.core.domain.Faq
import org.jetbrains.exposed.sql.ResultRow
import java.time.LocalDateTime

data class FaqRow(
    val id: Long = 0,
    val categoryId: Long,
    val question: String,
    val answer: String,
    val createdAt: LocalDateTime? = LocalDateTime.now(),
    val updatedAt: LocalDateTime? = LocalDateTime.now()
)

fun ResultRow.toFaqRow() = FaqRow(
    id = this[Faq.id],
    categoryId = this[Faq.categoryId],
    question = this[Faq.question],
    answer = this[Faq.answer],
    createdAt = this[Faq.createdAt],
    updatedAt = this[Faq.updatedAt]
) 