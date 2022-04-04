import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MatchModule } from './match/match.module';
import { MatchService } from './match/match.service';
import { SummonerModule } from './summoner/summoner.module';
import { SummonerService } from './summoner/summoner.service';
import { LeagueApiModule } from './league-api/league-api.module';
import { LeagueApiService } from './league-api/league-api.service';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot(),
    MatchModule,
    SummonerModule,
    LeagueApiModule,
  ],
  controllers: [AppController],
  providers: [AppService, MatchService, SummonerService, LeagueApiService],
})
export class AppModule {}
