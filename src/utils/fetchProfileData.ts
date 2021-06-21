export const TWITTER_WORKER_URL = 'https://twitter-worker.uniswap.workers.dev'

export interface ProfileDataResponse {
  data: {
    id: number
    name: string
    username: string
    profile_image_url: string
  }
}

const PROFILE_DATA_PROMISES: { [key: string]: Promise<ProfileDataResponse | null> } = {}

export default function fetchProfileData(handle: string): Promise<ProfileDataResponse | null> {
  const key = `${handle}`
  const url = `${TWITTER_WORKER_URL}/user?handle=${handle}`
  try {
    return (PROFILE_DATA_PROMISES[key] =
      PROFILE_DATA_PROMISES[key] ??
      fetch(url)
        .then(async res => {
          if (res.status === 200) {
            return res.json()
          } else {
            Promise.reject('No handle found')
            return null
          }
        })
        .catch(error => {
          return Promise.reject(error)
        }))
  } catch {
    return Promise.reject('Error fetching profile data')
  }
}