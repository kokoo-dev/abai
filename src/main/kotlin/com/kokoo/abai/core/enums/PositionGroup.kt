package com.kokoo.abai.core.enums

enum class PositionGroup(
    val positions: List<Position>
) {
    FW(listOf(Position.CF, Position.SS)),
    MF(listOf(Position.LW, Position.RW, Position.AM, Position.CM, Position.CDM)),
    DF(listOf(Position.RB, Position.LB, Position.RWB, Position.LWB, Position.RCB, Position.LCB)),
    GK(listOf(Position.GK))
}