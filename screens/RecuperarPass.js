import React, { useState } from "react";

import { View, Text, StyleSheet, TextInput, Button, Alert, ActivityIndicator } from "react-native";

import axios from "axios";
import { url } from "./../src/helpers/url.js";

import { validateEmail, validatePassword } from "../src/helpers/validaciones.js";

const RecuperarPass = ({navigation}) => {
  const [email, setEmail] = useState("");

  const [codigo, setCodigo] = useState("");

  const [nuevaPassword, setNuevaPassword] = useState("");

  const [verNuevaPassword, setVerNuevaPassword] = useState(false);

  const [verValidar, setVerValidar] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
   return (
     <View
       style={{
         flex: 1,
         justifyContent: "center",
         alignItems: "center",
         backgroundColor: "#f2f3f4",
       }}
     >
       <ActivityIndicator
         size="large"
         color="#fee03e"
         style={{ transform: [{ scale: 2 }] }}
       />
     </View>
   );
 }

  const enviarCodigo = async () => {
   setIsLoading(true);
    try {

      if (!email) {
         Alert.alert("Error", "El correo es requerido.", [
           { text: "Vale" },
         ]);
         return;
       }

       if (!validateEmail(email)) {
         Alert.alert("Error", "El correo no tiene un formato válido.");
         return;
       }

      const response = await axios.post(`${url}/enviar-codigo`, {
        email, // El email que el usuario ingresó
      });

      Alert.alert(
        "Éxito",
        response.data.message || "Código enviado al correo electrónico."
      );
      setVerValidar(true);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.error ||
          "No se pudo enviar el código. Inténtalo nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const validarCodigo = async () => {
   setIsLoading(true);
    try {
      const response = await axios.post(`${url}/validar-codigo`, {
        email,
        codigo,
      });
      Alert.alert("Éxito", response.data.message);
      setVerNuevaPassword(true);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Error al validar el código"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const restablecerPassword = async () => {

   if (!validatePassword(nuevaPassword)) {
      Alert.alert(
        "Contraseña inválida",
        "¡Tu contraseña no cumple con los requisitos, Debe Contener 8 Caracteres y 1 Mayuscula!",
        [{ text: "Vale" }]
      );
      return;
    }

   setIsLoading(true);

   try {
     const response = await axios.post(`${url}/restablecer-password`, {
       email,           // El correo electrónico del usuario
       nuevaPassword,   // La nueva contraseña que el usuario quiere establecer
     });
     Alert.alert(
      "Éxito", 
      response.data.message, 
      [
        {
          text: "Aceptar",
          onPress: () => {
            // Redirigir al login
            navigation.navigate('Login');
          },
        },
      ],
      { cancelable: false } // Evita que el usuario cierre el Alert tocando fuera de él
    );
   } catch (error) {
     Alert.alert(
       "Error",
       error.response?.data?.error || "Error al restablecer la contraseña"
     );
   } finally {
      setIsLoading(false);
   }
 };

  return (
    <View style={styles.container}>
      {!verNuevaPassword && (
        <View style={styles.cardLogin}>
          <View>
            <Text style={styles.textInputs}>Correo</Text>

            <TextInput
              placeholder="ejemplo@gmail.com"
              value={email}
              onChangeText={(email) => setEmail(email.toLowerCase())}
              style={styles.inputs}
              editable={verValidar ? false : true}
              keyboardType='email-address'
            />
          </View>

          <View>

           {verValidar && (<View>
            <Text style={[styles.textInputs, { marginTop: 10 }]}>
              Codigo enviado al correo
            </Text>
            <TextInput
              style={styles.inputs}
              placeholder="002255"
              value={codigo}
              onChangeText={setCodigo}
              maxLength={6}
              keyboardType="numeric"
            />
            </View>)}

            {!verValidar ? (
              <View>
                <Button
                  title="Enviar Codigo"
                  onPress={enviarCodigo}
                  color="maroon"
                />
              </View>
            ) : (
              <View>
                <Button
                  title="Validar código"
                  onPress={validarCodigo}
                  color="maroon"
                />
              </View>
            )}
          </View>
        </View>
      )}

      {verNuevaPassword && (
        <View style={styles.cardLogin}>
          <TextInput
            placeholder="ejemplo@gmail.com"
            value={email}
            onChangeText={setEmail}
            style={styles.inputs}
            editable={verNuevaPassword ? false : true}
          />
          <Text style={styles.textInputs}>Nueva Contraseña</Text>
          <TextInput
            placeholder="Nueva contraseña"
            value={nuevaPassword}
            secureTextEntry
            onChangeText={setNuevaPassword}
            style={styles.inputs}
          />
          <Button
            title="Restablecer contraseña"
            onPress={restablecerPassword}
            color="green"
          />
        </View>
      )}
    </View>
  );
};

export default RecuperarPass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  cardLogin: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "90%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputs: {
    padding: 10,
    marginVertical: 15,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
  },
  textInputs: {
    fontSize: 22,
    fontWeight: "700",
  },
});
