import { TOP_DELEGATES, TOP_DELEGATES_OFFSET } from "apollo/queries"
import { Web3Provider } from '@ethersproject/providers'
import { DelegateData } from '../types'
import fetchProfileData from 'utils/fetchProfileData'
import isAddress from 'utils/isAddress'
import { DocumentNode } from 'graphql'
import { AUTONOMOUS_PROPOSAL_BYTECODE } from 'constants/proposals'
import { Identities } from "contexts/Social/types"
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
  allIdentities: Identities,
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
        // for each handle - get twitter profile data ,
        const handles = await Promise.all(
          res.data.delegates.map(async (a: DelegateData) => {
            const checksummed = isAddress(a.id)
            const handle = checksummed ? allIdentities?.[checksummed]?.twitter?.handle : undefined

            let profileData
            try {
              if (handle) {
                const res = await fetchProfileData(handle)
                if (res) {
                  profileData = res
                }
              }
            } catch (e) {
              profileData = undefined
            }

            return {
              account: a.id,
              handle,
              imageURL: profileData?.data?.profile_image_url
            }
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
            handle: handles.find(h => h.account.toLowerCase() === d.id.toLowerCase())?.handle,
            imageURL: handles.find(h => h.account.toLowerCase() === d.id.toLowerCase())?.imageURL
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
  allIdentities: Identities,
  setError: Dispatch<SetStateAction<string>>,
): Promise<DelegateData[] | null> {
  return fetchDelegatesFromClient(client, library, allIdentities, setError, {
    query: TOP_DELEGATES,
    fetchPolicy: 'cache-first'
  })
}

export async function fetchTopDelegatesOffset(
  client: any,
  library: Web3Provider,
  allIdentities: Identities,
  setError: Dispatch<SetStateAction<string>>,
  maxFetched: number,
): Promise<DelegateData[] | null> {
  return fetchDelegatesFromClient(client, library, allIdentities, setError, {
    query: TOP_DELEGATES_OFFSET,
    variables: {
      skip: maxFetched
    },
    fetchPolicy: 'cache-first'
  })
}