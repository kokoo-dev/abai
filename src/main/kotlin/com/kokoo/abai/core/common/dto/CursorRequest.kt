package com.kokoo.abai.core.common.dto

open class CursorRequest<K>(
    open val lastId: K?,
    open val size: Int = 10
)