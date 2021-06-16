import { ChainId, Token } from '@uniswap/sdk'
import UniLogo from 'assets/images/uni-logo.png'
import CompLogo from 'assets/images/compLogo.png'
import AaveLogo from 'assets/images/aave-logo.png'
import PoolLogo from 'assets/images/pooltogether-icon.png'
import RadicleLogo from 'assets/images/radicle-logo.svg'
import { SerializedToken, GovernanceInfo } from './types'


// From https://github.com/Uniswap/sybil-interface/blob/master/src/state/governance/reducer.ts
export function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name
  }
}

// constant addresses for supported protocols
export const UNI_GOVERNANCE_ADDRESS = '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F'
export const UNI_ADDRESS = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
const UNI = new Token(ChainId.MAINNET, UNI_ADDRESS, 18, 'UNI', 'Uniswap')

export const UNISWAP_GOVERNANCE: GovernanceInfo = {
  id: 'uniswap',
  name: 'Uniswap Governance',
  logo: UniLogo,
  primaryColor: '#FF007A',
  secondaryColor: '#FDEEF5',
  token: serializeToken(UNI),
  governanceAddress: UNI_GOVERNANCE_ADDRESS,
  social: '@UniswapProtocol',
  emoji: '🦄'
}

export const COMP_GOVERNANCE_ADDRESS = '0xc0dA01a04C3f3E0be433606045bB7017A7323E38'
export const COMP_ADDRESS = '0xc00e94cb662c3520282e6f5717214004a7f26888'
const COMP = new Token(ChainId.MAINNET, COMP_ADDRESS, 18, 'COMP', 'Compound Governance Token')

export const COMPOUND_GOVERNANCE: GovernanceInfo = {
  id: 'compound',
  name: 'Compound Governance',
  logo: CompLogo,
  primaryColor: '#00D395',
  secondaryColor: '#f0fffa',
  token: serializeToken(COMP),
  governanceAddress: COMP_GOVERNANCE_ADDRESS,
  social: '@compoundfinance',
  emoji: '🏦'
}

export const AAVE_GOVERNANCE_ADDRESS = '0xEC568fffba86c094cf06b22134B23074DFE2252c'
export const AAVE_ADDRESS = '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'
const AAVE = new Token(ChainId.MAINNET, AAVE_ADDRESS, 18, 'AAVE', 'Aave Token')

export const AAVE_GOVERNANCE: GovernanceInfo = {
  id: 'aave',
  name: 'Aave Governance',
  logo: AaveLogo,
  primaryColor: '#B6509E',
  secondaryColor: '#ebfeff',
  token: serializeToken(AAVE),
  governanceAddress: AAVE_GOVERNANCE_ADDRESS,
  social: '@AaveAave',
  emoji: '👻'
}

export const POOL_TOGETHER_GOVERNANCE_ADDRESS = '0xB3a87172F555ae2a2AB79Be60B336D2F7D0187f0'
export const POOL_ADDRESS = '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e'
const POOL = new Token(ChainId.MAINNET, POOL_ADDRESS, 18, 'POOL', 'PoolTogether')

export const POOL_TOGETHER_GOVERNANCE: GovernanceInfo = {
  id: 'pool',
  name: 'PoolTogether Governance',
  logo: PoolLogo,
  primaryColor: '#5c0ef3',
  secondaryColor: '#f2eeff',
  token: serializeToken(POOL),
  governanceAddress: POOL_TOGETHER_GOVERNANCE_ADDRESS,
  social: '@PoolTogether_',
  emoji: '🏆'
}

export const RADICLE_GOVERNANCE_ADDRESS = '0x690e775361AD66D1c4A25d89da9fCd639F5198eD'
export const RADICLE_ADDRESS = '0x31c8EAcBFFdD875c74b94b077895Bd78CF1E64A3'
const RADICLE = new Token(ChainId.MAINNET, RADICLE_ADDRESS, 18, 'RAD', 'Radicle')

export const RADICLE_GOVERNANCE: GovernanceInfo = {
  id: 'radicle',
  name: 'Radicle Governance',
  logo: RadicleLogo,
  primaryColor: '#5555FF',
  secondaryColor: '#E3E3FF',
  token: serializeToken(RADICLE),
  governanceAddress: RADICLE_GOVERNANCE_ADDRESS,
  social: '@radicle',
  emoji: '🌱'
}

// mapping for routing
export const SUPPORTED_PROTOCOLS: { [id: string]: GovernanceInfo } = {
  uniswap: UNISWAP_GOVERNANCE,
  compound: COMPOUND_GOVERNANCE,
  aave: AAVE_GOVERNANCE,
  pool: POOL_TOGETHER_GOVERNANCE,
  radicle: RADICLE_GOVERNANCE
}
