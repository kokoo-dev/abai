package com.kokoo.abai.core.controller.api

import com.kokoo.abai.common.constant.RequestPath
import com.kokoo.abai.core.dto.*
import com.kokoo.abai.core.enums.MatchStatus
import com.kokoo.abai.core.service.MatchService
import jakarta.validation.Valid
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDate
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

    @PutMapping("/{id}")
    fun updateMatch(
        @RequestBody @Valid request: MatchRequest,
        @PathVariable(name = "id") id: Long
    ): ResponseEntity<MatchResponse> {
        return ResponseEntity.ok(matchService.update(id, request))
    }

    @DeleteMapping("/{id}")
    fun deleteMatch(@PathVariable(name = "id") id: Long): ResponseEntity<Unit> {
        return ResponseEntity.ok(matchService.delete(id))
    }

    @GetMapping("")
    fun getMatchesByCursor(
        @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
        @RequestParam(name = "lastMatchAt", required = false) lastMatchAt: OffsetDateTime?,
        @RequestParam(name = "lastId", required = false) lastId: Long?,
        @RequestParam(name = "status", required = false) status: MatchStatus?,
        @RequestParam(name = "size", required = false, defaultValue = "10") size: Int = 10,
    ): ResponseEntity<CursorResponse<MatchResponse, MatchCursorId>> {
        return ResponseEntity.ok(
            matchService.getAllMatches(
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

    @GetMapping("/schedules")
    fun getMatchSchedule(
        @RequestParam(name = "startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") startDate: LocalDate,
        @RequestParam(name = "endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") endDate: LocalDate
    ): ResponseEntity<List<MatchResponse>> {
        return ResponseEntity.ok(matchService.getMatchForSchedule(startDate, endDate))
    }

    @GetMapping("/{id}")
    fun getMatch(@PathVariable(name = "id") id: Long): ResponseEntity<MatchResponse> {
        return ResponseEntity.ok(matchService.getMatch(id))
    }

    @GetMapping("/{id}/formations")
    fun getMatchFormations(@PathVariable(name = "id") id: Long): ResponseEntity<List<MatchFormationResponse>> {
        return ResponseEntity.ok(matchService.getMatchFormations(id))
    }

    @GetMapping("/{id}/members")
    fun getMatchMembers(@PathVariable(name = "id") id: Long): ResponseEntity<List<MatchMemberResponse>> {
        return ResponseEntity.ok(matchService.getMatchMembers(id))
    }

    @GetMapping("/{id}/guests")
    fun getMatchGuests(@PathVariable(name = "id") id: Long): ResponseEntity<List<MatchGuestResponse>> {
        return ResponseEntity.ok(matchService.getMatchGuests(id))
    }
}