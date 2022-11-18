import { BigNumber } from 'ethers';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';

interface Props {
  children: ReactNode;
}

interface CollectionInterface {
  totalSupply?: BigNumber;
  tokensData?: TokenData[];
  traitsData?: TraitData[];
  tokensTraitData?: TokenTraitData;
}

interface TokenData {
  tokenId: BigNumber;
  ownerAddress: string;
  ownershipStartTimestamp: BigNumber;
  tokenBalance: BigNumber;
  ownerLatestActivityTimestamp: BigNumber;
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
  const contractAbi = require('../assets/contractAbi.json');
  const contractAddress = '0x5BfBf78d81CD7d255dFA44d9f568375131361775';

  const LOCAL_STORAGE_TOKEN_DATA_KEY = 'token_general_data';
  const URL_TOKEN_TRAITS_CDN = 'https://cdn.opendevs.io/data/public/general.json';

  const { data: totalSupply } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'totalSupply',
    watch: false,
  });

  const { data: tokensData } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getTokensDataInRange',
    args: [1, totalSupply],
    enabled: Boolean(totalSupply),
  })

  const fetchTokenData = async () => {
    const tokenDataResponse = await fetch(URL_TOKEN_TRAITS_CDN)
    .then((res) => res.json())
    .catch((err) => {
      // TODO: handle error
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
      (previousLocalStorageTokenData && previousLocalStorageTokenData?.length === (totalSupply as BigNumber).toNumber())
      ? JSON.parse(previousLocalStorageTokenData) as TokenGeneralData
      : await fetchTokenData();
    
    setTraitsData(localStorageTokenData!.traitsData);
    setTokensTraitData(localStorageTokenData!.tokensData);
  }

  useEffect(() => {
    if (tokensData) {
      tokenTraitDataManager();
    }
  },[totalSupply]);

  const value: CollectionInterface = {
    totalSupply: totalSupply as BigNumber | undefined,
    tokensData: tokensData as TokenData[] | undefined,
    traitsData,
    tokensTraitData,
  };

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
}
