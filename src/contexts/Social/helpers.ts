import { TallyIdentities } from './types'


export async function fetchAllTallyIdentities(
  addresses: Set<string>
): Promise<TallyIdentities | undefined> {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ addresses: Array.from(addresses) })
  };

  try {
    return fetch('https://identity.withtally.com/user/profiles/by/address', requestOptions)
    .then(async res => {
      if (!res || res.status !== 200) {
        return Promise.reject('Unable to fetch Tally data')
      } else {
        return res
          .json()
          .then(data => {
            const content = data.data
            return content.usersByAddress
          })
          .catch(() => {
            return Promise.reject('Error fetch verified Tally data')
          })
      }
    })
    .catch(() => {
      return undefined
    })
      
  } catch (e) {
    return Promise.reject('Error fetching Tally identities')
  }
}