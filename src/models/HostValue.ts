import { BadRequestException } from '@nestjs/common';

export interface HostValue {
  region: string;
  host: string;
}

export class HostValue {
  static getConstant(region: string, constants: HostValue[]): HostValue {
    const foundHostValue = constants.find(
      (constant) => constant.region === region.toUpperCase(),
    );
    if (foundHostValue === undefined) {
      throw new BadRequestException('Regional Host not found');
    }
    return foundHostValue;
  }
}
