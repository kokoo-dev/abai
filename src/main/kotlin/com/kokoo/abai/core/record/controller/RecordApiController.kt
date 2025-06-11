package com.kokoo.abai.core.record.controller

import com.kokoo.abai.common.constant.RequestPath
import com.kokoo.abai.core.record.dto.AssistRankResponse
import com.kokoo.abai.core.record.dto.GoalRankResponse
import com.kokoo.abai.core.record.dto.MatchSummaryResponse
import com.kokoo.abai.core.record.dto.MemberRecordResponse
import com.kokoo.abai.core.record.service.RecordService
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate

@RestController
@RequestMapping("${RequestPath.Companion.API_PREFIX}/v1/records")
class RecordApiController(
    private val recordService: RecordService
) {

    @GetMapping("/summary")
    fun getSummary(
        @RequestParam(name = "startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") startDate: LocalDate,
        @RequestParam(name = "endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") endDate: LocalDate
    ): ResponseEntity<MatchSummaryResponse> {
        return ResponseEntity.ok(recordService.getSummary(startDate, endDate))
    }

    @GetMapping("/goal-ranks")
    fun getGoalRanks(
        @RequestParam(name = "startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") startDate: LocalDate,
        @RequestParam(name = "endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") endDate: LocalDate
    ): ResponseEntity<List<GoalRankResponse>> {
        return ResponseEntity.ok(recordService.getGoalRanks(startDate, endDate))
    }

    @GetMapping("/assist-ranks")
    fun getAssistRanks(
        @RequestParam(name = "startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") startDate: LocalDate,
        @RequestParam(name = "endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") endDate: LocalDate
    ): ResponseEntity<List<AssistRankResponse>> {
        return ResponseEntity.ok(recordService.getAssistRanks(startDate, endDate))
    }

    @GetMapping("/all-players")
    fun getAllPlayers(
        @RequestParam(name = "startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") startDate: LocalDate,
        @RequestParam(name = "endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") endDate: LocalDate
    ): ResponseEntity<List<MemberRecordResponse>> {
        return ResponseEntity.ok(recordService.getAllPlayers(startDate, endDate))
    }
}