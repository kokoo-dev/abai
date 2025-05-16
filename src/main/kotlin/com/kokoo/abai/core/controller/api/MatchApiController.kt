package com.kokoo.abai.core.controller.api

import com.kokoo.abai.common.constant.RequestPath
import com.kokoo.abai.core.dto.CursorRequest
import com.kokoo.abai.core.dto.CursorResponse
import com.kokoo.abai.core.dto.MatchRequest
import com.kokoo.abai.core.dto.MatchResponse
import com.kokoo.abai.core.service.MatchService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

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
        @RequestParam(name = "lastId", required = false) lastId: Long?,
        @RequestParam(name = "size", required = false, defaultValue = "10") size: Int = 10,
    ): ResponseEntity<CursorResponse<MatchResponse, Long>> {
        return ResponseEntity.ok(matchService.getAll(CursorRequest(lastId, size)))
    }
}