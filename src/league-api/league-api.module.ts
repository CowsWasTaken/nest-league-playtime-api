import { Module } from '@nestjs/common';
import { LeagueApiService } from './league-api.service';

@Module({
  providers: [LeagueApiService],
})
export class LeagueApiModule {}
