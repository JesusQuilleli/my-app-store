//IMPORTS REACT Y REACT - NATIVE
import { View, ActivityIndicator } from "react-native";
import React, { useContext } from "react";

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
              title: "INICIAR SESION",
              headerTintColor: "#000",
              headerTitleAlign: "center",
              headerStyle: { backgroundColor: "#fee03e" },
              headerLeft: () => null,
            }}
          />
        
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }}
          />
        

        <Stack.Screen name="HomeDrawer" component={HomeDrawer} options={{headerShown: false}}/>

        <Stack.Screen
          name="RegistroUnico"
          component={RegistroUnico}
          options={{
            title: "REGISTRO ADMINISTRADOR",
            headerTintColor: "#000",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#fee03e" },
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
  );
}
