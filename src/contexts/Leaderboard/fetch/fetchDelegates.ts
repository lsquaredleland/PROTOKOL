import { TOP_DELEGATES, TOP_DELEGATES_OFFSET, DELEGATES_FROM_LIST } from "apollo/queries"
import { Web3Provider } from '@ethersproject/providers'
import { DelegateData } from '../types'
import isAddress from 'utils/isAddress'
import { DocumentNode } from 'graphql'
import { AUTONOMOUS_PROPOSAL_BYTECODE } from 'constants/proposals'
import { Dispatch, SetStateAction } from "react"


interface DelegateQuery {
  query: DocumentNode
  variables?: { list?: false | string[] | undefined; skip?: number | undefined }
  fetchPolicy: string
}

interface DelegateResponse {
  data: {
    delegates: DelegateData[]
  }
}

async function fetchDelegatesFromClient(
  client: any,
  library: Web3Provider,
  setError: Dispatch<SetStateAction<string>>,
  query: DelegateQuery,
): Promise<DelegateData[] | null> {
  try {
    return client
      .query(query)
      .then(async (res: DelegateResponse) => {
        // check if account is EOA or not
        const typed = await Promise.all(
          res.data.delegates.map(d => {
            return library?.getCode(d.id)
          })
        )

        return res.data.delegates.map((d, i) => {
          const checksummed = isAddress(d.id)
          if (checksummed) {
            d.id = checksummed
          }

          return {
            ...d,
            EOA: typed[i] === '0x',
            autonomous: typed[i] === AUTONOMOUS_PROPOSAL_BYTECODE,
            handle: '', // handles.find(h => h.account.toLowerCase() === d.id.toLowerCase())?.handle,
            imageURL: '' // handles.find(h => h.account.toLowerCase() === d.id.toLowerCase())?.imageURL
          }
        })
      })
      .catch((e: any) => {
        const errorMsg = `Error fetching delegates from subgraph: ${e.message}`
        setError(errorMsg)
        return Promise.reject(errorMsg)
      })
  } catch (e) {
    const errorMsg = 'Unable to fetch delegates'
    setError(errorMsg)
    return Promise.reject(errorMsg)
  }
}

export async function fetchTopDelegates(
  client: any,
  library: Web3Provider,
  setError: Dispatch<SetStateAction<string>>,
): Promise<DelegateData[] | null> {
  return fetchDelegatesFromClient(client, library, setError, {
    query: TOP_DELEGATES,
    fetchPolicy: 'cache-first'
  })
}

export async function fetchTopDelegatesOffset(
  client: any,
  library: Web3Provider,
  setError: Dispatch<SetStateAction<string>>,
  maxFetched: number,
): Promise<DelegateData[] | null> {
  return fetchDelegatesFromClient(client, library, setError, {
    query: TOP_DELEGATES_OFFSET,
    variables: {
      skip: maxFetched
    },
    fetchPolicy: 'cache-first'
  })
}

export async function fetchSearchedDelegate(
  client: any,
  library: Web3Provider,
  setError: Dispatch<SetStateAction<string>>,
  searchedAddress: string[]
): Promise<DelegateData[] | null> {
  return fetchDelegatesFromClient(client, library, setError, {
    query: DELEGATES_FROM_LIST,
    variables: {
      list: searchedAddress
    },
    fetchPolicy: 'cache-first'
  })
}