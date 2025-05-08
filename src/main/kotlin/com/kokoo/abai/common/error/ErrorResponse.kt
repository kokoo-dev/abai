package com.kokoo.abai.common.error

data class ErrorResponse(
    val code: String,
    val message: String,
) {
    constructor(errorCode: ErrorCode) : this(errorCode.code, errorCode.message)
}