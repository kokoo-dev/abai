package com.kokoo.abai.core.equipment.row

import com.kokoo.abai.core.equipment.domain.Equipment
import com.kokoo.abai.core.equipment.enums.EquipmentStatus
import com.kokoo.abai.core.equipment.enums.EquipmentType
import com.kokoo.abai.core.member.domain.Member
import com.kokoo.abai.core.member.row.MemberRow
import com.kokoo.abai.core.member.row.toMemberRow
import org.jetbrains.exposed.sql.ResultRow
import java.time.LocalDateTime

data class EquipmentRow(
    val id: Long = 0,
    val memberId: Long,
    val name: String,
    val description: String?,
    val type: EquipmentType,
    val status: EquipmentStatus,
    val createdAt: LocalDateTime? = LocalDateTime.now(),
    val updatedAt: LocalDateTime? = LocalDateTime.now(),
    val member: MemberRow? = null
)

fun ResultRow.toEquipmentRow() = EquipmentRow(
    id = this[Equipment.id],
    memberId = this[Equipment.memberId],
    name = this[Equipment.name],
    description = this[Equipment.description],
    type = this[Equipment.type],
    status = this[Equipment.status],
    createdAt = this[Equipment.createdAt],
    updatedAt = this[Equipment.updatedAt],
    member = this.let {
        if (this.hasValue(Member.id)) {
            this.toMemberRow()
        } else {
            null
        }
    }
)