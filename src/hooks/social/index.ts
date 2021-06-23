import { useEffect, useState } from "react";


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

export function fetchProfileData(handle: string): Promise<ProfileDataResponse | null> {
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

interface TwitterProfileData {
  name: string
  handle: string
  profileURL: string
}
// get handle and profile image from twitter
export function useTwitterProfileData(handle: string | undefined | null): TwitterProfileData | undefined {
  const [formattedData, setFormattedData] = useState<TwitterProfileData | undefined>()

  useEffect(() => {
    if (!handle) {
      setFormattedData(undefined)
    } else {
      fetchProfileData(handle)
        .then((profileData: ProfileDataResponse | null) => {
          if (profileData?.data) {
            setFormattedData({
              name: profileData.data.name,
              handle: profileData.data.username,
              profileURL: profileData.data.profile_image_url
            })
          }
        })
        .catch(() => {
          console.log('Error fetching profile data')
        })
    }
  }, [handle])

  return formattedData
}

export function useMultipleTwitterProfileDatas(
  handles: (string | undefined)[]
): { [handle: string]: TwitterProfileData | undefined } | undefined {
  const [formattedData, setFormattedData] = useState<{ [handle: string]: TwitterProfileData | undefined }>()

  const length = handles.length
  useEffect(() => {
    setFormattedData(undefined)
  }, [length])

  useEffect(() => {
    async function fetchData() {
      // for each handle attestation - verify which ones are legit,
      Promise.all(
        handles.map(async (handle: string | undefined) => {
          if (handle) {
            return fetchProfileData(handle)
              .then(profileData => {
                return {
                  account: '',
                  handle,
                  profileURL: profileData?.data?.profile_image_url
                }
              })
              .catch(() => undefined)
          } else {
            return undefined
          }
        })
      )
        .then(handlesData => {
          setFormattedData(Object.assign({}, ...handlesData.map(key => key && { [key.handle]: key })))
        })
        .catch(() => undefined)
    }

    // only fetch if valid list of handles
    if (!formattedData) {
      fetchData()
    }
  }, [handles, formattedData])

  return formattedData
}
