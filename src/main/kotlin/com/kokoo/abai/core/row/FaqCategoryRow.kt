package com.kokoo.abai.core.row

import com.kokoo.abai.core.domain.FaqCategory
import org.jetbrains.exposed.sql.ResultRow
import java.time.LocalDateTime

data class FaqCategoryRow(
    val id: Long,
    val name: String,
    val order: Int,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

fun ResultRow.toFaqCategoryRow() = FaqCategoryRow(
    id = this[FaqCategory.id],
    name = this[FaqCategory.name],
    order = this[FaqCategory.order],
    createdAt = this[FaqCategory.createdAt],
    updatedAt = this[FaqCategory.updatedAt]
) 