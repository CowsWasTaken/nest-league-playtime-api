import { Injectable } from '@nestjs/common';

@Injectable()
export class RateLimiterService {
  requestPerInterval = 100;
  intervalTime = 120; // in seconds

  // works like a queue, the length is checked wheter it reached the requestPerInterval length and checking remaing time on the last object,
  // becuase the the last element should be the first made request
  private requestQueue: { timestamp: number }[] = [];

  /**
   * in case the rate limiting time cant be made correctly, the last request in requestQueue gets deleted after header 'retry-after' time
   * @param err err object with headers included
   */
  async rateLimitExceeded(err: any) {
    const headers = err.response.headers;
    const retryAfter = +headers['retry-after'];
    const currentTimeStamp = Math.floor(Date.now() / 1000);
    const remainingTimeStamp = currentTimeStamp + retryAfter;
    await this.delay(remainingTimeStamp);
    this.deleteLastRequestInQueue();
  }

  /**
   * removes the last element from the list, which is the first request made -> array works as queue
   */
  private deleteLastRequestInQueue() {
    this.requestQueue.splice(this.requestQueue.length, 1);
  }

  /**
   * loops through array backwards checking if the timestamp when the request was made is with intervalTime bigger than current time and if so deletes it
   * -> is the request out of the interval and can be reused
   */
  filterRequestQueue() {
    for (let i = this.requestQueue.length - 1; i >= 0; i--) {
      if (this.requestQueue[i].timestamp + this.intervalTime > Date.now()) {
        this.requestQueue.splice(i, 1);
      } else {
        break;
      }
    }
  }

  /**
   * checks if there is space for new request
   *    positive: request pushes to queue
   *    negative: waits for delay until it can be made
   */
  async makeRequest() {
    this.filterRequestQueue();
    const remainingTime = this.getRemainingTimeForRequest();
    if (remainingTime !== 0) {
      this.delay(remainingTime);
    }
    this.requestQueue.push({ timestamp: Date.now() });
  }

  /**
   * checks if the requestsPerInterval is bigger than the current length of the queue
   * @returns number of request that can be made for the request per interval
   */
  private getRemainingRequests(): number {
    return this.requestPerInterval - this.requestQueue.length;
  }

  /**
   * checks if array is full
   *    positive: no time to wait returns
   *    negative: gets timestamp of last element of queue and and adds intervalTime to it
   * @returns remaining time until request can be made
   */
  getRemainingTimeForRequest() {
    if (this.getRemainingRequests() > 0) {
      return 0;
    } else {
      const timeUntilRequest =
        this.requestQueue[this.requestQueue.length].timestamp +
        this.intervalTime;

      return timeUntilRequest - Date.now();
    }
  }

  /**
   *
   * @param ms delay in milliseconds
   * @returns Promise with given delay
   */
  delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
}
