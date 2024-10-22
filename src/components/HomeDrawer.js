import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Home from "../../screens/Home";
import Monetario from "./sub-components/Monetario";
import Administradores from "./sub-components/Administradores";

const Drawer = createDrawerNavigator();

//const adminNombre = await AsyncStorage.getItem('adminNombre'); -> PARA CONOCER QUE USUARIO ESTA EN LINEA

function CustomHeader() {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", paddingRight: 10 }}
    >
      <Image
        source={require("../../assets/resources/imagenPrueba.jpg")} // Cambia la ruta a la imagen que desees
        style={{ width: 40, height: 40, marginLeft: 10, borderRadius: 50 }} // Ajusta el tamaño según sea necesario
      />
    </View>

  );
}

//COLOCAR UN DRAWER CONTENT PARA AGREGAR EL BOTON CERRAR SESION EN EL DRAWER

function CerrarSesion({ navigation }) {
  <Pressable
  onPress={() => {
    console.log("Has cerrado Sesion");
  }}>
    <Text>Cerrar Sesion</Text>
  </Pressable>
}

export default function HomeDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#fff",
          padding: 15,
          elevation: 5,
          shadowColor: '#000'
        },
        headerTintColor: "#000",
        headerStyle: { backgroundColor: "#fee03e" },
        headerTitleAlign: "center",
        headerRight: () => <CustomHeader />,
      }}
      
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{ title: "Inicio", headerTitle: "Inv MG" }}
      />
      <Drawer.Screen name="Monetario" component={Monetario} options={{ title: "Gestionar Tasa", headerTitle: "Configuración Tasa" }} />
      <Drawer.Screen name="Administradores" component={Administradores} options={{ title: "Gestionar Administradores", headerTitle: "Configuración AD" }} />
    </Drawer.Navigator>
  );
}
