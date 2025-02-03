import React, { useState, useContext } from "react";
import {
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Modal,
  View,
} from "react-native";
import {SafeAreaView} from 'react-native-safe-area-context';
import { AuthContext } from "../context/AuthContext";
import  GoogleIcon from "../icons/googleIcon";

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
        <TouchableOpacity style={styles.buttonContainer} onPress={() => setModalVisible(true)}>
          <Text style={styles.googleText}> Continue with </Text>
          <GoogleIcon style={styles.googleIcon} />
        </TouchableOpacity>

        <Modal
        animationType="fade" // Options: 'none', 'slide', 'fade'
        transparent={true} // Allows background transparency
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} 
      >
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.popupText}> Google Sign-in Window </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  buttonContainer: {borderWidth: 3, flexDirection: "row", borderColor: "#e3e1e1", borderRadius: 8, justifyContent: "center", padding: 15, margin: 20, backgroundColor: "#FFF"},
  googleIcon: { alignSelf: "flex-start"},
  googleText: { fontWeight: "bold", fontSize: 14, color: "#000", alignSelf: "center"},
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#FFF" },
  inputTitle: { fontsize: 18, fontweight: "bold", marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 8 },
  error: { color: "red", marginBottom: 10 },
  link: { color: "blue", marginTop: 15, textAlign: "center" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: 300,
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  popupText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LoginScreen;
