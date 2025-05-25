package com.kokoo.abai.core.controller.api

import com.fasterxml.jackson.annotation.JsonFormat
import com.kokoo.abai.common.constant.RequestPath
import com.kokoo.abai.core.dto.*
import com.kokoo.abai.core.enums.MatchStatus
import com.kokoo.abai.core.service.MatchService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.OffsetDateTime

@RestController
@RequestMapping("${RequestPath.API_PREFIX}/v1/matches")
class MatchApiController(
    private val matchService: MatchService
) {

    @PostMapping("")
    fun createMatch(@RequestBody @Valid request: MatchRequest): ResponseEntity<MatchResponse> {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(matchService.create(request))
    }

    @DeleteMapping("/{id}")
    fun deleteMatch(@PathVariable(name = "id") id: Long): ResponseEntity<Unit> {
        return ResponseEntity.ok(matchService.delete(id))
    }

    @GetMapping("")
    fun getMatchesByCursor(
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
        @RequestParam(name = "lastMatchAt", required = false) lastMatchAt: OffsetDateTime?,
        @RequestParam(name = "lastId", required = false) lastId: Long?,
        @RequestParam(name = "status", required = false) status: MatchStatus?,
        @RequestParam(name = "size", required = false, defaultValue = "10") size: Int = 10,
    ): ResponseEntity<CursorResponse<MatchResponse, MatchCursorId>> {
        return ResponseEntity.ok(
            matchService.getAll(
                MatchCursorRequest(
                    lastId = MatchCursorId(
                        matchAt = lastMatchAt,
                        id = lastId
                    ),
                    size = size,
                    status = status
                )
            )
        )
    }
}