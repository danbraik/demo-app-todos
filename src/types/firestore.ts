
export interface FirestoreDocument {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export type DocumentData<T extends FirestoreDocument> = Omit<T, keyof FirestoreDocument>;
