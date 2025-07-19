package com.kokoo.abai.core.member.repository

import com.kokoo.abai.core.member.domain.MemberAttribute
import com.kokoo.abai.core.member.row.MemberAttributeRow
import com.kokoo.abai.core.member.row.toMemberAttributeRow
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.springframework.stereotype.Repository

@Repository
class MemberAttributeRepository {
    fun save(row: MemberAttributeRow, id: Long? = null): MemberAttributeRow {
        return if (id != null) {
            MemberAttribute.update({ MemberAttribute.id eq id }) {
                it[speed] = row.speed
                it[shooting] = row.shooting
                it[pass] = row.pass
                it[dribble] = row.dribble
                it[defence] = row.defence
                it[stamina] = row.stamina
            }
            findById(id)!!
        } else {
            val result = MemberAttribute.insert {
                it[speed] = row.speed
                it[shooting] = row.shooting
                it[pass] = row.pass
                it[dribble] = row.dribble
                it[defence] = row.defence
                it[stamina] = row.stamina
            }.resultedValues!!.first()
            findById(result[MemberAttribute.id])!!
        }
    }

    fun findById(id: Long): MemberAttributeRow? = MemberAttribute.selectAll()
        .where { MemberAttribute.id eq id }
        .singleOrNull()?.toMemberAttributeRow()

    fun delete(id: Long) = MemberAttribute.deleteWhere { MemberAttribute.id eq id }
} 