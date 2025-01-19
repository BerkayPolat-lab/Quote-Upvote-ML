import React, { useContext } from "react";
import { AuthProvider, AuthContext } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, View, StyleSheet } from "react-native";

const AppContent = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <AppNavigator />;
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
