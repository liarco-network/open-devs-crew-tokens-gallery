import { BigNumber } from 'ethers';
import { useDebounce } from 'use-debounce';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { SendTransactionResult } from '@wagmi/core';

interface Props {
  children: ReactNode;
}

interface CollectionInterface {
  totalSupply?: BigNumber;
  tokensData: any;
}

const CollectionContext = createContext({} as CollectionInterface);

export function useCollectionContext() {
  return useContext(CollectionContext);
}

export function CollectionProvider({ children }: Props) {
  const contractAbi = require('../assets/contractAbi.json');
  const contractAddress = '0x5BfBf78d81CD7d255dFA44d9f568375131361775';

  const { data: totalSupply } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'totalSupply',
    watch: true,
  });

  const { data: tokensData } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getTokensDataInRange',
    args: [1, totalSupply],
    enabled: Boolean(totalSupply),
  })

  const value: CollectionInterface = {
    totalSupply: totalSupply as BigNumber | undefined,
    tokensData,
  };

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
}
