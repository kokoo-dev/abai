package com.kokoo.abai.core.match.dto

import com.kokoo.abai.core.common.dto.CursorRequest
import com.kokoo.abai.core.match.enums.MatchStatus

data class MatchCursorRequest<K>(
    override val lastId: K?,
    override val size: Int = 10,
    val status: MatchStatus?
) : CursorRequest<K>(lastId, size)