import React, { useState } from "react";
import Context from "./Context";
import { COMPOUND_GOVERNANCE, UNISWAP_GOVERNANCE, CURRENT_SUPPORTED_PROTOCOLS } from "./data";
import { GovernanceInfo } from "./types";


const Provider: React.FC = ({ children }) => {
  // Question: should below be an object or array is sufficient?
  const [activeProtocols, setActiveProtocols] = useState<Array<GovernanceInfo>>(
    [UNISWAP_GOVERNANCE, COMPOUND_GOVERNANCE]
  );

  const allProtocols = CURRENT_SUPPORTED_PROTOCOLS

  return (
    <Context.Provider
      value={{
        activeProtocols,
        setActiveProtocols,
        allProtocols
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;


// import React, { useState, useEffect } from "react";
// import Context from "../Protocols/Context";
// import { GLOBAL_DATA } from 'apollo/queries'
// import { uniswapClient } from "apollo/client";


// export interface GlobaData {
//   id: string
//   totalTokenHolders: number
//   totalDelegates: number
//   delegatedVotes: number
//   delegatedVotesRaw: number
// }

// interface GlobalResponse {
//   data: {
//     governances: GlobaData[]
//   }
// }

// export async function fetchGlobalData(client: any): Promise<GlobaData | null> {
//   if (!client) {
//     return null
//   }
//   return client
//     .query({
//       query: GLOBAL_DATA,
//       fetchPolicy: 'cache-first'
//     })
//     .then(async (res: GlobalResponse) => {
//       if (res) {
//         return res.data.governances[0]
//       } else {
//         return Promise.reject('Error fetching global data')
//       }
//     })
//     .catch(() => {
//       return Promise.reject('Error fetching from subgraph')
//     })
// }
