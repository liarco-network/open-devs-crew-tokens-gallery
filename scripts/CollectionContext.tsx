import { BigNumber } from 'ethers';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useContractRead, useAccount } from 'wagmi';
import moment from 'moment';

import { TokenData } from './utils/Aux';

interface Props {
  children: ReactNode;
}

interface UserWalletData {
  address?: string;
  tokensData?: TokenData[];
  selectedTokens: number[];
  diamondHolderToken?: number;
  latestWithdrawTimestamp?: BigNumber;
}

interface CollectionInterface {
  userWallet: UserWalletData;
  handleSelectedToken: (tokenId: number) => void;
  setAllSelectedTokens: (selectAll: boolean) => void;
  addressInactivityTimeFrame: BigNumber;
  totalSupply?: BigNumber;
  tokensData?: TokenData[];
  traitsData?: TraitData[];
  tokensTraitData?: TokenTraitData;
}

interface TraitData {
  name: string;
  values: string[];
}

interface TokenTraitData {
  [key: string]: {
    openRarity: {
      rank: number;
      score: number;
    };
    traits: number[];
  }
}

interface TokenGeneralData {
  traitsData: TraitData[];
  tokensData: TokenTraitData;
}

const CollectionContext = createContext({} as CollectionInterface);

export function useCollectionContext() {
  return useContext(CollectionContext);
}

export function CollectionProvider({ children }: Props) {
  const [ traitsData, setTraitsData ] = useState<TraitData[]>();
  const [ tokensTraitData, setTokensTraitData ] = useState<TokenTraitData>();
  const [ selectedTokens, setSelectedTokens ] = useState<number[]>([]);

  const { address: userWalletAddress } = useAccount();
  const contractAbi = require('../assets/contractAbi.json');
  const contractAddress = '0x5BfBf78d81CD7d255dFA44d9f568375131361775';

  const LOCAL_STORAGE_TOKEN_DATA_KEY = 'token_general_data';
  const URL_TOKEN_TRAITS_CDN = 'https://cdn.opendevs.io/data/public/general.json';

  const { data: totalSupply } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'totalSupply',
    watch: false,
  }) as unknown as { data: BigNumber };

  const { data: tokensData } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getTokensDataInRange',
    args: [1, totalSupply],
    enabled: Boolean(totalSupply),
  }) as unknown as { data: TokenData[] };

  const { data: userLatestWithdrawTimestamp } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getLatestWithdrawalTimestamp',
    args: [userWalletAddress],
    enabled: Boolean(userWalletAddress),
  }) as unknown as { data:BigNumber };

  const { data: addressInactivityTimeFrame } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'ADDRESS_INACTIVITY_TIME_FRAME',
  }) as unknown as { data: BigNumber };

  const { data: diamondHandsTimeFrame } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'DIAMOND_HANDS_HOLDER_TIME_FRAME',
  }) as unknown as { data: BigNumber };

  const userTokensData = useMemo(() => {
    if (tokensData && userWalletAddress) {
      return tokensData.filter((token) => {
        if (token.ownerAddress === userWalletAddress) {
          return token;
        }
      });
    }

    return undefined;
  }, [tokensData, userWalletAddress]);

  const fetchTokenData = async () => {
    const tokenDataResponse = await fetch(URL_TOKEN_TRAITS_CDN)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);

      return {
        tokensData: {},
        traitsData: [],
      };
    });

    localStorage.setItem(LOCAL_STORAGE_TOKEN_DATA_KEY, JSON.stringify(tokenDataResponse));

    return tokenDataResponse;
  }

  const tokenTraitDataManager = async () => {
    const previousLocalStorageTokenData = localStorage.getItem(LOCAL_STORAGE_TOKEN_DATA_KEY);

    const localStorageTokenData =
      (previousLocalStorageTokenData && previousLocalStorageTokenData.length === (totalSupply as BigNumber).toNumber())
      ? JSON.parse(previousLocalStorageTokenData) as TokenGeneralData
      : await fetchTokenData();

    setTraitsData(localStorageTokenData!.traitsData);
    setTokensTraitData(localStorageTokenData!.tokensData);
  }

  const handleSelectedToken = (tokenId: number) => {
    const tokenIndex = selectedTokens.indexOf(tokenId);

    setSelectedTokens(prev => {
      const previous = [...prev];
      if (tokenIndex !== -1) {
        previous.splice(tokenIndex, 1);
        return previous;
      }

      previous.push(tokenId);
      return previous;
    });
  }

  const setAllSelectedTokens = (selectAll: boolean) => {
    if (userTokensData) {
      if (selectAll) {
        setSelectedTokens(userTokensData.map((token) => token.tokenId.toNumber()));
        return;
      }

      setSelectedTokens([]);
    }
  }

  const getDiamondHolderToken = useMemo(() => {
    if (userTokensData) {
      const diamondHolderToken: {tokenId?: number, timestamp: number} = {
        timestamp: moment().unix() - diamondHandsTimeFrame.toNumber(),
      };

      userTokensData.forEach((tokenData) => {
        const tokenOwnershipStartTimestamp = tokenData.ownershipStartTimestamp.toNumber();

        if(tokenOwnershipStartTimestamp < diamondHolderToken.timestamp) {
          diamondHolderToken.tokenId = tokenData.tokenId.toNumber();
          diamondHolderToken.timestamp = tokenOwnershipStartTimestamp;
        }
      });

      return diamondHolderToken.tokenId !== 0 ? diamondHolderToken.tokenId : undefined;
    }
  },[userTokensData]);

  useEffect(() => {
    if (tokensData) {
      tokenTraitDataManager();
    }
  },[totalSupply, tokensData]);

  const value: CollectionInterface = {
    userWallet: {
      address: userWalletAddress,
      tokensData: userTokensData,
      selectedTokens,
      diamondHolderToken: getDiamondHolderToken,
      latestWithdrawTimestamp: userLatestWithdrawTimestamp,
    },
    handleSelectedToken,
    setAllSelectedTokens,
    addressInactivityTimeFrame,
    totalSupply,
    tokensData,
    traitsData,
    tokensTraitData,
  };

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
}
