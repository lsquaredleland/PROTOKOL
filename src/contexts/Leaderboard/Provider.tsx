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
import { usePrices } from "contexts/Prices";
import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";


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
  const activeLeaderboardData = useRef<DelegateDataMulti[]>([])

  const { currentPrices } = usePrices() // Calling a context within another context, is this wise, or should supply from outside?

  // FIX: being called prior to all data has loaded
  useEffect(() => {
    const protocolKeys = activeLeaderboard.map((protocol: GovernanceInfo) => protocol.id)
    
    let allRawData: Array<DelegateDataPrice> = [];
    protocolKeys.forEach((protocolId: string) => {
      // should check for all data loaded or something...
      if (protocolId in rawData.current) {
        const intermediate: DelegateDataPrice[] = rawData.current[protocolId].map((datapoint: DelegateData) => {
          return ({
            ...datapoint,
            value: datapoint.delegatedVotes * currentPrices[protocolId],
            protocolId,
          })
        })
        allRawData = allRawData.concat(intermediate);
        
      }
    })

    // 1. Grouping + calculating top level value
    // 2. Sort `allRawData` by value of delegated tokens
    const grouped = groupBy(allRawData, ({ id }: DelegateDataPrice) => id)
    const delegatesIds = Object.keys(grouped);
    const delegatesValue: DelegateDataMulti[] = delegatesIds.map((id) => {
      const delegateDatas: DelegateDataPrice[] = grouped[id];
      const { EOA, autonomous, handle, imageURL } = delegateDatas[0]
      const value = delegateDatas.reduce((accumulator: number, current: DelegateDataPrice) => {
        return accumulator + current.value
      }, 0)

      const perProtocol: any = {}
      delegateDatas.forEach((protocol: DelegateDataPrice) => {
        perProtocol[protocol.protocolId] = protocol
      })

      return {
        id,
        EOA,
        autonomous,
        handle,
        imageURL,
        value,
        perProtocol
      }
    })

    activeLeaderboardData.current = sortBy(delegatesValue, [(d: DelegateDataMulti) => -1 * d.value])
    console.log(activeLeaderboardData.current);

  }, [activeLeaderboard, currentPrices])



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