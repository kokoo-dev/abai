package com.kokoo.abai.core.dto

import com.kokoo.abai.common.pagination.Slice

data class CursorResponse<T, K>(
    val contents: List<T>,
    val lastId: K?,
    val numberOfElements: Int,
    val hasNext: Boolean
) {
    companion object {
        fun <R, T, K> of(slice: Slice<R>, lastId: K?, mapper: (R) -> T): CursorResponse<T, K> {
            return CursorResponse(
                contents = slice.contents.map { mapper(it) },
                lastId = lastId,
                numberOfElements = slice.numberOfElements,
                hasNext = slice.hasNext
            )
        }
    }
}