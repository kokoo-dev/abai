package com.kokoo.abai.core.match.service

import com.kokoo.abai.common.error.ErrorCode
import com.kokoo.abai.common.exception.BusinessException
import com.kokoo.abai.common.extension.toSearchEndDateTime
import com.kokoo.abai.common.extension.toSearchStartDateTime
import com.kokoo.abai.core.common.dto.CursorResponse
import com.kokoo.abai.core.common.dto.EnumResponse
import com.kokoo.abai.core.match.dto.*
import com.kokoo.abai.core.match.enums.MatchResult
import com.kokoo.abai.core.match.enums.MatchStatus
import com.kokoo.abai.core.match.repository.MatchFormationRepository
import com.kokoo.abai.core.match.repository.MatchGuestRepository
import com.kokoo.abai.core.match.repository.MatchMemberRepository
import com.kokoo.abai.core.match.repository.MatchPositionRepository
import com.kokoo.abai.core.match.repository.MatchRepository
import com.kokoo.abai.core.match.row.MatchGuestRow
import com.kokoo.abai.core.match.row.MatchMemberRow
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneOffset

@Service
class MatchService(
    private val matchRepository: MatchRepository,
    private val matchMemberRepository: MatchMemberRepository,
    private val matchGuestRepository: MatchGuestRepository,
    private val matchFormationRepository: MatchFormationRepository,
    private val matchPositionRepository: MatchPositionRepository
) {

    @Transactional
    fun create(request: MatchRequest): MatchResponse {
        val savedMatch = matchRepository.save(request.toRow())
        val matchId = savedMatch.id

        saveMatchDetails(matchId, request)

        return savedMatch.toResponse()
    }

    @Transactional
    fun update(matchId: Long, request: MatchRequest): MatchResponse {
        val match = matchRepository.findById(matchId) ?: throw BusinessException(ErrorCode.NOT_FOUND)
        val saveRow = request.toRow().apply {
            status = match.status
            result = match.result
            goalsFor = match.goalsFor
            goalsAgainst = match.goalsAgainst
            assist = match.assist
        }

        val savedMatch = matchRepository.save(saveRow, matchId)

        matchMemberRepository.deleteByMatchId(matchId)
        matchGuestRepository.deleteByMatchId(matchId)

        val formations = matchFormationRepository.findByMatchId(matchId)
        matchPositionRepository.deleteByFormationIds(formations.map { it.id })
        matchFormationRepository.deleteByMatchId(matchId)

        saveMatchDetails(matchId, request)

        return savedMatch.toResponse()
    }

    @Transactional
    fun saveResult(id: Long, request: MatchResultRequest) {
        val match = matchRepository.findById(id) ?: throw BusinessException(ErrorCode.NOT_FOUND)
        match.end(request.goalsFor, request.goalsAgainst, request.assist)

        request.members.forEach {
            val matchMember = matchMemberRepository.findByMatchIdAndMemberId(id, it.id)
                ?: throw BusinessException(ErrorCode.NOT_FOUND)
            matchMember.goalsFor = it.goalsFor
            matchMember.assist = it.assist

            matchMemberRepository.save(matchMember, matchMember.id)
        }

        request.guests.forEach {
            val matchGuest = matchGuestRepository.findByMatchIdAndGuestId(id, it.id)
                ?: throw BusinessException(ErrorCode.NOT_FOUND)
            matchGuest.goalsFor = it.goalsFor
            matchGuest.assist = it.assist

            matchGuestRepository.save(matchGuest, matchGuest.id)
        }

        matchRepository.save(match, id)
    }

    @Transactional
    fun delete(matchId: Long) = matchRepository.deleteSoft(matchId)

    @Transactional(readOnly = true)
    fun getAllMatches(request: MatchCursorRequest<MatchCursorId>): CursorResponse<MatchResponse, MatchCursorId> {
        val matches = matchRepository.findAll(
            matchAt = request.lastId?.matchAt?.toLocalDateTime(),
            id = request.lastId?.id,
            status = request.status,
            size = request.size
        )

        val lastId = matches.contents.lastOrNull()
            ?.let { MatchCursorId(matchAt = it.matchAt.atOffset(ZoneOffset.UTC), id = it.id) }

        return CursorResponse.Companion.of(matches, lastId) { it.toResponse() }
    }

    @Transactional(readOnly = true)
    fun getMatch(id: Long): MatchResponse =
        matchRepository.findById(id)?.toResponse() ?: throw BusinessException(ErrorCode.NOT_FOUND)

    @Transactional(readOnly = true)
    fun getMatchForSchedule(startDate: LocalDate, endDate: LocalDate): List<MatchResponse> =
        matchRepository.findByMatchAtBetween(
            startDate.toSearchStartDateTime(),
            endDate.toSearchEndDateTime()
        ).map { it.toResponse() }

    @Transactional(readOnly = true)
    fun getMatchFormations(matchId: Long): List<MatchFormationResponse> =
        matchFormationRepository.findByMatchId(matchId).map { formation ->
            formation.toResponse().apply {
                positions = matchPositionRepository.findByMatchFormationId(formation.id)
                    .map { position -> position.toResponse() }
            }
        }

    @Transactional(readOnly = true)
    fun getMatchMembers(matchId: Long): List<MatchMemberResponse> =
        matchMemberRepository.findByMatchId(matchId)
            .map { it.toResponse() }

    @Transactional(readOnly = true)
    fun getMatchGuests(matchId: Long): List<MatchGuestResponse> =
        matchGuestRepository.findByMatchId(matchId)
            .map { it.toResponse() }

    @Transactional(readOnly = true)
    fun getGroupByResult(startDate: LocalDate, endDate: LocalDate): Map<MatchResult, Int> {
        return matchRepository.findByMatchAtBetween(
            startDate.toSearchStartDateTime(),
            endDate.toSearchEndDateTime()
        )
            .filterNot { it.result == MatchResult.READY }
            .map { it.toResponse() }
            .groupBy { it.result }
            .mapValues { it.value.size }
    }

    fun getMatchStatusForMemberViewFilter(): List<EnumResponse> =
        MatchStatus.entries
            .filter { it.useMemberViewFilter }
            .map { EnumResponse(name = it.koreanName, value = it.name) }

    private fun saveMatchDetails(matchId: Long, request: MatchRequest) {
        // 선수
        val members = request.members.map { memberId ->
            MatchMemberRow(
                matchId = matchId,
                memberId = memberId
            )
        }
        matchMemberRepository.saveAll(members)

        // 용병
        val guests = request.guests.map { id ->
            MatchGuestRow(
                matchId = matchId,
                guestId = id
            )
        }
        matchGuestRepository.saveAll(guests)

        // 포메이션 & 포지션
        val allPositions = request.formations.flatMap { formation ->
            val savedFormation = matchFormationRepository.save(formation.toRow(matchId))
            formation.positions.map { it.toRow(savedFormation.id) }
        }
        matchPositionRepository.saveAll(allPositions)
    }

    @Transactional(readOnly = true)
    fun getUpcomingMatch(): MatchResponse =
        matchRepository.findByStatusAndMatchAtGraterThan(LocalDateTime.now())?.toResponse()
            ?: throw BusinessException(ErrorCode.NOT_FOUND)
}