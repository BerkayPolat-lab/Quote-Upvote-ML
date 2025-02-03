import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { registerUser } from "../config/fireBaseConfig";
import Icon from "react-native-vector-icons/Feather"; // Import Feather icons

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword, confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    if (confirmPassword !== password) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await registerUser(email, password);
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => navigation.replace("Login") },
      ]);
    } catch (err) {
      setError(err.message);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={[styles.input, { flex: 1 }]}
                autoCapitalize="none"
              />
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                onPress={() => setShowPassword(!showPassword)}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                style={[styles.input, { flex: 1 }]}
              />
              <Icon
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
            <Button title="Register" onPress={handleRegister} />
            <Text
              onPress={() => navigation.navigate("Login")}
              style={styles.link}
            >
              Already have an account? Login
            </Text>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    padding: 8,
    borderColor: "#ccc",
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
  link: {
    color: "blue",
    marginTop: 20,
    textAlign: "center",
  },
});

export default RegisterScreen;
