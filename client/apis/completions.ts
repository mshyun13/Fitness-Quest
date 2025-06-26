import { CompletionOfChallenge } from '../../models/completionsModel.ts'

// type GetAccessTokenSilently = (opts?: any) => Promise<string>

export async function getCompletions(
  userId: string,
  // getAccessTokenSilently?: GetAccessTokenSilently
): Promise<CompletionOfChallenge[]> {
  console.log(
    'completionsApi.getCompletions: API function entered for userId:',
    userId,
  )
  // let accessToken: string | undefined = undefined;
  // if (getAccessTokenSilently) {
  //   try {
  //     accessToken = await getAccessTokenSilently();
  //   } catch (tokenError) {
  //     console.error('Failed to get access token in apiClient:', tokenError);
  //     throw new Error('Authentication token required or failed to retrieve');
  //   }
  // }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  // if (accessToken) {
  //   headers['Authorization'] = `Bearer ${accessToken}`;
  // }

  console.log(
    'completionsApi.getCompletions: About to fetch from /api/v1/completions/' +
      userId,
  )
  const response = await fetch(`/api/v1/completions/${userId}`, {
    method: 'GET',
    headers: headers,
  })
  console.log(
    'completionsApi.getCompletions: Fetch response received, status:',
    response.status,
  )

  if (!response.ok) {
    const errorData = await response.text()
    console.error(
      'completionsApi.getCompletions: Fetch failed, error data:',
      errorData,
    )
    throw new Error(`HTTP error! ${response.status} - ${errorData}`)
  }

  const data: CompletionOfChallenge[] = await response.json()
  console.log('completionsApi.getCompletions: Data parsed:', data)
  return data
}

export async function addCompletionApi(
  newCompletion: {
    userId: string
    challengeId: number
    status: 'completed' | 'missed'
  },
  // getAccessTokenSilently?: GetAccessTokenSilently,
): Promise<number> {
  // let accessToken: string | undefined = undefined
  // if (getAccessTokenSilently) {
  //   try {
  //     accessToken = await getAccessTokenSilently()
  //   } catch (tokenError) {
  //     throw new Error('Authentication token required or failed to retrieve.')
  //   }
  // }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  // if (accessToken) {
  //   headers['Authorization'] = `Bearer ${accessToken}`
  // }

  const response = await fetch('/api/v1/completions', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(newCompletion),
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`HTTP error! ${response.status} - ${errorData}`)
  }

  const result = await response.json()
  return result.id
}
