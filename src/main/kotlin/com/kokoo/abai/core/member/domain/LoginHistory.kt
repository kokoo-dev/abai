package com.kokoo.abai.core.member.domain

import com.kokoo.abai.core.common.domain.BaseTable

object LoginHistory : BaseTable("login_history") {
    val id = long("id").autoIncrement()
    val memberId = reference("member_id", Member.id)
    val ip = varchar("ip", 20)

    override val primaryKey = PrimaryKey(id)
}