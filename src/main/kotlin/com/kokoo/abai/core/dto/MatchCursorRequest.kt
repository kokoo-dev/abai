package com.kokoo.abai.core.dto

import com.kokoo.abai.core.enums.MatchStatus

data class MatchCursorRequest<K>(
    override val lastId: K?,
    override val size: Int = 10,
    val status: MatchStatus?
) : CursorRequest<K>(lastId, size)