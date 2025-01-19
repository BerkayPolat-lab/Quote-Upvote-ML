import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { fetchQuotes } from '../../firebase/fetchQuotes'; // Import the fetch function
import HeartButton from '../components/heartButton';

const HomeScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);
  const [quotes, setQuotes] = useState([]); // Store all quotes
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
    if (quotesList && quotesList.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotesList.length);
      setCurrentQuote({
        ...quotesList[randomIndex],
        likes: 0, // Reset likes for the new quote
      });
    }
  };

  // Change quote every 30 seconds
  useEffect(() => {
    if (quotes.length > 0) {
      const interval = setInterval(() => pickRandomQuote(quotes), 10000);

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [quotes]);

  // Function to handle liking a quote
  const handleLike = () => {
    setCurrentQuote((prevQuote) => ({
      ...prevQuote,
      likes: prevQuote.likes + 1, // Increment likes count
    }));
  };

  const handleLogOut = async () => {
    try {
      await logout;
      navigation.replace("Login");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <ScrollView contentContainerStyle={{flex:1, justifyContent: 'center', flexGrow: 1, padding: 20 }}>
      <Text style={styles.title}>Your Daily Quote</Text>
      <Text style={styles.quote}>{currentQuote.quote}</Text>
      {currentQuote.author && (
        <Text style={styles.author}>- {currentQuote.author}</Text>
      )}

      {/* Display the number of likes */}
      <Text style={styles.likes}>Likes: {currentQuote.likes}</Text>

      {/* Heart Button */}
      <HeartButton onPress={handleLike} />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  quote: { fontSize: 18, fontStyle: 'italic', marginBottom: 10, textAlign: 'center' },
  author: { fontSize: 16, fontStyle: 'italic', textAlign: 'center', color: 'gray' },
  likes: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  logoutButton: {
    backgroundColor: '#FF5733',
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
