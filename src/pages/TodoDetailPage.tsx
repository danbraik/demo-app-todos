import { useParams, useNavigate } from 'react-router-dom'
import { useDocument } from '../hooks/useFirestore'
import { Todo } from '../types/todo'
import { useUpdateTodo } from '../hooks/useTodos'
import { useState } from 'react'

export function TodoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: todo, isLoading, isError, error } = useDocument<Todo>('todos', id ?? '')
  const updateManagedTodo = useUpdateTodo()
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')

  const handleToggleComplete = () => {
    if (todo && id) {
      updateManagedTodo(id, { completed: !todo.completed }, { quickMode: true })
    }
  }

  const handleStartEdit = () => {
    setEditText(todo?.text ?? '')
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (todo && id && editText.trim()) {
      updateManagedTodo(id, { text: editText.trim() })
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditText('')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Une erreur est survenue: {error.message}</span>
        </div>
      </div>
    )
  }

  if (!todo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Tâche non trouvée</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Détails de la tâche</h1>
        <button 
          onClick={() => navigate(-1)}
          className="btn btn-ghost"
        >
          Retour
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="input input-bordered"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="btn btn-success btn-sm"
                    disabled={!editText.trim()}
                  >
                    OK
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="btn btn-ghost btn-sm"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="card-title">
                    {todo.text}
                    {todo.completed && (
                      <span className="badge badge-success">Terminée</span>
                    )}
                  </h2>
                  <button
                    onClick={handleStartEdit}
                    className="btn btn-ghost btn-circle btn-sm"
                    title="Modifier le titre"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
            <button
              onClick={handleToggleComplete}
              className={`btn ${todo.completed ? 'btn-error' : 'btn-success'}`}
            >
              {todo.completed ? 'Marquer comme non terminée' : 'Marquer comme terminée'}
            </button>
          </div>
          
          <div className="flex flex-col gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500">Créée le</p>
              <p>{todo.created_at?.toLocaleDateString()}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Dernière modification</p>
              <p>{todo.updated_at?.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
