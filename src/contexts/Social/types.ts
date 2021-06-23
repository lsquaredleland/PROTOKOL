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