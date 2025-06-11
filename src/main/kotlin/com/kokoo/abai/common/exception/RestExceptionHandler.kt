package com.kokoo.abai.common.exception

import com.kokoo.abai.common.error.ErrorCode
import com.kokoo.abai.common.error.ErrorResponse
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.MissingServletRequestParameterException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException
import org.springframework.web.servlet.resource.NoResourceFoundException

private val logger = KotlinLogging.logger {}

@RestControllerAdvice(value = ["com.kokoo.abai.core"])
class RestExceptionHandler {

    @ExceptionHandler(Exception::class)
    fun handleException(exception: Exception): ResponseEntity<ErrorResponse> {
        logger.error(exception) { "exception handler" }

        return error(ErrorCode.INTERNAL_SERVER_ERROR)
    }

    @ExceptionHandler(
        value = [
            MethodArgumentNotValidException::class,
            MethodArgumentTypeMismatchException::class,
            HttpMessageNotReadableException::class,
            MissingServletRequestParameterException::class
        ]
    )
    fun handleBadRequestException(exception: Exception): ResponseEntity<ErrorResponse> {
        logger.error(exception) { "bad request exception handler" }

        return error(ErrorCode.BAD_REQUEST)
    }

    @ExceptionHandler(NoResourceFoundException::class)
    fun handleNotFoundException(exception: NoResourceFoundException): ResponseEntity<ErrorResponse> {
        logger.error(exception) { "not found exception handler" }

        return error(ErrorCode.NOT_FOUND)
    }

    @ExceptionHandler(BusinessException::class)
    fun handleBusinessException(exception: BusinessException): ResponseEntity<ErrorResponse> {
        logger.error(exception) { "business exception handler" }

        return error(exception.errorCode)
    }

    fun error(errorCode: ErrorCode): ResponseEntity<ErrorResponse> =
        ResponseEntity.status(errorCode.httpStatus).body(ErrorResponse(errorCode))
}