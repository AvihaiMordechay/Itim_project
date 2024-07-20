import { db } from '../Firebase';
import { doc, setDoc, increment, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';

/**
 * trackVisit
 * 
 * This function tracks visitor counts and manages the visitor data in Firestore.
 * It performs two main tasks:
 * 1. Increments the visitor count for the current day.
 * 2. Deletes visitor data older than 30 days to maintain database efficiency.
 * 
 * @async
 * @function
 * @returns {Promise<void>}
 */
export const trackVisit = async () => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().slice(0, 10);

  // Reference to today's document in the 'visitors' collection
  const visitorRef = doc(db, 'visitors', today);

  try {
    // Increment the visitor count for today
    await setDoc(visitorRef, { count: increment(1) }, { merge: true });
    
    // Delete data older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString().slice(0, 10);

    // Query to get documents older than the cutoff date
    const q = query(collection(db, 'visitors'), where('__name__', '<', cutoffDate));
    const snapshot = await getDocs(q);
        
    // Delete each document older than the cutoff date
    snapshot.docs.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error("Error tracking visit or cleaning up: ", error);
  }
};