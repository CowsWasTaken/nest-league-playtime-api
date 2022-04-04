import { Injectable } from '@nestjs/common';
import { Summoner } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SummonerService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdateSummoner(summoner: Summoner) {
    const createdSummoner = await this.prisma.summoner.upsert({
      where: { puuid: summoner.puuid },
      create: summoner,
      update: summoner,
    });

    return createdSummoner;
  }

  async getMatchesForSummoner(puuid: string) {
    return this.prisma.summoner.findMany({
      where: { puuid: puuid },
      include: { matches: true },
    });
  }
}
