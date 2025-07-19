package com.kokoo.abai.core.member.enums

enum class PositionGroup(
    val positions: List<Position>
) {
    FW(listOf(Position.CF)),
    MF(listOf(Position.LW, Position.RW, Position.AM, Position.CM, Position.CDM)),
    DF(listOf(Position.RB, Position.LB, Position.CB)),
    GK(listOf(Position.GK))
}