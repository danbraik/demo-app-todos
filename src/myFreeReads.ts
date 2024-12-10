import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from './firebase';
import { dexie } from "./dexie";
import { queryClient } from "./main";

const observedCollections: string[] = [];

// Function to start observing a collection and getting real-time updates from Firestore
export async function startObserveCollection(collectionName: string) {
  if (observedCollections.includes(collectionName)) {
    return;
  }
  observedCollections.push(collectionName);
  
  const lastUpdateTimestamp = (await dexie.table('collection_last_updated_at').get(collectionName))?.last_updated_at || 0;
  
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, where("updated_at", ">", new Date(lastUpdateTimestamp)));
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    let lastUpdatedTimestamp = lastUpdateTimestamp;
    
    snapshot.docs.forEach((doc) => {
      
      const data = doc.data();
      const formattedData = {
        ...data,
        id: doc.id,
        created_at: data.created_at?.toDate(),
        updated_at: data.updated_at?.toDate(),
      };
      
      if ((formattedData as any).is_deleted) {
        dexie.table(collectionName).delete(doc.id);
      } else {
        dexie.table(collectionName).put(formattedData);
      }
      
      lastUpdatedTimestamp = Math.max(lastUpdatedTimestamp, data.updated_at?.toDate()?.valueOf() || 0);
    });
    
    dexie.table('collection_last_updated_at').put({
      name: collectionName,
      last_updated_at: lastUpdatedTimestamp,
    });
    
    queryClient.invalidateQueries({
      queryKey: ['collection', collectionName],
    });
  });

  return unsubscribe;
}
