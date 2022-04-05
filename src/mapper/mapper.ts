import { Match } from '@prisma/client';
import { AppError } from 'src/errors/AppError';
import { MatchDto } from 'src/league-api/dto';
import '../../patch.js';

export class Mapper {
  static toEntity(dto: MatchDto): Match {
    const {
      gameCreation,
      gameDuration,
      gameId,
      gameMode,
      gameName,
      gameStartTimestamp,
      gameType,
      mapId,
      queueId,
    } = dto.info;

    // Unix timestamp for when match ends on the game server. This timestamp can occasionally be significantly longer than when the match "ends". The most reliable way of determining the timestamp for the end of the match would be to add the max time played of any participant to the gameStartTimestamp. This field was added to match-v5 in patch 11.20 on Oct 5th, 2021.
    const gameEndTimestamp = dto.info.gameEndTimestamp
      ? BigInt(dto.info.gameEndTimestamp)
      : undefined;
    try {
      const match: Match = {
        matchId: dto.metadata.matchId,
        gameDuration: BigInt(gameDuration),
        gameCreation: BigInt(gameCreation),
        gameEndTimestamp,
        gameStartTimestamp: BigInt(gameStartTimestamp),
        gameId: BigInt(gameId),
        gameName,
        gameType,
        gameMode,
        queueId,
        mapId,
      };
      return match;
    } catch (err) {
      throw new AppError(
        'MappingError',
        'Cannot map MatchDto to Match Entity',
        false,
      );
    }
  }
}
