package com.kokoo.abai.core.member.repository

import com.kokoo.abai.core.member.domain.Member
import com.kokoo.abai.core.member.domain.MemberPosition
import com.kokoo.abai.core.member.enums.MemberStatus
import com.kokoo.abai.core.member.enums.Position
import com.kokoo.abai.core.member.row.MemberRow
import com.kokoo.abai.core.member.row.toMemberRow
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.javatime.CurrentDate
import org.springframework.stereotype.Repository
import java.time.LocalDate
import java.time.LocalDateTime

@Repository
class MemberRepository {
    fun save(row: MemberRow, id: Long? = null): MemberRow {
        return if (id != null) {
            Member.update({ Member.id eq id }) {
                it[loginId] = row.loginId
                it[password] = row.password
                it[name] = row.name
                it[status] = row.status
                it[birthday] = row.birthday
                it[height] = row.height
                it[weight] = row.weight
                it[uniformNumber] = row.uniformNumber
                it[leftFoot] = row.leftFoot
                it[rightFoot] = row.rightFoot
                it[updatedAt] = LocalDateTime.now()
            }
            findById(id)!!
        } else {
            Member.insert {
                it[loginId] = row.loginId
                it[password] = row.password
                it[name] = row.name
                it[status] = row.status
                it[birthday] = row.birthday
                it[height] = row.height
                it[weight] = row.weight
                it[uniformNumber] = row.uniformNumber
                it[leftFoot] = row.leftFoot
                it[rightFoot] = row.rightFoot
            }.resultedValues!!.first().toMemberRow()
        }
    }

    fun saveAll(members: List<MemberRow>) = Member.batchInsert(members) {
        this[Member.loginId] = it.loginId
        this[Member.password] = it.password
        this[Member.name] = it.name
        this[Member.birthday] = it.birthday
        this[Member.height] = it.height
        this[Member.weight] = it.weight
        this[Member.uniformNumber] = it.uniformNumber
        this[Member.leftFoot] = it.leftFoot
        this[Member.rightFoot] = it.rightFoot
    }.map { it.toMemberRow() }

    fun updateStatus(id: Long, status: MemberStatus) = Member.update({ Member.id eq id }) {
        it[Member.status] = status
    }

    fun delete(id: Long) {
        Member.deleteWhere { Member.id eq id }
    }

    fun findById(id: Long): MemberRow? = Member.selectAll()
        .where { Member.id eq id }
        .singleOrNull()?.toMemberRow()

    fun findByLoginIdAndStatus(
        loginId: String,
        status: MemberStatus = MemberStatus.ACTIVATED
    ): MemberRow? = Member.selectAll()
        .where { Member.loginId eq loginId }
        .andWhere { Member.status eq status }
        .singleOrNull()?.toMemberRow()

    fun existsByLoginIdAndStatus(
        loginId: String,
        status: MemberStatus = MemberStatus.ACTIVATED
    ): Boolean = Member.selectAll()
        .where { Member.loginId eq loginId }
        .andWhere { Member.status eq status }
        .limit(1)
        .any()

    fun existsByUniformNumberAndStatus(
        uniformNumber: Int,
        status: MemberStatus = MemberStatus.ACTIVATED
    ): Boolean = Member.selectAll()
        .where { Member.uniformNumber eq uniformNumber }
        .andWhere { Member.status eq status }
        .limit(1)
        .any()

    fun findByStatus(status: MemberStatus): List<MemberRow> = Member.selectAll()
        .where { Member.status eq status }
        .orderBy(Member.uniformNumber to SortOrder.ASC)
        .map { it.toMemberRow() }

    fun findByPositionIn(positions: List<Position>): List<MemberRow> =
        Member.innerJoin(MemberPosition)
            .select(Member.columns)
            .where { Member.status eq MemberStatus.ACTIVATED }
            .andWhere { MemberPosition.position inList positions }
            .groupBy(Member.id)
            .orderBy(Member.uniformNumber to SortOrder.ASC)
            .map { it.toMemberRow() }

    fun findUpcomingBirthdays(): List<MemberRow> {
        val sevenDaysLater = object : Expression<LocalDate>() {
            override fun toQueryBuilder(queryBuilder: QueryBuilder) {
                queryBuilder.append("CURRENT_DATE + 7")
            }
        }

        val birthdayMMDD =
            CustomFunction("TO_CHAR", TextColumnType(), Member.birthday, stringLiteral("MM-DD"))
        val todayMMDD =
            CustomFunction("TO_CHAR", TextColumnType(), CurrentDate, stringLiteral("MM-DD"))
        val futureMMDD =
            CustomFunction("TO_CHAR", TextColumnType(), sevenDaysLater, stringLiteral("MM-DD"))

        return Member.selectAll()
            .where { Member.status eq MemberStatus.ACTIVATED }
            .andWhere { birthdayMMDD greaterEq todayMMDD }
            .andWhere { birthdayMMDD lessEq futureMMDD }
            .map { it.toMemberRow() }
    }

    fun countByStatus(status: MemberStatus): Long {
        val countAlias = Count(Member.id).alias("count")

        return Member.select(countAlias)
            .where { Member.status eq status }
            .single()[countAlias]
    }

    fun findByUniformNumberAndStatus(
        uniformNumber: Int,
        status: MemberStatus = MemberStatus.ACTIVATED
    ): MemberRow? = Member.selectAll()
        .where { Member.uniformNumber eq uniformNumber }
        .andWhere { Member.status eq status }
        .singleOrNull()?.toMemberRow()

    fun findAll(): List<MemberRow> = Member.selectAll()
        .orderBy(Member.uniformNumber to SortOrder.ASC)
        .map { it.toMemberRow() }
}