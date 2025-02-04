// Import Firebase Admin SDK
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// Import Service Account Key
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('./quotes-3afcb-firebase-adminsdk-fbsvc-e7ca59c1dd.json', 'utf8'));

// Initialize Firebase Admin (Ensure it's not initialized twice)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Get Firestore Instance
const db = getFirestore();

// Function to Update `likes` Field in Quotes Collection
const addLikesFieldToQuotes = async () => {
  try {
    const quotesCollection = db.collection("quotes");
    const snapshot = await quotesCollection.get();

    for (const doc of snapshot.docs) {
      const quoteRef = quotesCollection.doc(doc.id);
      const data = doc.data();

      // If 'likes' field does not exist, set it to 0
      if (!data.likes) {
        await quoteRef.update({ likes: 0 });
        console.log(`Updated ${doc.id} with likes: 0`);
      }
    }

    console.log("All quotes updated successfully!");
  } catch (error) {
    console.error("Error updating likes field:", error);
  }
};

// Run the Function
addLikesFieldToQuotes();
