import { Injectable } from '@nestjs/common';
import { HostValue } from './models/HostValue';
import { RegionalHostValues } from './constants/RegionalHostValues';
import { SummonerInfo } from './validation-classes/SummonerInfo';
import { LeagueApiService } from './league-api/league-api.service';
import { MatchService } from './match/match.service';
import { SummonerService } from './summoner/summoner.service';

@Injectable()
export class AppService {
  constructor(
    private matchService: MatchService,
    private summonerService: SummonerService,
    private leagueApi: LeagueApiService,
  ) {}

  async getSummonerDto(summonerInfo: SummonerInfo) {
    const hostValue = HostValue.getConstant(
      summonerInfo.region,
      RegionalHostValues,
    );
    return this.leagueApi.getPlayerPUUID(
      hostValue,
      summonerInfo.gameName,
      summonerInfo.tagLine,
    );
  }
}
