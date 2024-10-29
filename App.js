//IMPORTS REACT Y REACT - NATIVE
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  StyleSheet
} from "react-native";
import React from "react";

//IMPORTS PARA LA NAVEGACIÓN
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

//IMPORTS RUTAS NECESARIAS
import Login from "./screens/Login";
import Welcome from "./screens/Welcome";
import RegistroUnico from "./screens/RegistroUnico";
import HomeDrawer from "./src/components/HomeDrawer";

export default function App() {
  const Stack = createStackNavigator();

  function MyStack() {
    return (
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="HomeDrawer"
          component={HomeDrawer}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="RegistroUnico"
          component={RegistroUnico}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  }
  // TouchableWithoutFeedback -> USAR GESTOS EN LA APLICACION
  // KeyboardAvoidingView -> RENDERIZAR MEJOR EL TECLADO
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
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
    backgroundColor: "#fff", // Opcional: color de fondo
  },
});
