package com.kokoo.abai.core.service

import com.kokoo.abai.common.error.ErrorCode
import com.kokoo.abai.common.exception.BusinessException
import com.kokoo.abai.common.extension.toSearchStartDateTime
import com.kokoo.abai.core.dto.*
import com.kokoo.abai.core.repository.MatchMemberRepository
import com.kokoo.abai.core.repository.MatchRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.temporal.ChronoUnit

@Service
class RecordService(
    private val matchRepository: MatchRepository,
    private val matchMemberRepository: MatchMemberRepository
) {
    @Transactional(readOnly = true)
    fun getSummary(startDate: LocalDate, endDate: LocalDate): MatchSummaryResponse {
        validateDate(startDate, endDate)

        return matchRepository.sumByMatchAtBetween(
            startAt = startDate.toSearchStartDateTime(),
            endAt = endDate.toSearchStartDateTime(),
        ).toResponse()
    }

    @Transactional(readOnly = true)
    fun getGoalRanks(startDate: LocalDate, endDate: LocalDate): List<GoalRankResponse> {
        validateDate(startDate, endDate)

        return matchMemberRepository.topGoalsByMatchAtBetween(
            startAt = startDate.toSearchStartDateTime(),
            endAt = endDate.toSearchStartDateTime(),
            limit = 3
        ).map { it.toResponse() }
    }

    @Transactional(readOnly = true)
    fun getAssistRanks(startDate: LocalDate, endDate: LocalDate): List<AssistRankResponse> {
        validateDate(startDate, endDate)

        return matchMemberRepository.topAssistsByMatchAtBetween(
            startAt = startDate.toSearchStartDateTime(),
            endAt = endDate.toSearchStartDateTime(),
            limit = 3
        ).map { it.toResponse() }
    }

    @Transactional(readOnly = true)
    fun getAllPlayers(startDate: LocalDate, endDate: LocalDate): List<MemberRecordResponse> {
        validateDate(startDate, endDate)

        return matchMemberRepository.findAllByMatchAtBetween(
            startAt = startDate.toSearchStartDateTime(),
            endAt = endDate.toSearchStartDateTime()
        ).map { it.toResponse() }
    }

    private fun validateDate(startDate: LocalDate, endDate: LocalDate) {
        if (ChronoUnit.YEARS.between(startDate, endDate) > 0) {
            throw BusinessException(ErrorCode.EXCEED_RANGE_ONE_YEAR)
        }
    }
}