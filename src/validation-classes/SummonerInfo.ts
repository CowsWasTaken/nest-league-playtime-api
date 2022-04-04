import { IsNotEmpty, IsString } from 'class-validator';

export class SummonerInfo {
  @IsString()
  @IsNotEmpty()
  gameName: string;

  @IsString()
  @IsNotEmpty()
  tagLine: string;

  @IsString()
  @IsNotEmpty()
  region: string;
}
