import { compoundClient, poolClient, radicleClient, uniswapClient } from "apollo/client";
import React, { useState, useEffect } from "react";
import Context from "./Context";
import { fetchTopDelegates } from "./fetchDelegates"
import { useActiveWeb3React } from "hooks/connectivity"
import { GovernanceInfo } from "contexts/Protocols/types";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { DelegateData, DelegateDataPrice, DelegateDataMulti } from './types'
import { RADICLE_GOVERNANCE, POOL_TOGETHER_GOVERNANCE, UNISWAP_GOVERNANCE, COMPOUND_GOVERNANCE} from "contexts/Protocols/data";
import { useCallback } from "react";
import { useRef } from "react";
// import { usePrices } from "contexts/Prices";


interface RawResponse {
  [id: string]: DelegateData[];
}

const Provider: React.FC = ({ children }) => {
  const clients = {
    [RADICLE_GOVERNANCE.id]: radicleClient,
    [POOL_TOGETHER_GOVERNANCE.id]: poolClient,
    [UNISWAP_GOVERNANCE.id]: uniswapClient,
    [COMPOUND_GOVERNANCE.id]: compoundClient,
  }

  const [activeLeaderboard, setActiveLeaderboard] = useState<Array<GovernanceInfo>>([]);
  const rawData = useRef<RawResponse>({})
  const activeProtocolData = useRef<DelegateDataMulti[]>([])

  // const { currentPrices } = usePrices()
  // Calling a context within another context, is this wise, or should supply from outside?


  const { library } = useActiveWeb3React();

  // https://github.com/Uniswap/sybil-interface/blob/master/src/state/social
  // ^move this data into Contexts
  // const [allIdentities] = useAllIdentities()

  // Behaviour seems the same w/ or w/o useCallback?
  const fetchTopDelegateData = useCallback(
    async (
      client: ApolloClient<NormalizedCacheObject>,
      id: string
    ) => {
      try {
        library &&
          client &&
          fetchTopDelegates(client, library).then(async delegateData => {
            if (delegateData) {
              rawData.current[id] = delegateData
              console.log("delegateData", id, delegateData)
            }
          })
      } catch (e) {  
        console.log('ERROR:' + e)
      }
    },
    [library, clients, activeLeaderboard, rawData]
  )
  
  useEffect(() => {
    const keys = Object.keys(rawData.current)
    activeLeaderboard.forEach(({ id }: GovernanceInfo) => {
      if (keys.indexOf(id) === -1) {
        fetchTopDelegateData(clients[id], id)
      }
    })
  }, [fetchTopDelegateData, activeLeaderboard, rawData])
  

  return (
    <Context.Provider
      value={{
        setActiveLeaderboard
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;