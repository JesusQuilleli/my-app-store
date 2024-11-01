import React from 'react'
//IMPORTS RUTAS NECESARIAS
import Login from '../../../screens/Login'
import Welcome from "../../../screens/Welcome";
import RegistroUnico from "../../../screens/RegistroUnico";
import HomeDrawer from "../../../src/components/HomeDrawer";

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
      </Stack.Navigator>
    );
  }