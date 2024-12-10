import { createContext, useContext, useState, ReactNode } from 'react'

type MutationState = {
  isOpen: boolean
  status: 'loading' | 'success' | 'error'
  error?: string
}

type MutationContextType = {
  state: MutationState
  startMutation: () => void
  setSuccess: ({ quickMode }: { quickMode: boolean }) => void
  setError: (error: string) => void
  close: () => void
}

const MutationContext = createContext<MutationContextType | null>(null)

export function MutationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MutationState>({
    isOpen: false,
    status: 'loading'
  })

  const startMutation = () => {
    setState({
      isOpen: true,
      status: 'loading'
    })
  }

  const setSuccess = ({ quickMode } : { quickMode: boolean }) => {
    const delayForSuccess = quickMode ? 0 : 500
    const delayForClose = quickMode ? 0 : 500+800
    
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        status: 'success'
      }))
    }, delayForSuccess)
    
    setTimeout(() => {
      setState(prev => ({ ...prev, isOpen: false }))
    }, delayForClose)
  }

  const setError = (error: string) => {
    setState(prev => ({
      ...prev,
      status: 'error',
      error
    }))
  }

  const close = () => {
    setState(prev => ({ ...prev, isOpen: false }))
  }

  return (
    <MutationContext.Provider value={{ state, startMutation, setSuccess, setError, close }}>
      {children}
    </MutationContext.Provider>
  )
}

export function useMutationState() {
  const context = useContext(MutationContext)
  if (!context) {
    throw new Error('useMutationState must be used within a MutationProvider')
  }
  return context
}
