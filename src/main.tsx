import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App.tsx'
import './index.css'
import { MutationProvider } from './hooks/useMutationState'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000,
      gcTime: 1000 * 60 * 60,
    },
    mutations: {
      networkMode: 'always',
      retry: 1,
  retryDelay: 1000,
    },
    
  },
  
})

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Failed to find root element')
}

const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MutationProvider>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </MutationProvider>
    </QueryClientProvider>
  </StrictMode>
)
