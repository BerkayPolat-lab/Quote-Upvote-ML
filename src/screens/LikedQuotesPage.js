import { useEffect } from 'react';
import {ScrollView, Text, StyleSheet, TouchableOpacity} from 'react-native';


const LikedQuotesPage = ({navigation}) => {

    const handleHomeNavigation = () => {
        try {
            navigation.replace('Home'); // Navigate to the Home screen
        } catch (error) {
            setError(error.message);    
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.HomeButton} onPress={handleHomeNavigation}>
                <Text style={styles.HomeButtonText}>Home</Text>
            </TouchableOpacity>
            <Text style={styles.title}> Liked Quotes</Text>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    HomeButton: {
        position: 'absolute', // Position in the top-left corner
        top: 10,
        left: 10,
        backgroundColor: 'transparent', // Transparent background
        padding: 5,
    },
    HomeButtonText: {
        color: '#007AFF', // Blue color (similar to iOS default)
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', marginTop: 20},
});

export default LikedQuotesPage;