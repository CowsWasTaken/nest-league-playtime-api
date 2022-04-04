import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Module({
  providers: [MatchesService],
})
export class MatchesModule {}
