import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

//URL
import { url } from "../src/helpers/url";

//IMPORTS VALIDACIONES Y ALERTAS
import { validateEmail } from "../src/helpers/validaciones";

//GUARDAR EL ID DE MANERA LOCAL PARA USARLO DESPUES
import AsyncStorage from "@react-native-async-storage/async-storage";

//SIN CONEXION
import SinConexion from "../src/components/components--/sinConexion";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showSinConexion, setShowSinConexion] = useState(false);

  //MOSTRAR CONTRASEÑA
  const viewPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleIniciarSesion = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Error", "Todos los campos son obligatorios", [
          { text: "OK" },
        ]);
        return;
      }

      if (!validateEmail(email)) {
        Alert.alert("Error", "El correo no tiene un formato válido.");
        return;
      }

      setIsLoading(true);

      const respuesta = await axios.post(`${url}/autenticacionInicio`, {
        email,
        password,
      });

      const { resultado } = respuesta.data;
      if (resultado) {
        await AsyncStorage.setItem("adminId", resultado.idAdmin.toString());
        await AsyncStorage.setItem("adminNombre", resultado.nombre);

        navigation.navigate("HomeDrawer");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          Alert.alert("Error", "Email o Contraseña Incorrectos");
        } else if (error.response.status === 500) {
          Alert.alert(
            "Error",
            "Hubo un problema en el servidor. Por favor, intenta más tarde."
          );
        }
      } else {
        // Muestra el componente SinConexion si el error no tiene respuesta del servidor
        setShowSinConexion(true);
        setTimeout(() => setShowSinConexion(false), 3000); // Ocultar después de 3 segundos
      }
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <View style={styles.container}>

      <View>
        <Image
          source={require("../assets/resources/perfil.webp")}
          style={styles.imagenProfile}
        />
        <Text style={styles.titulo}>
          Iniciar <Text style={styles.tituloBold}>Sesión</Text>
        </Text>
      </View>
      <View style={styles.cardLogin}>
        <View style={styles.boxText}>
          <TextInput
            placeholder="email@email.com"
            style={styles.boxInput}
            value={email}
            onChangeText={(email) => setEmail(email.toLowerCase())}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.boxText_Password}>
          <TextInput
            style={styles.boxInput_Password}
            placeholder="Contraseña"
            value={password}
            onChangeText={(password) => setPassword(password)}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity onPress={viewPassword} style={styles.eyeIcon}>
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.containerButton}>
          <TouchableOpacity
            style={styles.boxButton}
            onPress={handleIniciarSesion}
          >
            <Text style={styles.textButton}>Acceder</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkRegistro}
            onPress={() => navigation.navigate("RegistroUnico")}
          >
            <Text style={styles.linkRegistroText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showSinConexion && <SinConexion />}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  imagenProfile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "#000",
    borderWidth: 1,
    margin: "auto",
    marginTop: 125,
  },
  titulo: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: 20,
  },
  tituloBold: {
    fontWeight: "900",
    color: "#fee03e",
  },
  cardLogin: {
    marginTop: 30,
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
  boxText: {
    paddingVertical: 20,
    backgroundColor: "#cccccc30",
    borderRadius: 30,
    marginVertical: 10,
  },
  boxInput: {
    paddingHorizontal: 15,
  },
  boxText_Password: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#cccccc30",
    borderRadius: 30,
    marginVertical: 10,
  },
  boxInput_Password: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 15,
  },
  eyeIcon: {
    padding: 10,
  },
  containerButton: {
    alignItems: "center",
  },
  boxButton: {
    backgroundColor: "#fee03e",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginTop: 20,
    width: "80%",
  },
  textButton: {
    color: "#000",
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 6,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  linkRegistro: {
    marginTop: 20,
  },
  linkRegistroText: {
    fontSize: 14,
    color: "#ccc",
    textTransform: "uppercase",
    letterSpacing: 5,
    textDecorationLine:'underline'
  },
});

export default Login;
