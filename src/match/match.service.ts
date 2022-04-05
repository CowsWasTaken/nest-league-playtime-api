import { Match } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  private async getExistingMatches(matchIds: string[]) {
    return this.prisma.match.findMany({
      where: {
        matchId: { in: matchIds },
      },
    });
  }

  async createMatch(match: Match, puuid: string) {
    const {
      gameCreation,
      gameDuration,
      gameEndTimestamp,
      gameId,
      gameMode,
      gameName,
      gameType,
      mapId,
      matchId,
      queueId,
      gameStartTimestamp,
    } = match;
    return this.prisma.match.create({
      data: {
        gameCreation,
        gameDuration,
        gameEndTimestamp,
        gameStartTimestamp,
        gameId,
        gameMode,
        gameName,
        gameType,
        mapId,
        matchId,
        queueId,
        summoner: {
          connect: {
            puuid: puuid,
          },
        },
      },
    });
  }

  /**
   *
   * @param matchIds list of matchIds to look up for if they already exist
   * @returns list of matches not existing in db
   */
  async determineMissingGames(matchIds: string[]): Promise<string[]> {
    const existingMatches = (await this.getExistingMatches(matchIds)).map(
      (res) => res.matchId,
    ); // gets all matches existing already from database for list
    for (let i = 0; i < existingMatches.length; i++) {
      const index = matchIds.findIndex(
        (matchId) => matchId === existingMatches[i],
      ); // find index in list
      if (index !== -1) {
        // index returns -1 if no element was found
        matchIds.splice(index, 1); //remove element from array
      }
    }
    return matchIds;
  }
}
