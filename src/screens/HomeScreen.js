import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import reducedQuotes from '../../data/reduced_quotes.json'; // Correct path to the JSON file
import HeartButton from '../components/heartButton';

const HomeScreen = () => {
  const { logout } = useContext(AuthContext);
  const [currentQuote, setCurrentQuote] = useState({
    quote: 'Loading...',
    author: '',
    likes: 0, // Add a likes property to track likes
  });

  // Function to pick a random quote
  const pickRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * reducedQuotes.length);
    setCurrentQuote({
      ...reducedQuotes[randomIndex],
      likes: 0, // Reset likes for the new quote
    });
  };

  // Set a random quote every 30 seconds
  useEffect(() => {
    pickRandomQuote(); // Pick the first random quote immediately
    const interval = setInterval(pickRandomQuote, 30000); // Change quote every 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Function to handle liking a quote
  const handleLike = () => {
    setCurrentQuote((prevQuote) => ({
      ...prevQuote,
      likes: prevQuote.likes + 1, // Increment the likes count
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Quotes</Text>
      <Text style={styles.quote}>{currentQuote.quote}</Text>
      {currentQuote.author && (
        <Text style={styles.author}>- {currentQuote.author}</Text>
      )}

      {/* Display the number of likes */}
      <Text style={styles.likes}>Likes: {currentQuote.likes}</Text>

      {/* Heart Button */}
      <HeartButton onPress={handleLike} />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
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
