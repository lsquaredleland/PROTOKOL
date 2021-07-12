export interface TallyAddress {
  [address: string]: string
}

export interface TallyIdentities {
  [address: string]: {
    tallId: string,
    displayName: string,
    description: string,
    avatarUrl: string,
    twitterUsername: string,
    discordHandle: string,
    source: string,
    attestationUrl: string,
    addresses: Array<TallyAddress>,
  }
}