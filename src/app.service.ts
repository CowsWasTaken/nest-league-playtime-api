import { Injectable } from '@nestjs/common';
import { HostValue } from './models/HostValue';
import { RegionalHostValues } from './constants/RegionalHostValues';
import { SummonerInfo } from './validation-classes/SummonerInfo';
import { LeagueApiService } from './league-api/league-api.service';
import { MatchService } from './match/match.service';
import { SummonerService } from './summoner/summoner.service';
import { MatchQueryParameter } from './models/MatchQueryParameter';
import { LeagueApiConstants } from './constants/LeagueApiConstants';
import { Mapper } from './mapper/mapper';

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
    return this.leagueApi.getSummoner(
      hostValue,
      summonerInfo.gameName,
      summonerInfo.tagLine,
    );
  }

  async getAllPlayerMatchesList(
    hostValue: HostValue,
    puuid: string,
  ): Promise<string[]> {
    let isCountReached = true;
    const matches: string[] = [];
    const COUNT = LeagueApiConstants.matchQueryParams.MAX_COUNT; // Max number of match ids to return.
    for (let i = 0; isCountReached; i++) {
      const start = i * COUNT;
      const matchQueryParameter: MatchQueryParameter = {
        count: COUNT,
        start,
      };
      const matchesRecent: string[] = await this.leagueApi.getPlayerMatches(
        hostValue,
        puuid,
        matchQueryParameter,
      );
      if (COUNT > matchesRecent.length) {
        isCountReached = false;
      }
      matches.push(...matchesRecent);
    }
    return matches;
  }

  async fetchAndSaveMatch(
    hostValue: HostValue,
    puuid: string,
    matchId: string,
  ) {
    const matchDto = await this.leagueApi.getMatch(hostValue, matchId);
    const entity = Mapper.toEntity(matchDto)
    console.log('here');
    
    console.log(entity);
    
    this.matchService.createMatch(entity, puuid);
  }

  async saveMatchesForSummoner(hostValue: HostValue, puuid: string) {
    const matchIds = await this.getAllPlayerMatchesList(hostValue, puuid);
    const missingGames = await this.matchService.determineMissingGames(
      matchIds,
    );
    console.log(`Number of missing Games${missingGames.length}`);

    for (let i = 0; i < missingGames.length; i++) {
      await this.fetchAndSaveMatch(hostValue, puuid, missingGames[i]);
      // TODO for better performance this should be done more async but ratelimiter not checking it properly
    }
  }

  async fetchAndSaveSummoner(summonerInfo: SummonerInfo) {
    const summoner = await this.leagueApi.getSummoner(
      HostValue.getConstant(summonerInfo.region, RegionalHostValues),
      summonerInfo.gameName,
      summonerInfo.tagLine,
    );
    return this.summonerService.createOrUpdateSummoner({
      gameName: summoner.gameName,
      puuid: summoner.puuid,
      tagLine: summoner.tagLine,
    });
  }
}
