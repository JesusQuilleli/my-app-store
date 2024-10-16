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

//IMPORT CONTEXTO API PARA CONSULTAR SI EXISTE UN ADMINISTRADOR => PARA PETICION DE VERIFICACION DE USUARIO
import { AdminContext, AdminProvider } from "./src/helpers/adminContext";

export default function App() {
  const Stack = createStackNavigator();

  function MyStack() {
    const { isLoading, adminExists } = useContext(AdminContext);

    if (isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator
            size="large"
            color="#fee03e"
            style={{ transform: [{ scale: 2 }] }}
          />
        </View>
      );
    }
    return (
      <Stack.Navigator>
        {adminExists ? (
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
        ) : (
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }}
          />
        )}

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
    <AdminProvider>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </AdminProvider>
  );
}
