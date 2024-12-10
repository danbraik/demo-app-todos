import { useMutationState } from './useMutationState'

export type MutationOptions = {
  onSuccess?: () => void
  onError?: (error: Error) => void
  quickMode?: boolean
}

export function useManagedMutation() {
  const { startMutation, setSuccess, setError } = useMutationState()

  const managedMutation = async <T>(
    mutationFn: () => Promise<T>,
    customOptions?: MutationOptions
  ) => {
    const quickMode = customOptions?.quickMode ?? false
    
    startMutation()
    
    try {
      const result = await mutationFn()
      
      setSuccess({ quickMode })
      customOptions?.onSuccess?.()
      
      return result
    } catch (error) {      
      setError(error instanceof Error ? error.message : 'Une erreur est survenue')
      customOptions?.onError?.(error as Error)
      throw error
    }
  }

  return { managedMutation }
}
