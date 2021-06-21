import { GLOBAL_DATA } from 'apollo/queries'


export interface GlobaData {
  id: string
  totalTokenHolders: number
  totalDelegates: number
  delegatedVotes: number
  delegatedVotesRaw: number
}

interface GlobalResponse {
  data: {
    governances: GlobaData[]
  }
}

export async function fetchGlobalData(client: any): Promise<GlobaData | null> {
  if (!client) {
    return null
  }
  return client
    .query({
      query: GLOBAL_DATA,
      fetchPolicy: 'cache-first'
    })
    .then(async (res: GlobalResponse) => {
      if (res) {
        return res.data.governances[0]
      } else {
        return Promise.reject('Error fetching global data')
      }
    })
    .catch(() => {
      return Promise.reject('Error fetching from subgraph')
    })
}