import React, { useState, useEffect, useRef } from "react";
import Context from "./Context";
import { fetchTopDelegates, fetchSearchedDelegate } from "./fetch/fetchDelegates"
import { useActiveWeb3React } from "hooks/connectivity"
import { GovernanceInfo } from "contexts/Protocols/types";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { DelegateData, DelegateDataPrice, DelegateDataMulti } from './types'
import { clientMapping } from "contexts/Protocols/data";
import { useCallback } from "react";
import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
import difference from "lodash/difference";
import isEmpty from "lodash/isEmpty";
import intersection from "lodash/intersection";
import { ProtocolPrices } from "contexts/Prices/types";
import { TallyIdentities } from "contexts/Social/types";

// Warry
import { usePrices } from "contexts/Prices";
import { useSocial } from "contexts/Social"


interface RawResponse {
  [id: string]: DelegateData[];
}

const generateleaderboardRankings = function(
  activeLeaderboard: GovernanceInfo[],
  rawData: React.MutableRefObject<RawResponse>,
  currentPrices: ProtocolPrices,
  tallyIdentities: TallyIdentities, 
): DelegateDataMulti[] {
  const protocolKeys = activeLeaderboard.map((protocol: GovernanceInfo) => protocol.id)
  
  let allRawData: Array<DelegateDataPrice> = [];
  protocolKeys.forEach((protocolId: string) => {
    const intermediate: DelegateDataPrice[] = rawData.current[protocolId].map((datapoint: DelegateData) => {
      const tally = tallyIdentities[datapoint.id.toLowerCase()]
      return ({
        ...datapoint,
        value: datapoint.delegatedVotes * currentPrices[protocolId],
        protocolId,
        handle: tally?.twitterUsername,
        displayName: tally?.displayName,
        imageURL: tally?.avatarUrl,
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
    const { EOA, autonomous, handle, imageURL, displayName } = delegateDatas[0]
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
      perProtocol,
      displayName,
    }
  })

  return sortBy(delegatesValue, [(d: DelegateDataMulti) => -1 * d.value])
}

// TODO: hard refresh of all data
const Provider: React.FC = ({ children }) => {
  const [activeLeaderboard, setActiveLeaderboard] = useState<Array<GovernanceInfo>>([]);
  const rawData = useRef<RawResponse>({})
  const [leaderboardRankings, setLeaderboardRankings] = useState<DelegateDataMulti[]>([]);
  const [dataLoaded, setDataLoaded] = useState<Array<String>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // For search address data (replicating entire leaderboard for ranking reasons...)
  const rawSearchData = useRef<RawResponse>({}) // SEARCH
  const [searchRankings, setSearchRankings] = useState<DelegateDataMulti[]>([]); // SEARCH
  const [searchAddress, setSearchAddress] = useState<string>(''); // SEARCH
  const [searchDataLoaded, setSearchDataLoaded] = useState<Array<String>>([]); // SEARCH

  const { currentPrices } = usePrices()
  const { setAddresses, tallyIdentities } = useSocial();
  // Question: calling a Context within another Context ok?
  // ^b/c active protocols are being passed in rather than grabbed like usePrices() here...

  useEffect(() => {
    const protocolKeys = activeLeaderboard.map((protocol: GovernanceInfo) => protocol.id)
    const currentData = Object.keys(rawData.current)

    // Only setting once all data has loaded
    if (intersection(currentData, protocolKeys).length === protocolKeys.length && !isEmpty(tallyIdentities)) {
      setLeaderboardRankings(generateleaderboardRankings(activeLeaderboard, rawData, currentPrices, tallyIdentities))
    }
  }, [tallyIdentities, activeLeaderboard, currentPrices, setLeaderboardRankings])

  useEffect(() => {
    const diff = difference(activeLeaderboard.map(({id}: GovernanceInfo) => id), dataLoaded)
    if (diff.length > 0) {
      setLoading(true);
      return // ensuring that all data is loaded prior to running
    }

    const allAddresses = new Set(
      Object.values(rawData.current)
        .flat(1)
        .map((delegate: DelegateData) => delegate.id)
    )
    setAddresses(allAddresses);

    setLeaderboardRankings(generateleaderboardRankings(activeLeaderboard, rawData, currentPrices, {}))
    setLoading(false)
    setError('')
  }, [activeLeaderboard, currentPrices, dataLoaded, setLoading, setError, setAddresses])

  // Search (little hacky)
  useEffect(() => {
    const diff = difference(activeLeaderboard.map(({id}: GovernanceInfo) => id), searchDataLoaded)
    if (diff.length > 0) {
      return // ensuring that all data is loaded prior to running
    }

    const allAddresses = new Set(
      Object.values(rawSearchData.current)
        .flat(1)
        .map((delegate: DelegateData) => delegate.id)
    )
    setAddresses(allAddresses);
    
    setSearchRankings(generateleaderboardRankings(activeLeaderboard, rawSearchData, currentPrices, {}))
  }, [activeLeaderboard, currentPrices, searchDataLoaded, searchAddress, setAddresses])

  const { library } = useActiveWeb3React();

  // Behaviour seems the same w/ or w/o useCallback?
  const fetchTopDelegateData = useCallback(
    async (
      client: ApolloClient<NormalizedCacheObject>,
      id: string
    ) => {
      try {
        library &&
        client &&
        fetchTopDelegates(client, library, setError).then(async delegateData => {
          if (delegateData) {
            rawData.current[id] = delegateData
            setDataLoaded((prevDataLoaded) => prevDataLoaded.concat([id]))
          }
        })
      } catch (e) {  
        console.log('ERROR:' + e)
        setError('ERROR:' + e)
      }
    },
    [library, rawData, setError]
  )

  // SEARCH
  const fetchSearchedDelegateData = useCallback(
    async (
      client: ApolloClient<NormalizedCacheObject>,
      id: string
    ) => {
      console.log([searchAddress])
      try {
        library &&
        client &&
        fetchSearchedDelegate(client, library, setError, [searchAddress.toLowerCase()]).then(async delegateData => {
          if (delegateData) {
            rawSearchData.current[id] = delegateData
            setSearchDataLoaded((prev) => prev.concat([id]))
          }
        })
      } catch (e) {  
        console.log('ERROR:' + e)
      }
    },
    [library, searchAddress, setError]
  )
  
  useEffect(() => {
    const keys = Object.keys(rawData.current)
    activeLeaderboard.forEach(({ id }: GovernanceInfo) => {
      if (keys.indexOf(id) === -1) {
        fetchTopDelegateData(clientMapping[id], id)
      }
      
      // SEARCH
      if (searchAddress !== "") {
        console.log('call', searchAddress)
        fetchSearchedDelegateData(clientMapping[id], id)
      } else {
        setSearchRankings([])
      }
    })
  }, [fetchTopDelegateData, fetchSearchedDelegateData, activeLeaderboard, rawData, searchAddress])
  
  return (
    <Context.Provider
      value={{
        setActiveLeaderboard,
        setSearchAddress,
        searchAddress,
        leaderboardRankings,
        searchRankings,
        loading,
        error
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;