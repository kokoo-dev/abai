package com.kokoo.abai.core.record.service

import com.kokoo.abai.common.error.ErrorCode
import com.kokoo.abai.common.exception.BusinessException
import com.kokoo.abai.common.extension.toSearchEndDateTime
import com.kokoo.abai.common.extension.toSearchStartDateTime
import com.kokoo.abai.core.match.enums.MatchStatus
import com.kokoo.abai.core.match.repository.MatchMemberRepository
import com.kokoo.abai.core.match.repository.MatchRepository
import com.kokoo.abai.core.record.dto.AssistRankResponse
import com.kokoo.abai.core.record.dto.GoalRankResponse
import com.kokoo.abai.core.record.dto.MatchSummaryResponse
import com.kokoo.abai.core.record.dto.MemberRecordResponse
import com.kokoo.abai.core.record.dto.toResponse
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import kotlin.math.pow
import kotlin.math.round

@Service
class RecordService(
    private val matchRepository: MatchRepository,
    private val matchMemberRepository: MatchMemberRepository
) {
    @Transactional(readOnly = true)
    fun getSummary(startDate: LocalDate, endDate: LocalDate): MatchSummaryResponse {
        validateDate(startDate, endDate)

        return matchRepository.sumByMatchAtBetweenAndStatus(
            startAt = startDate.toSearchStartDateTime(),
            endAt = endDate.toSearchEndDateTime(),
            status = MatchStatus.COMPLETED
        ).toResponse()
    }

    @Transactional(readOnly = true)
    fun getAttendanceRate(startDate: LocalDate, endDate: LocalDate): Double {
        val startAt = startDate.toSearchStartDateTime()
        val endAt = endDate.toSearchEndDateTime()

        val totalMember = matchRepository.findByMatchAtBetweenAndStatus(
            startAt = startAt,
            endAt = endAt,
            status = MatchStatus.COMPLETED
        ).sumOf { it.totalMemberCount }

        val totalMatchMember = matchMemberRepository.countByMatchAtBetween(startAt, endAt)

        if (totalMember == 0 || totalMatchMember == 0L) {
            return 0.0
        }

        val factor = 10.0.pow(2)
        return round(
            totalMatchMember.toDouble()
                .div(totalMember)
                .times(100) * factor
        ) / factor
    }

    @Transactional(readOnly = true)
    fun getGoalRanks(startDate: LocalDate, endDate: LocalDate): List<GoalRankResponse> {
        validateDate(startDate, endDate)

        return matchMemberRepository.topGoalsByMatchAtBetween(
            startAt = startDate.toSearchStartDateTime(),
            endAt = endDate.toSearchEndDateTime(),
            limit = 3
        ).map { it.toResponse() }
    }

    @Transactional(readOnly = true)
    fun getAssistRanks(startDate: LocalDate, endDate: LocalDate): List<AssistRankResponse> {
        validateDate(startDate, endDate)

        return matchMemberRepository.topAssistsByMatchAtBetween(
            startAt = startDate.toSearchStartDateTime(),
            endAt = endDate.toSearchEndDateTime(),
            limit = 3
        ).map { it.toResponse() }
    }

    @Transactional(readOnly = true)
    fun getAllPlayers(startDate: LocalDate, endDate: LocalDate): List<MemberRecordResponse> {
        validateDate(startDate, endDate)

        return matchMemberRepository.findAllByMatchAtBetween(
            startAt = startDate.toSearchStartDateTime(),
            endAt = endDate.toSearchEndDateTime()
        ).map { it.toResponse() }
    }

    private fun validateDate(startDate: LocalDate, endDate: LocalDate) {
        if (ChronoUnit.YEARS.between(startDate, endDate) > 0) {
            throw BusinessException(ErrorCode.EXCEED_RANGE_ONE_YEAR)
        }
    }
}