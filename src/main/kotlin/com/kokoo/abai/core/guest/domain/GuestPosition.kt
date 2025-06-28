package com.kokoo.abai.core.guest.domain

import com.kokoo.abai.core.common.domain.BaseTable
import com.kokoo.abai.core.member.enums.Position

object GuestPosition : BaseTable("guest_position") {
    val id = long("id").autoIncrement()
    val guestId = reference("guest_id", Guest.id)
    val position = enumerationByName("position", 30, Position::class)

    override val primaryKey = PrimaryKey(id)
}