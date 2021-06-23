import { Percent } from '@uniswap/sdk'

export interface DelegateData {
  id: string
  delegatedVotes: number
  delegatedVotesRaw: number
  votePercent: Percent
  votes: {
    id: string
    support: boolean
    votes: number
  }[]
  EOA: boolean | undefined //
  autonomous: boolean | undefined
  handle: string | undefined // twitter handle
  imageURL?: string | undefined
  tokenHoldersRepresentedAmount: number
}

export interface DelegateDataPrice extends DelegateData {
  value: number;
  protocolId: string;
}

export interface DelegateDataMulti {
  id: string
  EOA: boolean | undefined
  autonomous: boolean | undefined
  handle: string | undefined
  imageURL?: string | undefined
  value: number
  perProtocol: {
    [protocolId: string] : DelegateDataPrice
  }
}

// Consider moving all social types elsewhere
export interface TwitterEntry {
  handle: string | undefined
  timestamp: number
}

export interface UncategorizedContentEntry {
  name: string
  contentURL: string
}