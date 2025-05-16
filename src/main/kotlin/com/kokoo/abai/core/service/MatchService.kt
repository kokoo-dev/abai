package com.kokoo.abai.core.service

import com.kokoo.abai.core.dto.*
import com.kokoo.abai.core.repository.MatchFormationRepository
import com.kokoo.abai.core.repository.MatchMemberRepository
import com.kokoo.abai.core.repository.MatchPositionRepository
import com.kokoo.abai.core.repository.MatchRepository
import com.kokoo.abai.core.row.MatchMemberRow
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class MatchService(
    private val matchRepository: MatchRepository,
    private val matchMemberRepository: MatchMemberRepository,
    private val matchFormationRepository: MatchFormationRepository,
    private val matchPositionRepository: MatchPositionRepository
) {

    @Transactional
    fun create(request: MatchRequest): MatchResponse {
        val savedMatch = matchRepository.save(request.toRow())
        val matchId = savedMatch.id

        // 선수
        val members = request.members.map { memberId ->
            MatchMemberRow(
                matchId = matchId,
                memberId = memberId,
            )
        }
        matchMemberRepository.saveAll(members)

        // 포메이션 & 포지션
        val allPositions = request.formations.flatMap { formation ->
            val savedFormation = matchFormationRepository.save(formation.toRow(matchId))
            formation.positions.map { it.toRow(savedFormation.id) }
        }
        matchPositionRepository.saveAll(allPositions)

        return savedMatch.toResponse()
    }

    @Transactional
    fun delete(matchId: Long) {
        val formationIds = matchFormationRepository.findByMatchId(matchId)
            .map { it.id }

        matchPositionRepository.deleteByFormationIds(formationIds)
        matchFormationRepository.deleteByMatchId(matchId)
        matchMemberRepository.deleteByMatchId(matchId)
        matchRepository.delete(matchId)
    }

    @Transactional(readOnly = true)
    fun getAll(request: CursorRequest<Long>): CursorResponse<MatchResponse, Long> {
        val matches = matchRepository.findAll(request)

        return CursorResponse.of(matches, matches.contents.lastOrNull()?.id) { it.toResponse() }
    }
}