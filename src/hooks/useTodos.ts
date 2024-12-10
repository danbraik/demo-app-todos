import { createManagedMutations } from './useManagedMutations'
import { useCollection } from './useFirestore'
import { Todo } from '../types/todo';

const collectionName = 'todos'

// Query hook spécifique aux todos
export function useTodos(completed?: boolean) {
  return useCollection<Todo>(collectionName, query => {
    let q = query.orderBy('created_at').reverse();
    
    if (completed !== undefined) {
      q = q.filter((todo: any) => todo.completed === completed);
    }
    
    return q;
  });
}

// Hooks de mutation génériques
export const {
  useCreateManagedDocument: useCreateTodo,
  useUpdateManagedDocument: useUpdateTodo,
  useDeleteManagedDocument: useDeleteTodo
} = createManagedMutations<Todo>(collectionName)
