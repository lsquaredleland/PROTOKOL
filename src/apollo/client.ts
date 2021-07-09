import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

export const uniswapClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/ianlapham/governance-tracking'
  }),
  cache: new InMemoryCache()
})

export const compoundClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/arr00/compound-governance-2'
  }),
  cache: new InMemoryCache()
})

export const aaveClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/aave/governance-sybil'
  }),
  cache: new InMemoryCache()
})

export const poolClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-governance'
  }),
  cache: new InMemoryCache()
})

export const radicleClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/radicle-dev/radicle-governance-homestead'
  }),
  cache: new InMemoryCache()
})

export const feiClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/timg512372/fei-protocol-subgraph'
  }),
  cache: new InMemoryCache()
})