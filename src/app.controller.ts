import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import '../patch.js';
import { SummonerInfo } from './validation-classes/SummonerInfo';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('matches')
  async getPuuid(@Body() summonerInfo: SummonerInfo) {
    const summoner = await this.appService.getSummonerDto(summonerInfo);
    return summoner;
  }
}
