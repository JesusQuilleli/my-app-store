import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

import axios from "axios";
import { url } from "./../../helpers/url.js";

//ALMACENAMIENTO LOCAL
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";

const TasaCambio = () => {
  const [verTasas, setVerTasas] = useState([]);
  const [moneda, setMoneda] = useState("BOLIVARES");
  const [tasa, setTasa] = useState(0);
  const [tasaAnterior, setTasaAnterior] = useState(null); // Estado para almacenar la tasa anterior

  const cargarTasaUnica = async () => {
    const adminId = await AsyncStorage.getItem("adminId");
    try {
      const response = await axios.get(`${url}/verTasa/${adminId}`);
      console.log("Tasa de cambio:", response.data.data);
      setVerTasas(response.data.data); // Guarda la tasa única en el estado
    } catch (error) {
      console.error("Error al cargar la tasa de cambio:", error);
    }
  };

  const insertarOActualizarTasa = async () => {
    const adminId = await AsyncStorage.getItem("adminId");
    try {
      const response = await axios.post(`${url}/insertarOActualizarTasa`, {
        moneda,
        tasa,
        adminId,
      });
      console.log("Tasa de cambio procesada:", response.data.message);
      await cargarTasaUnica(); // Carga la tasa para ver el cambio
    } catch (error) {
      console.error("Error al procesar la tasa de cambio:", error);
    }
  };

  const handleTipoMoneda = (tipo) => {
    setMoneda(tipo);
  };

  const procesarTasa = async () => {
    if (!tasa) {
      Alert.alert("Obligatorio", "La Tasa es Requerida", [{ text: "Vale" }]);
      return;
    }

    if (tasa < 0) {
      Alert.alert("Obligatorio", "Tasa Invalida. invalido.", [
        { text: "Vale" },
      ]);
      return;
    }

    if (tasa.includes(",") || tasa.includes(" ") || tasa.includes("-")) {
      Alert.alert(
        "Obligatorio",
        "No puede dejar espacios ni colocar una [ , ] ni colocar valores -"
      );
      return;
    }

    await insertarOActualizarTasa();

    setTasa(0);

  };

  useEffect(() => {
    // Solo recargar si hay un cambio en `verTasas`
    if (JSON.stringify(verTasas) !== JSON.stringify(tasaAnterior)) {
      cargarTasaUnica();
      setTasaAnterior(verTasas); // Actualiza la tasa anterior para futuras comparaciones
    }
  }, [verTasas]);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tasa Usada</Text>
      <View style={styles.padreContent}>
        <View style={styles.content}>
          <View style={styles.ItemContent}>
            <Text style={styles.label}>Dolar</Text>
            <Text style={styles.valor}>1</Text>
          </View>
          <View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: "#334155",
              }}
            >
              =
            </Text>
          </View>
          <View style={styles.ItemContent}>
            <Text style={styles.label}>Bolivares</Text>
            <Text style={styles.valor}>
              {verTasas.find((tasa) => tasa.MONEDA === "BOLIVARES")
                ? parseFloat(
                    verTasas.find((tasa) => tasa.MONEDA === "BOLIVARES").TASA
                  ).toFixed(2)
                : "No disponible"}
            </Text>
          </View>
          <View style={styles.ItemContent}>
            <Text style={styles.label}>Pesos</Text>
            <Text style={styles.valor}>
              {verTasas.find((tasa) => tasa.MONEDA === "PESOS")
                ? parseFloat(
                    verTasas.find((tasa) => tasa.MONEDA === "PESOS").TASA
                  ).toFixed(0)
                : "No disponible"}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.titulo}>Cargar Tasa</Text>

      <View style={[styles.padreContent]}>
        <View style={styles.content}>
          <View style={styles.ItemContent}>
            <Text style={styles.label}>Dolar</Text>
            <Text style={styles.valor}>1</Text>
          </View>
          <View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: "#334155",
              }}
            >
              =
            </Text>
          </View>
          <View style={styles.ItemContent}>
            <Text>Bolivares</Text>
            <Checkbox
              value={moneda === "BOLIVARES"}
              onValueChange={() => handleTipoMoneda("BOLIVARES")}
            />
          </View>

          <View style={styles.ItemContent}>
            <Text>Pesos</Text>
            <Checkbox
              value={moneda === "PESOS"}
              onValueChange={() => handleTipoMoneda("PESOS")}
            />
          </View>
        </View>
        <View
          style={{
            alignItems: "center",
            marginTop: 5,
            borderTopColor: "#000",
            borderTopWidth: 1,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "800" }}>
            Ingresa el valor de la Tasa
          </Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            placeholder="Escribe el Valor Ejemplo: 100"
            value={tasa}
            onChangeText={(value) => {
              setTasa(value);
            }}
          />
        </View>
      </View>

      <TouchableOpacity onPress={procesarTasa} style={styles.BtnTasa}>
        {verTasas.length > 0 ? (
          <Text style={styles.BtnTasaText}>Actualizar</Text>
        ) : (
          <Text style={styles.BtnTasaText}>Guardar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TasaCambio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  titulo: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 20,
  },
  padreContent: {
    width: "80%",
    backgroundColor: "#fff",
    marginHorizontal: 30,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  ItemContent: {
    alignItems: "center",
  },
  label: {
    textTransform: "uppercase",
    color: "#374145",
    fontWeight: "600",
    fontSize: 12,
  },
  valor: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#334155",
  },
  BtnTasa: {
    marginTop: 30,
    backgroundColor: "#888",
    padding: 15,
    borderRadius: 12,
  },
  BtnTasaText: {
    fontSize: 28,
    fontWeight: "900",
    textTransform: "uppercase",
    color: "#FFF",
  },
  input: {
    textAlign: "center",
    fontWeight: "900",
    width: "100%",
  },
});
