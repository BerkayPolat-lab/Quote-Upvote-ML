import React, { useState, useContext } from "react";
import {
  Text,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import {SafeAreaView} from 'react-native-safe-area-context';
import { AuthContext } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }
  
    try {
      const user = await login(email, password);
      if (user) {
        navigation.replace("Home");
      }
    } catch (err) {
      setError("Invalid username/password"); // ✅ Display Firebase authentication error
    }
  };
  
  
  return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.inputTitle}> Email </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          autoFocus = {true}
        />
        <Text style={styles.inputTitle}> Password </Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          autoCapitalize="none"
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <Button title="Login" onPress={handleLogin} />
        <Text onPress={() => navigation.navigate("Register")} style={styles.link}>Don't have an account?  Register </Text>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  inputTitle: { fontsize: 18, fontweight: "bold", marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 8 },
  error: { color: "red", marginBottom: 10 },
  link: { color: "blue", marginTop: 15, textAlign: "center" },
});

export default LoginScreen;
