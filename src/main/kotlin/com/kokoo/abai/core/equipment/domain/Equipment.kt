package com.kokoo.abai.core.equipment.domain

import com.kokoo.abai.core.common.domain.BaseTable
import com.kokoo.abai.core.equipment.enums.EquipmentStatus
import com.kokoo.abai.core.equipment.enums.EquipmentType
import com.kokoo.abai.core.member.domain.Member

object Equipment : BaseTable("equipment") {
    val id = long("id").autoIncrement()
    val memberId = reference("member_id", Member.id)
    val name = varchar("name", 50)
    val description = varchar("description", 100).nullable()
    val type = enumerationByName("type", 30, EquipmentType::class)
    val status = enumerationByName("status", 30, EquipmentStatus::class)

    override val primaryKey = PrimaryKey(id)
}