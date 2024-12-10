import { useMutationState } from '../hooks/useMutationState'

export function MutationModal() {
  const { state, close } = useMutationState()

  if (!state.isOpen) return null

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box">
        <div className="flex flex-col items-center">
          {state.status === 'loading' && (
            <span className="loading loading-spinner loading-lg text-primary"></span>
          )}
          
          {state.status === 'success' && (
            <div className="alert alert-success">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}

          {state.status === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{state.error}</span>
              </div>
              <button
                onClick={close}
                className="btn btn-neutral"
              >
                OK
              </button>
            </div>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
