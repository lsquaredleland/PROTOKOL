import { compoundClient, poolClient, radicleClient, uniswapClient } from "apollo/client";
import React, { useState, useEffect, useRef } from "react";
import Context from "./Context";
import { fetchTopDelegates } from "./fetch/fetchDelegates"
import { useActiveWeb3React } from "hooks/connectivity"
import { GovernanceInfo } from "contexts/Protocols/types";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { DelegateData, DelegateDataPrice, DelegateDataMulti } from './types'
import { RADICLE_GOVERNANCE, POOL_TOGETHER_GOVERNANCE, UNISWAP_GOVERNANCE, COMPOUND_GOVERNANCE} from "contexts/Protocols/data";
import { useCallback } from "react";
import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
import difference from "lodash/difference";
import { ProtocolPrices } from "contexts/Prices/types";

// Warry
import { usePrices } from "contexts/Prices";
import { useSocial } from "contexts/Social"


interface RawResponse {
  [id: string]: DelegateData[];
}

const clients = {
  [RADICLE_GOVERNANCE.id]: radicleClient,
  [POOL_TOGETHER_GOVERNANCE.id]: poolClient,
  [UNISWAP_GOVERNANCE.id]: uniswapClient,
  [COMPOUND_GOVERNANCE.id]: compoundClient,
}

const generateleaderboardRankings = function(
  activeLeaderboard: GovernanceInfo[],
  rawData: React.MutableRefObject<RawResponse>,
  currentPrices: ProtocolPrices
): DelegateDataMulti[] {
  const protocolKeys = activeLeaderboard.map((protocol: GovernanceInfo) => protocol.id)
  
  let allRawData: Array<DelegateDataPrice> = [];
  protocolKeys.forEach((protocolId: string) => {
    const intermediate: DelegateDataPrice[] = rawData.current[protocolId].map((datapoint: DelegateData) => {
      return ({
        ...datapoint,
        value: datapoint.delegatedVotes * currentPrices[protocolId],
        protocolId,
      })
    })
    allRawData = allRawData.concat(intermediate);
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

  return sortBy(delegatesValue, [(d: DelegateDataMulti) => -1 * d.value])
}

// TODO: hard refresh of all data
const Provider: React.FC = ({ children }) => {
  const [activeLeaderboard, setActiveLeaderboard] = useState<Array<GovernanceInfo>>([]);
  const rawData = useRef<RawResponse>({})
  // const leaderboardRankings = useRef<DelegateDataMulti[]>([])

  const [leaderboardRankings, setLeaderboardRankings] = useState<DelegateDataMulti[]>([]);

  const [dataLoaded, setDataLoaded] = useState<Array<String>>([]);

  const { currentPrices } = usePrices()
  // Question: calling a Context within another Context ok?
  // ^b/c active protocols are being passed in rather than grabbed like usePrices() here...

  useEffect(() => {
    const diff = difference(activeLeaderboard.map(({id}: GovernanceInfo) => id), dataLoaded)
    if (diff.length > 0) {
      return // ensuring that all data is loaded prior to running
    }

    const data = generateleaderboardRankings(activeLeaderboard, rawData, currentPrices)
    setLeaderboardRankings(data)
  }, [activeLeaderboard, currentPrices, dataLoaded])

  const { library } = useActiveWeb3React();
  const { allIdentities } = useSocial();

  // Behaviour seems the same w/ or w/o useCallback?
  const fetchTopDelegateData = useCallback(
    async (
      client: ApolloClient<NormalizedCacheObject>,
      id: string
    ) => {
      try {
        library &&
        allIdentities &&
          client &&
          fetchTopDelegates(client, library, allIdentities).then(async delegateData => {
            if (delegateData) {
              rawData.current[id] = delegateData
              setDataLoaded((prevDataLoaded) => prevDataLoaded.concat([id]))
            }
          })
      } catch (e) {  
        console.log('ERROR:' + e)
      }
    },
    [library, allIdentities, rawData]
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
        setActiveLeaderboard,
        leaderboardRankings
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;