import { BigNumber } from 'ethers';

export interface TokenData {
  tokenId: BigNumber;
  ownerAddress: string;
  ownershipStartTimestamp: BigNumber;
  tokenBalance: BigNumber;
  ownerLatestActivityTimestamp: BigNumber;
}

export const parseDate = (timestamp: BigNumber | number) => {
  const dateTimestamp = (typeof timestamp === 'number') ? timestamp : timestamp.toNumber();
  const date = new Date(1000 * dateTimestamp);

  return `${date.getUTCFullYear()}-${date.getMonth() + 1}-${date.getUTCDate()} ${formatZero(date.getUTCHours())}:${formatZero(date.getUTCMinutes())} UTC`
}

export const parseDateWithoutTime = (timestamp: BigNumber | number) => {
  const dateTimestamp = (typeof timestamp === 'number') ? timestamp : timestamp.toNumber();
  const date = new Date(1000 * dateTimestamp);

  return `${date.getUTCFullYear()}-${date.getMonth() + 1}-${date.getUTCDate()}`
}

const formatZero = (time: number) => {
  return time >= 10 ? time : '0'+time;
}

export const getLatestTimestamp = (latestWithdrawTimestap: BigNumber, userTokens: TokenData[]) => {
  if (!latestWithdrawTimestap.eq(0)) {
    return latestWithdrawTimestap.toNumber();
  }

  let latestTimestamp = 0;
  userTokens.filter((token) => {
    if (token.ownershipStartTimestamp.gt(latestTimestamp)) {
      latestTimestamp = token.ownershipStartTimestamp.toNumber();
    }
  });

  return latestTimestamp;
}
