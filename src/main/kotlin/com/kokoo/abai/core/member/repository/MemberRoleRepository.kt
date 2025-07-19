package com.kokoo.abai.core.member.repository

import com.kokoo.abai.core.member.domain.Member
import com.kokoo.abai.core.member.domain.MemberRole
import com.kokoo.abai.core.member.domain.Role
import com.kokoo.abai.core.member.enums.RoleId
import com.kokoo.abai.core.member.row.MemberRoleRow
import com.kokoo.abai.core.member.row.toMemberRoleRow
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.springframework.stereotype.Repository

@Repository
class MemberRoleRepository {
    fun save(row: MemberRoleRow): MemberRoleRow {
        val result = MemberRole.insert {
            it[memberId] = row.memberId
            it[roleId] = row.roleId
        }.resultedValues!!.first()
        return findById(result[MemberRole.memberId], result[MemberRole.roleId])!!
    }

    fun saveAll(rows: List<MemberRoleRow>) = MemberRole.batchInsert(rows) {
        this[MemberRole.memberId] = it.memberId
        this[MemberRole.roleId] = it.roleId
    }.map { it.toMemberRoleRow() }

    fun deleteByMemberId(memberId: Long) = MemberRole.deleteWhere { MemberRole.memberId eq memberId }

    fun findAll(): List<MemberRoleRow> = MemberRole.innerJoin(Member)
        .selectAll()
        .orderBy(Member.uniformNumber to SortOrder.ASC)
        .map { it.toMemberRoleRow() }

    fun findByMemberId(memberId: Long): List<MemberRoleRow> {
        return MemberRole.innerJoin(Role)
            .select(MemberRole.columns)
            .where { MemberRole.memberId.eq(memberId) }
            .map { it.toMemberRoleRow() }
    }

    fun findById(memberId: Long, roleId: RoleId): MemberRoleRow? = MemberRole.selectAll()
        .where { MemberRole.memberId eq memberId }
        .andWhere { MemberRole.roleId eq roleId }
        .singleOrNull()?.toMemberRoleRow()
}