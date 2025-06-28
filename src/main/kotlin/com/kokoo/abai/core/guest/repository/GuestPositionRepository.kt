package com.kokoo.abai.core.guest.repository

import com.kokoo.abai.core.guest.domain.GuestPosition
import com.kokoo.abai.core.guest.row.GuestPositionRow
import com.kokoo.abai.core.guest.row.toGuestPositionRow
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class GuestPositionRepository {
    fun save(row: GuestPositionRow, id: Long? = null): GuestPositionRow {
        return if (id != null) {
            GuestPosition.update({ GuestPosition.id eq id }) {
                it[guestId] = row.guestId
                it[position] = row.position
                it[updatedAt] = LocalDateTime.now()
            }
            findById(id)!!
        } else {
            val result = GuestPosition.insert {
                it[guestId] = row.guestId
                it[position] = row.position
            }.resultedValues!!.first()
            findById(result[GuestPosition.id])!!
        }
    }

    fun saveAll(rows: List<GuestPositionRow>) = GuestPosition.batchInsert(rows) {
        this[GuestPosition.guestId] = it.guestId
        this[GuestPosition.position] = it.position
    }.map { it.toGuestPositionRow() }

    fun delete(id: Long) = GuestPosition.deleteWhere { GuestPosition.id eq id }

    fun findById(id: Long): GuestPositionRow? = GuestPosition.selectAll()
        .where { GuestPosition.id eq id }
        .singleOrNull()?.toGuestPositionRow()

    fun findByGuestId(guestId: String): List<GuestPositionRow> = GuestPosition
        .selectAll()
        .where { GuestPosition.guestId eq guestId }
        .map { it.toGuestPositionRow() }
} 