import { useState } from 'react'
import {  useTodos } from '../hooks/useTodos'
import { useCreateTodo, useUpdateTodo, useDeleteTodo } from '../hooks/useTodos'
import { Todo } from '../types/todo'
import { useNavigate } from 'react-router-dom'

export function TodosPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [title, setTitle] = useState('')
  const todos = useTodos()
  const createManagedTodo = useCreateTodo()
  const updateManagedTodo = useUpdateTodo()
  const deleteManagedTodo = useDeleteTodo()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    createManagedTodo({ text: title, completed: false }, {
      onSuccess: () => {
        setTitle('')
        setIsFormOpen(false)
      }
    })
  }

  const handleToggle = (id: string, completed: boolean) => {
    updateManagedTodo(id, { completed: !completed }, { quickMode: true})
  }

  const handleDelete = async (id: string) => {     
    await deleteManagedTodo(id)
  }

  if (todos.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (todos.isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Une erreur est survenue: {todos.error.message}</span>
        </div>
      </div>
    )
  }
  
  

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes tâches</h1>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary"
        >
          Nouveau
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-6">
          <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nouvelle tâche..."
                  className="input input-bordered flex-1"
                />
                <button
                  type="submit"
                  className="btn btn-success"
                >OK
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="btn btn-ghost"
                >
                  Annuler
                </button>
              </div>
             
            </div>
          </form>
        </div>
      )}
      
      <div className="space-y-4">
        {todos.data?.map((todo: Todo) => (
          <div 
            key={todo.id}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body flex-row items-center justify-between py-4">
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={todo.completed ?? false}
                  onChange={() => handleToggle(todo.id, todo.completed ?? false)}
                  className="checkbox"
                />
                <span className={todo.completed ? "line-through text-gray-500" : ""}>
                  {todo.text}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/todo/${todo.id}`)}
                  className="btn btn-ghost btn-circle"
                  title="Voir les détails"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="btn btn-ghost btn-circle"
                  title="Supprimer"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
        {todos.data?.length === 0 && (
          <div className="text-center text-gray-500">
            Aucune tâche pour le moment
          </div>
        )}
      </div>
    </div>
  )
}
