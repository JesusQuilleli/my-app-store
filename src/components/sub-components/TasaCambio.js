import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import axios from "axios";
import { url } from "./../../helpers/url.js";

//ALMACENAMIENTO LOCAL
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";

const TasaCambio = () => {
  const [verTasas, setVerTasas] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [moneda, setMoneda] = useState("BOLIVARES");
  const [tasa, setTasa] = useState("");
  const [tasaAnterior, setTasaAnterior] = useState(null);

  const cargarTasaUnica = async () => {
    setIsLoading(true);
    const adminId = await AsyncStorage.getItem("adminId");
    try {
      const response = await axios.get(`${url}/verTasa/${adminId}`);
      setVerTasas(response.data.data); // Guarda la tasa única en el estado
    } catch (error) {
      console.error("Error al cargar la tasa de cambio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const insertarOActualizarTasa = async () => {
    setIsLoading(true);
    const adminId = await AsyncStorage.getItem("adminId");
    try {
      await axios.post(`${url}/insertarOActualizarTasa`, {
        moneda,
        tasa: parseFloat(tasa), // Asegúrate de usar el estado actualizado de `tasa`
        adminId,
      });
      await cargarTasaUnica();
      Alert.alert(
        "Muy Bien", // Título del alert
        "Tasa cargada.", // Mensaje
        [{ text: "Vale" }]
      );
    } catch (error) {
      console.error("Error al procesar la tasa de cambio:", error);
    } finally {
      setIsLoading(false);
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

  const cargarTasaBCV = async () => {
    setIsLoading(true); // Muestra un indicador de carga

    try {
      const response = await axios.get(
        `https://pydolarve.org/api/v1/dollar?page=bcv`
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const dolarBCV = response.data.monitors.usd;

      setTasa(dolarBCV.price.toString()); // Actualiza el estado de la tasa

    } catch (error) {
      console.error("Error al obtener la tasa BCV", error);
    } finally {
      setIsLoading(false); // Oculta el indicador de carga
    }
  };

  const handleTasaBCV = async () => {

    try {
      await cargarTasaBCV();
 
      Alert.alert(
        "Exito", // Título del alert
        "Tasa Obtenida correctamente!", // Mensaje
        [{ text: "Vale" }]
      );
    } catch (error) {
      // Mostrar un mensaje en caso de error
      Alert.alert(
        "Error", // Título del alert
        "Tasa no sincronizada.", // Mensaje
        [{ text: "Vale" }]
      );
    }
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
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(242, 243, 244, 0.8)",
            zIndex: 1000,
          }}
        >
          <ActivityIndicator
            size="large"
            color="#fee03e"
            style={{ transform: [{ scale: 2 }] }}
          />
        </View>
      )}
      <Text style={[styles.titulo, {marginBottom: 20}]}>Tasa Usada</Text>
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
                : "0"}
            </Text>
          </View>
          <View style={styles.ItemContent}>
            <Text style={styles.label}>Pesos</Text>
            <Text style={styles.valor}>
              {verTasas.find((tasa) => tasa.MONEDA === "PESOS")
                ? parseFloat(
                    verTasas.find((tasa) => tasa.MONEDA === "PESOS").TASA
                  ).toFixed(0)
                : "0"}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.titulo, { marginBottom: 20 }]}>Ingresar Tasa</Text>

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
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            placeholder="Ingresa el valor de la Tasa"
            value={tasa}
            onChangeText={(value) => {
              setTasa(value);
            }}
          />
        </View>
      </View>

      <View style={{width:'100%',flexDirection:'row',alignItems:'center', justifyContent:'space-evenly', marginTop: 26}}>
      <TouchableOpacity onPress={procesarTasa} style={styles.BtnTasa}>
        {verTasas.length > 0 ? (
          <Text style={styles.BtnTasaText}>Cargar Tasa</Text>
        ) : (
          <Text style={styles.BtnTasaText}>Guardar</Text>
        )}
      </TouchableOpacity>

      {moneda !== 'PESOS' && (<TouchableOpacity
        onPress={handleTasaBCV}
        style={styles.BtnTasaBCV}
      >
        <Text style={styles.BtnTasaBCVText}>Obtener Tasa BCV</Text>
      </TouchableOpacity>)}
      </View>

      
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
    marginTop: 20,
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
    backgroundColor: "#888",
    padding: 15,
    borderRadius: 12,
  },
  BtnTasaBCV: {
    backgroundColor: "maroon",
    padding: 15,
    borderRadius: 12,
  },
  BtnTasaBCVText: {
    fontSize: 17,
    fontWeight: "900",
    textTransform: "uppercase",
    color: "#FFF",
  },
  BtnTasaText: {
    fontSize: 17,
    fontWeight: "900",
    textTransform: "uppercase",
    color: "#FFF",
  },
  input: {
    textAlign: "center",
    fontWeight: "900",
    width: "100%",
    fontSize: 20,
    marginVertical: 20
  },
});
