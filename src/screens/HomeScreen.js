import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { fetchQuotes } from '../../firebase/fetchQuotes'; // Import the fetch function
import HeartButton from '../components/heartButton';
import {collection, addDoc, Timestamp, updateDoc, doc} from "firebase/firestore";
import { db } from '../config/fireBaseConfig';


const HomeScreen = ({ navigation }) => {
  const { logout, user, likedQuotes, setLikedQuotes } = useContext(AuthContext);
  const [quotes, setQuotes] = useState([]); // Store all quotes
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState();
  const [currentQuote, setCurrentQuote] = useState({
    quote: 'Loading...',
    author: '',
    likes: 0,
  });

  // Fetch quotes from Firestore on mount
  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const fetchedQuotes = await fetchQuotes();
        setQuotes(fetchedQuotes); // Save fetched quotes to state
        pickRandomQuote(fetchedQuotes); // Pick the first random quote
      } catch (error) {
        console.error("Error loading quotes:", error);
      }
    };

    loadQuotes();
  }, []);

  
  // Function to pick a random quote
  const pickRandomQuote = (quotesList) => {
    if (currentQuote.likes == 0) {
      if (quotesList && quotesList.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotesList.length);
        setCurrentQuoteIndex(randomIndex);
        setCurrentQuote({
          ...quotesList[randomIndex],
          likes: 0, // Reset likes for the new quote
        });
      }
    } else {
      const fetchSimilarQuote = async () => {
        try {
          // Send the currentQuoteIndex to the backend
          const response = await fetch("http://127.0.0.1:5000/similar-quote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ likedQuoteIndex: currentQuoteIndex }),
          });
      
          const similarQuote = await response.json();
      
          if (similarQuote) {
            setCurrentQuote({
              quote: similarQuote.quote,
              author: similarQuote.author,
              likes: 0, // Reset likes for the new similar quote
            });
          }
        } catch (error) {
          console.error("Error fetching similar quote:", error);
        }
      }
      fetchSimilarQuote();
    }
  };

  // Change quote every 20 seconds
  useEffect(() => {
    if (quotes.length > 0) {
      const interval = setInterval(() => pickRandomQuote(quotes), 20000);

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [quotes]);

  // Function to handle liking a quote
  const handleLike = async () => {
    if (!currentQuote.id) {
      console.error("Quote ID is missing.");
      return;
    }

    // Check if the user has already liked the quote
    if (likedQuotes.some((quote) => quote.id === currentQuote.id)) {
      return;
    }

    try {
      setCurrentQuote((prevQuote) => ({
        ...prevQuote,
        likes: prevQuote.likes + 1, // Increment likes count
      }));

      setLikedQuotes([...likedQuotes, currentQuote]);

      // Add to "liked-quotes" collection
      await addDoc(collection(db, "liked-quotes"), {
        ...currentQuote,
        userId: user.uid,
        Timestamp: Timestamp.now(),
        likes: currentQuote.likes + 1,
      });

      // Correct way to update Firestore: Get a document reference
      const quoteRef = doc(db, "quotes", currentQuote.id);
      await updateDoc(quoteRef, {
        likes: currentQuote.likes + 1, // Just update the likes field
      });

    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogOut = async () => {
    try {
      await logout;
      navigation.replace("Login");
    } catch (err) {
      setError(err.message);
    }
  }

  const handleLikedQuotesPage = () => {
    try {
      navigation.replace("LikedQuotesPage"); 
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <ScrollView contentContainerStyle={{flex:1, justifyContent: 'center', flexGrow: 1, padding: 20, backgroundColor: '#fff' }}>
      {/* Liked Quotes Button */}
      <TouchableOpacity style={styles.likedQuotesButton} onPress={handleLikedQuotesPage}>
        <Text style={styles.likedQuotesText}>Liked Quotes</Text>
      </TouchableOpacity>
      {/* Liked Quotes Button */}
      <Text style={styles.title}>Your Daily Quote</Text>
      <Text style={styles.quote}>{currentQuote.quote}</Text>
      {currentQuote.author && (
        <Text style={styles.author}>- {currentQuote.author}</Text>
      )}

      {/* Display the number of likes */}
      <Text style={styles.likes}>Likes: {currentQuote.likes}</Text>

      <HeartButton onPress={handleLike} />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  likedQuotesButton: {
    position: 'absolute', // Absolute positioning
    top: 10,             // Distance from the top
    right: 10,       // Distance from the right
    backgroundColor: '#cdc7c5',
    padding: 10,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    padding: 5,
    length: 100,
    width: 120,
    textAlign: 'center',
  },
  likedQuotesText: {
    color: '#ff0000', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  quote: { fontSize: 18, fontStyle: 'italic', marginBottom: 10, textAlign: 'center' },
  author: { fontSize: 16, fontStyle: 'italic', textAlign: 'center', color: 'gray' },
  likes: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  logoutButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
