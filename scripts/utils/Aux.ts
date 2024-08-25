import { BigNumber, ethers } from 'ethers';

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

export const getSafeLatestActivityTimestamp = (latestWithdrawTimestamp: BigNumber, userTokens: TokenData[]) => {
  if (!latestWithdrawTimestamp.eq(0)) {
    return latestWithdrawTimestamp.toNumber();
  }

  let latestTimestamp = userTokens[0].ownershipStartTimestamp.toNumber();
  userTokens.map((token) => {
    if (token.ownershipStartTimestamp.lt(latestTimestamp)) {
      latestTimestamp = token.ownershipStartTimestamp.toNumber();
    }
  });

  return latestTimestamp;
}

export const formatEtherValue = (value: BigNumber): string => {
  const floatValue = parseFloat(ethers.utils.formatEther(value));

  if (floatValue < 0.001) {
    return '< 0.001';
  }

  return (Math.floor(floatValue * 1000) / 1000).toFixed(3);
}
