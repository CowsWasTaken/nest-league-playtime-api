import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import '../patch.js';
import { SummonerInfo } from './validation-classes/SummonerInfo';
import { HostValue } from './models/HostValue';
import { RegionalHostValues } from './constants/RegionalHostValues';
import { MatchDto } from './league-api/dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('matches')
  async getPuuid(@Body() summonerInfo: SummonerInfo) {
    const summoner = await this.appService.getSummonerDto(summonerInfo);
    return summoner;
  }

  @Post('matches/save')
  async saveMatches(@Body() summonerInfo: SummonerInfo) {
    const summoner = await this.appService.fetchAndSaveSummoner(summonerInfo);
    const hostValue = HostValue.getConstant(
      summonerInfo.region,
      RegionalHostValues,
    );
    await this.appService.saveMatchesForSummoner(hostValue, summoner.puuid);
  }
}
