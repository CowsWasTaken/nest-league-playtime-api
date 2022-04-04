import { Controller, Get } from '@nestjs/common';
import { Match, Summoner } from '@prisma/client';
import { AppService } from './app.service';
import { MatchService } from './match/match.service';
import '../patch.js';
import { SummonerService } from './summoner/summoner.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private matchService: MatchService,
    private summonerService: SummonerService,
  ) {}

  @Get('match')
  testing() {
    return this.matchService.createMatch(matchExample);
  }

  @Get('summoner')
  createSummoner() {
    return this.summonerService.createOrUpdateSummoner(exampleSummoner);
  }
}

export const matchExample: Match = {
  gameCreation: 1648987909130n,
  gameDuration: 12n,
  gameEndTimestamp: 12n,
  gameId: 12n,
  gameMode: 'ARAM',
  gameName: 'Name',
  gameType: 'Ranked',
  mapId: 10,
  matchId: '38838548341831',
  queueId: 12,
};

export const exampleSummoner: Summoner = {
  gameName: 'Cows',
  puuid: '832472034234273487234jdkafd9234834',
  tagLine: 'UwU',
};
