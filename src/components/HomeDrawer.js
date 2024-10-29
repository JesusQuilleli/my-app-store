import React, { useState, useEffect } from "react";
import { View, Alert, Image, Text, BackHandler } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

import Home from "../../screens/Home";
import Monetario from "./sub-components/Monetario";

import { formatearFecha } from "../helpers/validaciones";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {

  const { navigation } = props;
  const fechaActual = Date();
  const [nombreAdmin, setNombreAdmin] = useState("");

  // Obtener los detalles del administrador desde AsyncStorage
  useEffect(() => {
    const getAdminDetails = async () => {
      const nombre = await AsyncStorage.getItem("adminNombre");
      setNombreAdmin(nombre || "Nombre Administrador");
    };
    getAdminDetails();
  }, []);

  //USE PARA ESTAR ATENTO SI DESEA SALIR DE LA APLICACION
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Cerrar Sesión",
        "¿Estás seguro de que deseas cerrar sesión y salir de la aplicación?",
        [
          {
            text: "Cancelar",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "Cerrar Sesión",
            onPress: () => {
              AsyncStorage.clear(); // Limpia el almacenamiento
              navigation.navigate("Login"); // Navega al Login
            },
            style: "destructive",
          },
        ],
        { cancelable: true }
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      {/* Encabezado del Drawer con imagen y datos del usuario */}
      <View
        style={{
          padding: 20,
          backgroundColor: "#fff",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
        }}
      >
        <Image
          source={require("../../assets/resources/imagenPrueba.jpg")} // Cambia la ruta a la imagen que desees
          style={{ width: 120, height: 120, borderRadius: 40 }}
        />
        <Text style={{ marginTop: 10, fontWeight: "bold", fontSize: 18 }}>
          <Text style={{ color: "#fee03e" }}>Bienvenid@ </Text>
          {nombreAdmin}
        </Text>
        <Text style={{marginTop: 10, fontWeight: "bold", fontSize: 18, textAlign:'center'}}><Text style={{fontSize: 16, textAlign:'center'}}>{formatearFecha(fechaActual)}</Text></Text>
      </View>

      {/* Renderiza los elementos predeterminados del Drawer */}
      <DrawerItemList {...props} />

      {/* Botón de Cerrar Sesión */}
      <DrawerItem
        label="Cerrar Sesión"
        labelStyle={{
          color: "#e70000",
          fontWeight: "bold",
          letterSpacing: 2,
          fontSize: 15,
        }}
        icon={() => (
          <Entypo name="log-out" size={26} color="#888" />
        )}
        onPress={() => {
            props.navigation.closeDrawer();
            Alert.alert(
              "Cerrar Sesión",
              "¿Estás seguro de que deseas cerrar sesión?",
              [
                {
                  text: "Cancelar",
                  style: "cancel",
                },
                {
                  text: "Cerrar Sesión",
                  onPress: () => {
                    AsyncStorage.clear();
                    props.navigation.navigate("Login");
                  },
                  style: "destructive",
                },
              ],
              { cancelable: true }
            );
        }}
      />
    </DrawerContentScrollView>
  );
}

export default function HomeDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#fff",
          padding: 15,
          elevation: 5,
          shadowColor: "#000",
          fontSize: 16,
          color: "#333", // Cambia el color del texto de todos los ítems
          fontWeight: "bold",
        },
        headerTintColor: "#000",
        headerStyle: { backgroundColor: "#fee03e" },
        headerTitleAlign: "center",
        drawerActiveTintColor: "#fee03e", // Color de texto y fondo del ítem activo
        drawerInactiveTintColor: "#888", // Color de texto del ítem inactivo
        drawerActiveBackgroundColor: "#f1f1f1", // Fondo del ítem activo
        drawerStyle: {
          backgroundColor: "#fff", // Fondo del Drawer
          padding: 15,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          title: "Resumen",
          headerTitleAlign: "center", // Centra el título en el header
          drawerIcon: ({ focused }) => (
            <Entypo
              name="home"
              size={24}
              color={focused ? "#fee03e" : "#888"}
            />
          ),
          drawerLabelStyle: {
            marginLeft: -10, // Ajusta la distancia entre el ícono y el título
            fontSize: 16,
            color: "#333",
            fontWeight: "bold",
          },
          headerTitle: "", // Si no quieres texto en el header
        }}
      />
      <Drawer.Screen
        name="Monetario"
        component={Monetario}
        options={{
          title: "Tasa de Cambio",
          headerTitleAlign: "center", // Centra el título en el header
          drawerIcon: ({ focused }) => (
            <FontAwesome5
              name="money-bill"
              size={24}
              color={focused ? "#fee03e" : "#888"}
            />
          ),
          drawerLabelStyle: {
            marginLeft: -10, // Ajusta la distancia entre el ícono y el título
            fontSize: 16,
            color: "#333",
            fontWeight: "bold",
          },
          headerTitle: "", // Si no quieres texto en el header
        }}
      />
    </Drawer.Navigator>
  );
}
