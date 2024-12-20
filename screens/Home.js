import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { PagosProvider } from "../src/components/Context/pagosContext.js";

//COMPONENTES
import Clientes from "../src/components/Clientes.js";
import Productos from "../src/components/Productos.js";
import Ventas from "../src/components/Ventas.js";
import Resumen from "../src/components/Resumen.js";
import Pagos from "../src/components/Pagos.js";

const Tab = createBottomTabNavigator();

export default function Home() {
  return (
    <PagosProvider>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Resumen") {
            // Aquí usamos el ícono de MaterialCommunityIcons para "total"
            return (
              <MaterialCommunityIcons
                name={focused ? "finance" : "finance"}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Clientes") {
            iconName = focused ? "people" : "people-outline"; // Ionicons para Clientes
          } else if (route.name === "Productos") {
            iconName = focused ? "cart" : "cart-outline"; // Ionicons para Productos
          } else if (route.name === "Pedidos") {
            iconName = focused ? "clipboard" : "clipboard-outline"; // Ionicons para Pedidos
          } else if(route.name === "Ventas") {
            iconName = focused ? "receipt" : "receipt-outline";
          } else if(route.name === "Pagos") {
            iconName = focused ? "cash" : "cash-outline";
          }  

          // Devolvemos el ícono con Ionicons para las otras rutas
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#777", // Color del botón activo
        tabBarInactiveTintColor: "#000", // Color del botón inactivo
        tabBarStyle: {
          backgroundColor: "#fee03e", // Color de fondo de la barra
          paddingBottom: 10,
          paddingTop: 10,
          height: 80,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5, 
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIconStyle: {
          size: 24, // Tamaño de íconos
        },
      })}
    >
      <Tab.Screen
        name="Resumen"
        component={Resumen}
        options={{
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Clientes"
        component={Clientes}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Productos"
        component={Productos}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Ventas"
        component={Ventas}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Pagos"
        component={Pagos}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
    </PagosProvider>  
  );
}
