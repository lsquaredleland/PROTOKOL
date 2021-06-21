import { compoundClient, poolClient, radicleClient, uniswapClient } from "apollo/client";
import React, { useState, useEffect } from "react";
import Context from "./Context";
import { fetchTopDelegates } from "./fetchDelegates"
import { useActiveWeb3React } from "hooks/useActiveWeb3React"
import { GovernanceInfo } from "contexts/Protocols/types";


const Provider: React.FC = ({ children }) => {
  const clients = [uniswapClient, compoundClient, poolClient, radicleClient];
  const client = clients[0]

  const [activeLeaderboard, setActiveLeaderboard] = useState<Array<GovernanceInfo>>([]);

  useEffect(() => {
    // Update which client(s) are used
    console.log("activeLeaderboard updated", activeLeaderboard)
  }, [activeLeaderboard])

  const { library } = useActiveWeb3React(); // Not working currently...

  // https://github.com/Uniswap/sybil-interface/blob/master/src/state/social/hooks.tsx#L13
  // ^determine how to reverse engineer (temporarily removed)
  // const [allIdentities] = useAllIdentities()

  useEffect(() => {
    async function fetchTopDelegateData() {
      try {
        library &&
          client &&
          fetchTopDelegates(client, library).then(async delegateData => {
            if (delegateData) {
              console.log("delegateData", delegateData) // TODO: set data here
            }
          })
      } catch (e) {  
        console.log('ERROR:' + e)
      }
    }
    fetchTopDelegateData()
  }, [library, client, activeLeaderboard])

  

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