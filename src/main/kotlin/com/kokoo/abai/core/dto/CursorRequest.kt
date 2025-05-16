package com.kokoo.abai.core.dto

data class CursorRequest<K>(
    val lastId: K?,
    val size: Int = 10
)