package com.kokoo.abai.common.error

import org.springframework.http.HttpStatus

enum class ErrorCode(
    val httpStatus: Int,
    val code: String,
    val message: String,
) {
    // 400
    BAD_REQUEST(HttpStatus.BAD_REQUEST.value(), HttpStatus.BAD_REQUEST.name, "입력값을 다시 확인해주세요."),
    EXCEED_RANGE_ONE_YEAR(HttpStatus.BAD_REQUEST.value(), "EXCEED_RANGE_ONE_YEAR", "검색 범위는 최대 1년입니다."),

    // 401
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED.value(), HttpStatus.UNAUTHORIZED.name, "인증되지 않은 요청입니다."),

    // 403
    FORBIDDEN(HttpStatus.FORBIDDEN.value(), HttpStatus.FORBIDDEN.name, "접근 권한이 없습니다."),

    // 404
    NOT_FOUND(HttpStatus.NOT_FOUND.value(), HttpStatus.NOT_FOUND.name, "존재하지 않는 정보입니다."),

    // 500
    INTERNAL_SERVER_ERROR(
        HttpStatus.INTERNAL_SERVER_ERROR.value(),
        HttpStatus.INTERNAL_SERVER_ERROR.name,
        "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
    );
}