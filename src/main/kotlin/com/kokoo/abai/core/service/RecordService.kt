package com.kokoo.abai.core.service

import com.kokoo.abai.common.extension.toSearchStartDateTime
import com.kokoo.abai.core.repository.MatchMemberRepository
import com.kokoo.abai.core.repository.MatchRepository
import com.kokoo.abai.core.row.MatchRow
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

@Service
class RecordService(
    private val matchRepository: MatchRepository,
    private val matchMemberRepository: MatchMemberRepository
) {

    @Transactional(readOnly = true)
    fun getSummary(startDate: LocalDate, endDate: LocalDate) {

    }

    @Transactional(readOnly = true)
    fun getTopGoal(startDate: LocalDate, endDate: LocalDate) {

    }

    @Transactional(readOnly = true)
    fun getTopAssist(startDate: LocalDate, endDate: LocalDate) {

    }

    @Transactional(readOnly = true)
    fun getAllPlayers(startDate: LocalDate, endDate: LocalDate) {

    }

    private fun getMatch(startDate: LocalDate, endDate: LocalDate): List<MatchRow> =
        matchRepository.findByMatchAtBetween(
            startAt = startDate.toSearchStartDateTime(),
            endAt = endDate.toSearchStartDateTime()
        )
}