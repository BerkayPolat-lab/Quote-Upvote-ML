import { getFirestore, collection, getDocs } from "firebase/firestore";

// Initialize Firestore
const db = getFirestore();

export const fetchQuotes = async () => {
  try {
    const quotesCollection = collection(db, "quotes");
    const snapshot = await getDocs(quotesCollection);
    const quotes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return quotes;
  } catch (error) {
    console.error("Error fetching quotes:", error);
    throw error;
  }
};
