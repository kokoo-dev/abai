package com.kokoo.abai.core.repository

import com.kokoo.abai.core.domain.Guest
import com.kokoo.abai.core.row.GuestRow
import com.kokoo.abai.core.row.toGuestRow
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.springframework.stereotype.Repository

@Repository
class GuestRepository {
    fun save(row: GuestRow): GuestRow {
        val result = Guest.insert {
            it[id] = row.id
            it[name] = row.name
        }.resultedValues!!.first()

        return findById(result[Guest.id])!!
    }

    fun saveAll(rows: List<GuestRow>) = Guest.batchInsert(rows) {
        this[Guest.id] = it.id
        this[Guest.name] = it.name
    }.map { it.toGuestRow() }

    fun delete(id: String) = Guest.deleteWhere { Guest.id eq id }

    fun findById(id: String): GuestRow? = Guest.selectAll()
        .where { Guest.id eq id }
        .singleOrNull()?.toGuestRow()
} 