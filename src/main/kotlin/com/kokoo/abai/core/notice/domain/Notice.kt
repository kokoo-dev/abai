package com.kokoo.abai.core.notice.domain

import com.kokoo.abai.core.common.domain.BaseTable
import com.kokoo.abai.core.match.domain.Match
import com.kokoo.abai.core.member.domain.Member

object Notice : BaseTable("notice") {
    val id = long("id").autoIncrement()
    val memberId = reference("member_id", Member.id)
    val categoryId = reference("category_id", NoticeCategory.id)
    val title = varchar("title", 100)
    val content = text("content")
    val viewCount = integer("view_count").default(0)

    override val primaryKey = PrimaryKey(Match.id)
}