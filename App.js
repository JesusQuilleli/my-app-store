import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  StatusBar
} from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MyStack from "./src/components/navigation/appNavigation";


 // TouchableWithoutFeedback -> USAR GESTOS EN LA APLICACION
  // KeyboardAvoidingView -> RENDERIZAR MEJOR EL TECLADO

export default function App() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <StatusBar backgroundColor='#000'/>
        <SafeAreaView style={styles.safeArea}>
          <NavigationContainer>
            <MyStack />
          </NavigationContainer>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
