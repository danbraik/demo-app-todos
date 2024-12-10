import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  runTransaction,
  Transaction,
  DocumentReference,
  CollectionReference,
} from "firebase/firestore";
import { db } from "../firebase";
import { startObserveCollection } from "../myFreeReads";
import { dexie } from "../dexie";
import { Table } from "dexie";
import { firestoreTransactionMaxAttempts } from "../config/env";
import { DocumentData, FirestoreDocument } from "../types/firestore";

type QueryTransform <T extends FirestoreDocument> = (query: Table<T>) => any;

// Fonctions de transaction Firestore
const createDocument = async <T extends FirestoreDocument>(
  transaction: Transaction,
  collectionRef: CollectionReference,
  data: DocumentData<T>
) => {
  const docRef = doc(collectionRef);
  
  transaction.set(docRef, {
    ...data,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  
  return docRef.id;
};

const updateDocument = async <T extends FirestoreDocument>(
  transaction: Transaction,
  docRef: DocumentReference,
  data: Partial<DocumentData<T>>
) => {
  const docSnap = await transaction.get(docRef);
  
  if (!docSnap.exists()) {
    throw new Error("Document introuvable");
  }

  transaction.update(docRef, {
    ...data,
    updated_at: serverTimestamp(),
  });
  
  return docSnap
};

const markDocumentAsDeleted = async (
  transaction: Transaction, 
  docRef: DocumentReference
) => {
  const docSnap = await transaction.get(docRef);
  
  if (!docSnap.exists()) {
    throw new Error("Document introuvable");
  }

  transaction.update(docRef, {
    is_deleted: true,
    updated_at: serverTimestamp(),
  });
};

// Hook pour récupérer un document
export function useDocument<T extends FirestoreDocument>(collectionName: string, documentId: string) {
  return useQuery({
    queryKey: ["document", collectionName, documentId],
    queryFn: async () => {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Document introuvable");
      }

      const data = docSnap.data();
      return {
        ...data,
        id: docSnap.id,
        created_at: data.created_at?.toDate(),
        updated_at: data.updated_at?.toDate(),
      } as T;
    },
    enabled: !!documentId,
  });
}

// Hook pour récupérer une collection
export function useCollection<T extends FirestoreDocument>(
  collectionName: string, 
  transform: QueryTransform<T> = (q) => q
) {
  return useQuery({
    queryKey: ["collection", collectionName, transform.toString()],
    queryFn: async () => {
      startObserveCollection(collectionName);
      const docs = await transform(dexie.table(collectionName))
        .filter((doc: any) => doc.is_deleted === undefined || doc.is_deleted === false)
        .toArray();
      return docs;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 1,
  });
}

// Hook pour créer un nouveau document
export function useCreateDocument<T extends FirestoreDocument>(collectionName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DocumentData<T>) => {
      const collectionRef = collection(db, collectionName);
      
      return runTransaction(
        db,
        (transaction) => createDocument(transaction, collectionRef, data),
        { maxAttempts: firestoreTransactionMaxAttempts }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collection", collectionName] });
    },
  });
}

// Hook pour mettre à jour un document
export function useUpdateDocument<T extends FirestoreDocument>(collectionName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DocumentData<T>> }) => {
      const docRef = doc(db, collectionName, id);

      return await runTransaction(
        db, 
        (transaction) => updateDocument(transaction, docRef, data),
        { maxAttempts: firestoreTransactionMaxAttempts }
      );
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["collection", collectionName] });
      queryClient.invalidateQueries({ queryKey: ["document", collectionName, data.id] });
    },
  });
}

// Hook pour supprimer un document
export function useDeleteDocument(collectionName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const docRef = doc(db, collectionName, id);
      
      await runTransaction(
        db,
        (transaction) => markDocumentAsDeleted(transaction, docRef),
        { maxAttempts: firestoreTransactionMaxAttempts }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collection", collectionName] });
    },
  });
}
