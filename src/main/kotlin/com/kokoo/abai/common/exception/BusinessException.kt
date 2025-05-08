package com.kokoo.abai.common.exception

import com.kokoo.abai.common.error.ErrorCode

class BusinessException(
    override val message: String,
    val errorCode: ErrorCode
) : RuntimeException(message) {
    constructor(errorCode: ErrorCode) : this(
        message = errorCode.message,
        errorCode = errorCode
    )
}