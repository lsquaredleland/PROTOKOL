import React, { useState, useEffect } from "react";
import Context from "./Context";
import { CURRENT_SUPPORTED_PROTOCOLS } from "contexts/Protocols/data";
import { GovernanceInfo } from "contexts/Protocols/types";
import { ProtocolPrices } from "./types";


const fetchPrices = (
  protocols: GovernanceInfo[],
  currency: string,
  setCurrentPrices: (update: ProtocolPrices) => void
) => {
  const addresses = protocols.map(
    (protocol: GovernanceInfo) => protocol.token.address
  );
  const contractAddresses = addresses.join("%2C");
  const endpoint = `https://api.coingecko.com/api/v3/simple/token_price/ethereum`
  const coingeckoUrl = `${endpoint}?contract_addresses=${contractAddresses}&vs_currencies=${currency}`;
  
  fetch(coingeckoUrl)
    .then(res => res.json())
    .then(
      (result) => {
        const intermediate: ProtocolPrices = {}
        protocols.forEach((protocol: GovernanceInfo) => {
          intermediate[protocol.id] = result[protocol.token.address.toLowerCase()].usd
        })
        setCurrentPrices(intermediate)
      },
      (error) => {
        console.log('ERROR:' + error)
      }
    )
}

const Provider: React.FC = ({ children }) => {
  const [currentPrices, setCurrentPrices] = useState<ProtocolPrices>({})
  // const [currency, setCurrency]... (makes sense if using i18n eventually...)

  useEffect(() => {
    async function fetchPricesFromCoingecko() {
      try {
        fetchPrices(CURRENT_SUPPORTED_PROTOCOLS, 'usd', setCurrentPrices)
      } catch (e) {
        console.log('ERROR:' + e)
      }
    }
    fetchPricesFromCoingecko()
  }, [setCurrentPrices])

  return (
    <Context.Provider
      value={{
        currentPrices
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;