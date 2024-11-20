import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert, ActivityIndicator} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import InfoCard from "./../../components/components--/card.js";

const PagoMovil = () => {
  const [pagoMovil, setPagoMovil] = useState(null);

  const [adminId, setAdminId] = useState("");
  const [cedula, setCedula] = useState("");
  const [banco, setBanco] = useState("");
  const [telefonoPago, setTelefonoPago] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const cargarPagoMovil = async () => {
    setIsLoading(true);
    try {
      // Obtener el adminId
      const id = await AsyncStorage.getItem("adminId");
      if (id) {
        setAdminId(id);

        // Obtener los datos del Pago Móvil
        const pagoMovilGuardado = await AsyncStorage.getItem(
          `adminPagoMovil_${id}`
        );
        if (pagoMovilGuardado) {
          setPagoMovil(JSON.parse(pagoMovilGuardado));
        }
      }
    } catch (error) {
      console.error("Error al cargar datos de Pago Móvil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const guardarPagoMovil = async () => {
    setIsLoading(true);
    if (!adminId) {
      Alert.alert("Error", "No se encontró el ID del administrador.");
      return;
    }

    if (!cedula) {
      Alert.alert("Error", "La Cedula es Requerida.");
      return;
    }

    if (!banco) {
      Alert.alert("Error", "El Banco es Requerido.");
      return;
    }

    if (!telefonoPago) {
      Alert.alert("Error", "El Telefono es Requerido.");
      return;
    }

    try {
      // Verificar si ya existe un Pago Móvil registrado
      const pagoMovilExistente = await AsyncStorage.getItem(
        `adminPagoMovil_${adminId}`
      );
      if (pagoMovilExistente) {
        Alert.alert(
          "Aviso",
          "Ya existe un Pago Móvil registrado. Elimina el existente para registrar uno nuevo."
        );
        return; // Salir si ya hay un Pago Móvil registrado
      }

      // Guardar el nuevo Pago Móvil
      const pagoMovil = { cedula, banco, telefonoPago };
      await AsyncStorage.setItem(
        `adminPagoMovil_${adminId}`,
        JSON.stringify(pagoMovil)
      );

      Alert.alert("Éxito", "Datos de Pago Móvil guardados correctamente.");
      setCedula("");
      setBanco("");
      setTelefonoPago("");

      // Cargar nuevamente los datos
      await cargarPagoMovil();
    } catch (error) {
      console.error("Error al guardar Pago Móvil:", error);
      Alert.alert("Error", "No se pudo guardar el Pago Móvil.");
    } finally{
      setIsLoading(false);
    }
  };

  const eliminarPagoMovil = async () => {
    setIsLoading(true);
    try {
      if (!adminId) {
        Alert.alert(
          "Error",
          "No se encontró un adminId para eliminar los datos."
        );
        return;
      }

      // Elimina los datos
      await AsyncStorage.removeItem(`adminPagoMovil_${adminId}`);

      // Verifica si los datos aún existen
      const datosEliminados = await AsyncStorage.getItem(
        `adminPagoMovil_${adminId}`
      );
      if (!datosEliminados) {
        setPagoMovil(null); // Actualiza el estado
        Alert.alert(
          "Éxito",
          "Los datos del Pago Móvil se eliminaron correctamente."
        );
      } else {
        Alert.alert(
          "Error",
          "No se pudieron eliminar los datos del Pago Móvil."
        );
      }
    } catch (error) {
      console.error("Error al eliminar los datos del Pago Móvil:", error);
      Alert.alert("Error", "Ocurrió un error al intentar eliminar los datos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarPagoMovil();
  }, []);

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
      <InfoCard title="Configurar Pago Movil" />
      <TextInput
        style={styles.input}
        placeholder="Cédula"
        value={cedula}
        onChangeText={setCedula}
        keyboardType="numeric"
        maxLength={10}
      />
      <TextInput
        style={styles.input}
        placeholder="Banco"
        value={banco}
        onChangeText={setBanco}
        maxLength={25}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono de Pago"
        value={telefonoPago}
        onChangeText={setTelefonoPago}
        keyboardType="numeric"
        maxLength={15}
      />
      <View style={{ marginVertical: 10 }}>
        <Button title="Guardar" color="green" onPress={guardarPagoMovil} />
      </View>

      <View style={{ alignItems: "center" }}>
        <InfoCard title="Pago Movil en uso" />

        <Text style={styles.defecto}>
          Cedula: {pagoMovil ? pagoMovil.cedula : "No disponible"}
        </Text>
        <Text style={styles.defecto}>
          Banco: {pagoMovil ? pagoMovil.banco : "No disponible"}
        </Text>
        <Text style={styles.defecto}>
          Teléfono: {pagoMovil ? pagoMovil.telefonoPago : "No disponible"}
        </Text>
      </View>

      {pagoMovil && (
        <View style={{ marginTop: 10 }}>
          <Button title="Eliminar" color="maroon" onPress={eliminarPagoMovil} />
        </View>
      )}
    </View>
  );
};

export default PagoMovil;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  input: {
    width: "50%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 24,
    padding: 10,
    marginBottom: 10,
  },
  defecto: {
    fontSize: 20,
    textTransform: "uppercase",
    fontWeight: "800",
    marginVertical: 5,
  },
});
