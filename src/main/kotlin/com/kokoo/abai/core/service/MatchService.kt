package com.kokoo.abai.core.service

import com.kokoo.abai.common.error.ErrorCode
import com.kokoo.abai.common.exception.BusinessException
import com.kokoo.abai.common.extension.toSearchEndDateTime
import com.kokoo.abai.common.extension.toSearchStartDateTime
import com.kokoo.abai.core.dto.*
import com.kokoo.abai.core.enums.MatchStatus
import com.kokoo.abai.core.repository.*
import com.kokoo.abai.core.row.MatchGuestRow
import com.kokoo.abai.core.row.MatchMemberRow
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
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
        val savedMatch = matchRepository.save(request.toRow(), matchId)

        matchMemberRepository.deleteByMatchId(matchId)
        matchGuestRepository.deleteByMatchId(matchId)

        val formations = matchFormationRepository.findByMatchId(matchId)
        matchPositionRepository.deleteByFormationIds(formations.map { it.id })
        matchFormationRepository.deleteByMatchId(matchId)

        saveMatchDetails(matchId, request)

        return savedMatch.toResponse()
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

        return CursorResponse.of(matches, lastId) { it.toResponse() }
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
}