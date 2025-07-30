package com.kokoo.abai.core.equipment.repository

import com.kokoo.abai.common.pagination.Slice
import com.kokoo.abai.core.member.domain.Member
import com.kokoo.abai.core.equipment.domain.Equipment
import com.kokoo.abai.core.equipment.enums.EquipmentStatus
import com.kokoo.abai.core.equipment.enums.EquipmentType
import com.kokoo.abai.core.equipment.row.EquipmentRow
import com.kokoo.abai.core.equipment.row.toEquipmentRow
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.less
import org.jetbrains.exposed.sql.SqlExpressionBuilder.like
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class EquipmentRepository {
    fun save(row: EquipmentRow, id: Long? = null): EquipmentRow {
        return if (id != null) {
            Equipment.update({ Equipment.id eq id }) {
                it[memberId] = row.memberId
                it[name] = row.name
                it[description] = row.description
                it[type] = row.type
                it[status] = row.status
                it[updatedAt] = LocalDateTime.now()
            }
            findById(id)!!
        } else {
            val result = Equipment.insert {
                it[memberId] = row.memberId
                it[name] = row.name
                it[description] = row.description
                it[type] = row.type
                it[status] = row.status
            }.resultedValues!!.first()
            findById(result[Equipment.id])!!
        }
    }

    fun saveAll(rows: List<EquipmentRow>) = Equipment.batchInsert(rows) {
        this[Equipment.memberId] = it.memberId
        this[Equipment.name] = it.name
        this[Equipment.description] = it.description
        this[Equipment.type] = it.type
        this[Equipment.status] = it.status
    }.map { it.toEquipmentRow() }

    fun delete(id: Long) = Equipment.deleteWhere { Equipment.id eq id }

    fun findById(id: Long): EquipmentRow? = Equipment.innerJoin(Member)
        .selectAll()
        .where { Equipment.id eq id }
        .singleOrNull()?.toEquipmentRow()

    fun findAll(
        id: Long?,
        name: String?,
        type: EquipmentType?,
        status: EquipmentStatus?,
        size: Int
    ): Slice<EquipmentRow> {
        var contents = Equipment.innerJoin(Member)
            .selectAll()
            .where { lessThanId(id) }
            .andWhere { likeName(name) }
            .andWhere { equalType(type) }
            .andWhere { equalStatus(status) }
            .orderBy(Equipment.id to SortOrder.DESC)
            .limit(size + 1)
            .map { it.toEquipmentRow() }

        val hasNext: Boolean = contents.size > size
        if (hasNext) {
            contents = contents.dropLast(1)
        }

        return Slice(contents, contents.size, hasNext)
    }

    private fun likeName(name: String?): Op<Boolean> {
        return when (name) {
            null -> Op.TRUE
            else -> Equipment.name like "%$name%"
        }
    }

    private fun equalType(type: EquipmentType?): Op<Boolean> {
        return when (type) {
            null -> Op.TRUE
            else -> Equipment.type eq type
        }
    }

    private fun equalStatus(status: EquipmentStatus?): Op<Boolean> {
        return when (status) {
            null -> Op.TRUE
            else -> Equipment.status eq status
        }
    }

    private fun lessThanId(id: Long?): Op<Boolean> {
        return when (id) {
            null -> Op.TRUE
            else -> Equipment.id.less(id)
        }
    }
} 