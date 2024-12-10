import { FirestoreDocument } from "./firestore";

export interface Todo extends FirestoreDocument {
  text: string;
  completed: boolean;
}
