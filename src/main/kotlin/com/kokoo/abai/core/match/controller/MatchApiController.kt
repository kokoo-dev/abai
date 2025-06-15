package com.kokoo.abai.core.match.controller

import com.kokoo.abai.common.constant.RequestPath
import com.kokoo.abai.core.common.dto.CursorResponse
import com.kokoo.abai.core.match.dto.*
import com.kokoo.abai.core.match.enums.MatchResult
import com.kokoo.abai.core.match.enums.MatchStatus
import com.kokoo.abai.core.match.service.MatchService
import jakarta.validation.Valid
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate
import java.time.OffsetDateTime

@RestController
@RequestMapping("${RequestPath.Companion.API_PREFIX}/v1/matches")
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

    @PostMapping("/{id}/results")
    fun saveMatchResults(
        @RequestBody @Valid request: MatchResultRequest,
        @PathVariable(name = "id") id: Long
    ) {
        matchService.saveResult(id, request)
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

    @GetMapping("/upcoming")
    fun getUpcomingMatch(): ResponseEntity<MatchResponse> {
        return ResponseEntity.ok(matchService.getUpcomingMatch())
    }

    @GetMapping("/results")
    fun getGroupByResult(
        @RequestParam(name = "startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") startDate: LocalDate,
        @RequestParam(name = "endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") endDate: LocalDate
    ): ResponseEntity<Map<MatchResult, Int>> {
        return ResponseEntity.ok(matchService.getGroupByResult(startDate, endDate))
    }
}