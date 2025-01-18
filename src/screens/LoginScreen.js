import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        try {
            await login(email, password);
            navigation.replace('Home'); // Navigate to the main app after login
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <Button title="Login" onPress={handleLogin} />
            <Text onPress={() => navigation.navigate('Register')} style={styles.link}>
                Don't have an account? Register
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { borderBottomWidth: 1, marginBottom: 15, padding: 8 },
    error: { color: 'red', marginBottom: 10 },
    link: { color: 'blue', marginTop: 15, textAlign: 'center' },
});

export default LoginScreen;
