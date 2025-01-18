const admin = require("firebase-admin");
const quotes = require("../data/reduced_quotes.json");

const serviceAccount = require("./quotes-3afcb-firebase-adminsdk-fbsvc-b785b9d273.json");

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  
  const db = admin.firestore();
  
  const uploadQuotes = async () => {
    const quotesCollection = db.collection("quotes");
  
    try {
      const firstThousandQuotes = quotes.slice(0, 100); // Take only the first 1000 quotes
      const batch = db.batch();
  
      firstThousandQuotes.forEach((quote, index) => {
        const docRef = quotesCollection.doc(`quote_${index + 1}`); // Document ID
        batch.set(docRef, {
          quote: quote.quote,
          author: quote.author,
          category: quote.category,
        });
      });
  
      await batch.commit();
      console.log("First 1000 quotes uploaded successfully!");
    } catch (error) {
      console.error("Error uploading quotes:", error);
    }
  };
  
  uploadQuotes();