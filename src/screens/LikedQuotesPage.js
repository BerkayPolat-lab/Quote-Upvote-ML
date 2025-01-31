import React, { useEffect, useState, useContext } from "react";
import { ScrollView, Text, StyleSheet, TouchableOpacity, ActivityIndicator, View } from "react-native";
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext to get user ID

const db = getFirestore();

const LikedQuotesPage = ({ navigation }) => {
    const { user } = useContext(AuthContext); // Get logged-in user
    const [likedQuotes, setLikedQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch liked quotes from Firestore
    useEffect(() => {
        const fetchLikedQuotes = async () => {
            if (!user) return; // Ensure user is logged in

            try {
                const quotesRef = collection(db, "liked-quotes"); // Reference to Firestore collection
                const q = query(quotesRef, where("userId", "==", user.uid)); // Query for user-specific quotes
                const snapshot = await getDocs(q);

                const quotes = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setLikedQuotes(quotes);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching liked quotes:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLikedQuotes();
    }, [user]);

    const handleHomeNavigation = () => {
        try {
            navigation.replace('Home');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.HomeButton} onPress={handleHomeNavigation}>
                <Text style={styles.HomeButtonText}>Home</Text>
            </TouchableOpacity>
            <View style={{ height: 20 }} />

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : likedQuotes.length === 0 ? (
                <Text style={styles.noQuotes}>No liked quotes found.</Text>
            ) : (
                likedQuotes
                    .sort((a, b) => b.Timestamp - a.Timestamp) // Sort quotes by timestamp in descending order
                    .map((quote) => (
                        <View key={quote.id} style={styles.quoteContainer}>
                            <Text style={styles.quoteText}>"{quote.quote}"</Text>
                            <Text style={styles.author}>- {quote.author}</Text>
                        </View>
                    ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
        padding: 20,
        alignItems: "center",
    },
    HomeButton: {
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: "transparent",
        padding: 5,
    },
    HomeButtonText: {
        color: "#007AFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        marginTop: 20,
    },
    error: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
        marginTop: 10,
    },
    noQuotes: {
        fontSize: 16,
        color: "gray",
        textAlign: "center",
        marginTop: 20,
    },
    quoteContainer: {
        backgroundColor: "#f9f9f9",
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        width: "100%",
    },
    quoteText: {
        fontSize: 18,
        fontStyle: "italic",
        textAlign: "center",
    },
    author: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 5,
        color: "gray",
    },
});

export default LikedQuotesPage;
