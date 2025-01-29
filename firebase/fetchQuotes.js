import { getFirestore, collection, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const db = getFirestore();

export const fetchQuotes = async () => {
    try {
        // First, try to get quotes from AsyncStorage
        const cachedQuotes = await AsyncStorage.getItem("quotes");
        if (cachedQuotes) {
            return JSON.parse(cachedQuotes);
        }

        // If no cached quotes, fetch from Firestore
        const quotesCollection = collection(db, "quotes");
        const snapshot = await getDocs(quotesCollection);
        const quotes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Store fetched quotes in AsyncStorage for future use
        await AsyncStorage.setItem("quotes", JSON.stringify(quotes));

        return quotes;
    } catch (error) {
        console.error("Error fetching quotes:", error);
        throw error;
    }
};
