package com.kokoo.abai.core.dto

open class CursorRequest<K>(
    open val lastId: K?,
    open val size: Int = 10
)