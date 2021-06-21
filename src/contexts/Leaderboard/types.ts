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

export interface Identity {
  twitter: TwitterEntry | undefined
  other: UncategorizedContentEntry | undefined
}

export interface Identities {
  [address: string]: Identity
}
