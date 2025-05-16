package com.kokoo.abai.common.pagination

data class Slice<T>(
    val contents: List<T>,
    val numberOfElements: Int,
    val hasNext: Boolean
)
