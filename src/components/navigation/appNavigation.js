import React from 'react'
//IMPORTS RUTAS NECESARIAS
import Login from '../../../screens/Login'
import Welcome from "../../../screens/Welcome";
import RegistroUnico from "../../../screens/RegistroUnico";
import HomeDrawer from "../../../src/components/HomeDrawer";
import RecuperarPass from '../../../screens/RecuperarPass';

//IMPORTS PARA LA NAVEGACIÓN
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";

  export default function MyStack() {
   const Stack = createStackNavigator();
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

      <Stack.Screen
          name="RecuperarPass"
          component={RecuperarPass}
          options={{
            headerShown: true,
            title:"Recupera tu Contraseña",
            headerStyle: {
              backgroundColor: '#fee03e', // Color de fondo del header
            },
            headerTintColor: '#000', // Color del texto y los íconos
          }}
        />
      </Stack.Navigator>
    );
  }