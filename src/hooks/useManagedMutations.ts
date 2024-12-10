import { DocumentData, FirestoreDocument } from '../types/firestore'
import { useCreateDocument, useUpdateDocument, useDeleteDocument } from './useFirestore'
import { useManagedMutation, MutationOptions } from './useManagedMutation'

export type ManagedMutationHooks<T extends FirestoreDocument> = {
  useCreateManagedDocument: () => (doc: DocumentData<T>, options?: MutationOptions) => Promise<string>;
  useUpdateManagedDocument: () => (id: string, data: Partial<T>, options?: MutationOptions) => Promise<void>;
  useDeleteManagedDocument: () => (id: string, options?: MutationOptions) => Promise<void>;
}

export function createManagedMutations<T extends FirestoreDocument>(
  collectionName: string
): ManagedMutationHooks<T> {
  
  function useCreateManagedDocument() {
    const createDoc = useCreateDocument<T>(collectionName)
    const { managedMutation } = useManagedMutation()

    return (doc: DocumentData<T>, options?: MutationOptions) => {
      return managedMutation(
        async () => createDoc.mutateAsync(doc),
        options
      )
    }
  }

  function useUpdateManagedDocument() {
    const updateDoc = useUpdateDocument<T>(collectionName)
    const { managedMutation } = useManagedMutation()

    return async (id: string, data: Partial<T>, options?: MutationOptions) => {
      return await managedMutation(
        async () => updateDoc.mutateAsync({ id, data }),
        options
      )
    }
  }

  function useDeleteManagedDocument() {
    const deleteDoc = useDeleteDocument(collectionName)
    const { managedMutation } = useManagedMutation()

    return (id: string, options?: MutationOptions) => {
      return managedMutation(
        async () => deleteDoc.mutateAsync({ id }),
        options
      )
    }
  }

  return {
    useCreateManagedDocument,
    useUpdateManagedDocument,
    useDeleteManagedDocument
  }
}
