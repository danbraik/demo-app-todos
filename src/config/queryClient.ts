import { MutationOptions } from '@tanstack/react-query'

export const defaultMutationOptions: Partial<MutationOptions<unknown, Error, unknown>> = {
  // networkMode: 'always',
  // retry: 1,
  // retryDelay: 1000,
}
