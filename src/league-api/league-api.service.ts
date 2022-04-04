import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { HostValue } from 'src/constants/HostValue';
import { RateLimitError } from 'src/errors/RateLimitError';
import {
  MatchDto,
  MatchQueryParameter,
  objectToQueryString,
  SummonerDto,
} from './dto';

@Injectable()
export class LeagueApiService {
  constructor(private config: ConfigService) {
    const api_key = this.config.get('API_KEY');
    this.api_query = `api_key=${api_key}`;
  }

  private protocol = 'https';
  private api_query: string;

  /**
   * https://developer.riotgames.com/apis#account-v1/GET_getByRiotId
   *
   * @param hostValue hostValue from league api the host value should be the platform routing value https://developer.riotgames.com/docs/lol#_routing-values
   * @param gameName gamename
   * @param tagLine tagline for example 'EUW', pass here without #
   * @return SummonerDtO
   */
  async getPlayerPUUID(
    hostValue: HostValue,
    gameName: string,
    tagLine: string,
  ): Promise<SummonerDto> {
    return axios
      .get(
        `${this.createBaseUrl(
          hostValue,
        )}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?${
          this.api_query
        }`,
      )
      .then((response) => {
        console.log(`Fetched PUUID: ${response.data.puuid}`);
        return response.data;
      })
      .catch((err) => Promise.reject(err));
  }

  /**
   * https://developer.riotgames.com/apis#match-v5/GET_getMatchIdsByPUUID
   *
   * @param hostValue  has to be RegionalHostValue according to League API
   * @param puuid id of summoner
   * @param matchQueryParameter object for specifying query parameter for api call
   * @return list of match ids
   */
  async getPlayerMatches(
    hostValue: HostValue,
    puuid: string,
    matchQueryParameter?: MatchQueryParameter,
  ): Promise<string[]> {
    let playerMatches_API_CALL = `${this.createBaseUrl(
      hostValue,
    )}/lol/match/v5/matches/by-puuid/${puuid}/ids?${this.api_query}`; // creates api call
    if (matchQueryParameter) {
      // adds querystring to api call if exists
      const queryString = objectToQueryString(matchQueryParameter);
      playerMatches_API_CALL = `${playerMatches_API_CALL}&${queryString}`;
    }
    return axios
      .get(playerMatches_API_CALL)
      .then((response) => {
        console.log(`Fetched Player Matches for Puuid: ${puuid}`);
        return response.data;
      })
      .catch((err) => Promise.reject(err));
  }

  /**
   * https://developer.riotgames.com/apis#match-v5/GET_getMatch
   *
   * @param hostValue has to be RegionalHostValue according to League API
   * @param matchId id of the match
   */
  async getMatch(hostValue: HostValue, matchId: string): Promise<MatchDto> {
    return axios
      .get(
        `${this.createBaseUrl(hostValue)}/lol/match/v5/matches/${matchId}?${
          this.api_query
        }`,
      )
      .then((response) => {
        console.log(`Fetched Match: ${matchId} `);
        return response.data as MatchDto;
      })
      .catch((err) => {
        const headers = err.response.headers;
        const retryAfter: number = +headers['retry-after'];
        return Promise.reject({ status: 429, retryAfter });
      });
  }

  private createBaseUrl(hostValue: HostValue): string {
    return `${this.protocol}://${hostValue.host}`;
  }
}
