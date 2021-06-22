import { compoundClient, poolClient, radicleClient, uniswapClient } from "apollo/client";
import React, { useState, useEffect } from "react";
import Context from "./Context";
import { fetchTopDelegates } from "./fetchDelegates"
import { useActiveWeb3React } from "hooks/connectivity"
import { GovernanceInfo } from "contexts/Protocols/types";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { DelegateData } from './types'
import { RADICLE_GOVERNANCE, POOL_TOGETHER_GOVERNANCE, UNISWAP_GOVERNANCE, COMPOUND_GOVERNANCE} from "contexts/Protocols/data";
import { usePrices } from "contexts/Prices";


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
  const [rawData, setRawData] = useState<RawResponse>({});

  // const { currentPrices } = usePrices()
  // Calling a context within another context, is this wise, or should supply from outside?


  const { library } = useActiveWeb3React();

  // https://github.com/Uniswap/sybil-interface/blob/master/src/state/social
  // ^move this data into Contexts
  // const [allIdentities] = useAllIdentities()

  // Can't useEffect here -> useMemo instead?
  useEffect(() => {
    async function fetchTopDelegateData(
      client: ApolloClient<NormalizedCacheObject>,
      id: string
    ) {
      try {
        library &&
          client &&
          fetchTopDelegates(client, library).then(async delegateData => {
            if (delegateData) {
              setRawData({ ...rawData, ...{[id]: delegateData} })
              console.log("delegateData", id, delegateData)
            }
          })
      } catch (e) {  
        console.log('ERROR:' + e)
      }
    }
    // This iteration will cause rerenders...alternatively can wait for all data
    activeLeaderboard.forEach(({ id }: GovernanceInfo) => {
      // fetchTopDelegateData(clients[id], id)  
    })
  }, [library, clients, activeLeaderboard, setRawData])
  

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