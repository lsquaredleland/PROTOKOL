import { Identities } from './types'
// Endpoints
const VERIFIED_JSON = 'https://api.github.com/repos/uniswap/sybil-list/contents/verified.json'


export async function fetchAllIdentities(): Promise<Identities | undefined> {
  try {
    return fetch(VERIFIED_JSON)
      .then(async res => {
        if (!res || res.status !== 200) {
          return Promise.reject('Unable to fetch verified handles')
        } else {
          return res
            .json()
            .then(data => {
              const content = data.content
              const decodedContent = atob(content)
              const parsed = JSON.parse(decodedContent)
              return parsed
            })
            .catch(() => {
              return Promise.reject('Error fetch verified handle data')
            })
        }
      })
      .catch(() => {
        return undefined
      })
  } catch (e) {
    return Promise.reject('Error fetch verified handle data')
  }
}
