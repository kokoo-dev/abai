package com.kokoo.abai.core.repository

import com.kokoo.abai.core.domain.Member
import com.kokoo.abai.core.row.MemberRow
import com.kokoo.abai.core.row.toMemberRow
import org.jetbrains.exposed.sql.batchInsert
import org.jetbrains.exposed.sql.insert
import org.springframework.stereotype.Repository

@Repository
class MemberRepository {
    fun save(member: MemberRow): MemberRow = Member.insert {
        it[loginId] = member.loginId
        it[password] = member.password
        it[name] = member.name
        it[birthday] = member.birthday
        it[height] = member.height
        it[weight] = member.weight
        it[uniformNumber] = member.uniformNumber
        it[leftFoot] = member.leftFoot
        it[rightFoot] = member.rightFoot
        it[preferredPosition] = member.preferredPosition
    }.resultedValues!!.first().toMemberRow()

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
        this[Member.preferredPosition] = it.preferredPosition
    }.map { it.toMemberRow() }

    fun findByLoginId(loginId: String): MemberRow? = Member.select(Member.columns)
        .where { Member.loginId.eq(loginId) }
        .singleOrNull()?.toMemberRow()
}