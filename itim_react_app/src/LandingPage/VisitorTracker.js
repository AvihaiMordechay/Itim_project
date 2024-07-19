import { db } from '../Firebase';
import { doc, setDoc, increment, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';

export const trackVisit = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const visitorRef = doc(db, 'visitors', today);

  try {
    await setDoc(visitorRef, { count: increment(1) }, { merge: true });
    
    // Delete data older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString().slice(0, 10);

    const q = query(collection(db, 'visitors'), where('__name__', '<', cutoffDate));
    const snapshot = await getDocs(q);
    snapshot.docs.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error("Error tracking visit or cleaning up: ", error);
  }
};