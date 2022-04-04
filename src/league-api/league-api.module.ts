import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LeagueApiService } from './league-api.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [LeagueApiService],
})
export class LeagueApiModule {}
