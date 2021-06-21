import { getAddress } from '@ethersproject/address'

// returns the checksummed address if the address is valid, otherwise returns false
export default function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}
