import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

//IMPORT AXIOS PARA HACER PETICIONES A LA BASE DE DATOS
import axios from "axios";

//IMPORT URL
import { url } from "../src/helpers/url";

//IMPORTS VALIDACIONES Y ALERTAS
import { validateEmail, validatePassword } from "../src/helpers/validaciones";
import SinConexion from "../src/components/components--/sinConexion";

const RegistroUnico = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [showSinConexion, setShowSinConexion] = useState(false);

  //MOSTRAR CONTRASEÑA
  const viewPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  //ALERTA
  const nextAlert = () => {
    Alert.alert(
      "Muy bien!",
      "Administrador Registrado.",
      [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("Login");
            setEmail("");
            setName("");
            setPassword("");
          },
          style: "default",
        },
      ],
      { cancelable: false }
    );
  };
  
  //FUNCION PARA ENVIAR DATOS AL END POINT EN EL SERVER
  const handleRegisterAdmin = async () => {
    setIsLoading(true);
    try {
      if (!name) {
        Alert.alert("Obligatorio", "El nombre es Requerido.", [
          { text: "Vale" },
        ]);
        return;
      }

      if (!email) {
        Alert.alert("Obligatorio", "El email es Requerido.", [
          { text: "Vale" },
        ]);
        return;
      }

      if (!password) {
        Alert.alert("Obligatorio", "La contraseña es Requerida.", [
          { text: "Vale" },
        ]);
        return;
      }

      if (!validateEmail(email)) {
        Alert.alert("Error", "El correo no es válido Formato Incorrecto.");
        return;
      }

      if (!validatePassword(password)) {
        Alert.alert(
          "Contraseña inválida",
          "¡Tu contraseña no cumple con los requisitos, Debe Contener 8 Caracteres y 1 Mayuscula!",
          [{ text: "OK" }]
        );
        return;
      }

      const response = await axios.post(`${url}/registerAdmin`, {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        nextAlert(); // Muestra alerta de registro exitoso o realiza otras acciones
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          Alert.alert("Error", "Este correo ya está registrado.");
        } else if (error.response.status === 401) {
          Alert.alert("Error", "Datos Incorrectos");
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
      <View style={styles.contentTittle}>
        <Text style={styles.contentTittleText}>
          Bienvenid
          <Text
            style={{
              color: "#000",
              fontSize: 42,
              fontWeight: "700",
              fontStyle: "italic",
            }}
          >
            o
          </Text>
        </Text>
        <Text style={styles.contentTittleText}>
          <Text style={{ fontSize: 36, textAlign: "center", color: "#fad105" }}>
            Registrate Aqui
          </Text>
        </Text>
      </View>

      <View style={styles.cardLogin}>
        <View style={styles.boxText}>
          <TextInput
            style={styles.boxInput}
            placeholder="correo@correo.com"
            value={email.toLocaleLowerCase()}
            onChangeText={(email) => {
              setEmail(email);
            }}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.boxText}>
          <TextInput
            style={styles.boxInput}
            placeholder="nombre"
            value={name}
            onChangeText={(name) => setName(name)}
          />
        </View>
        <View style={styles.boxText_Password}>
          <TextInput
            style={styles.boxInput_Password}
            placeholder="contraseña"
            value={password}
            onChangeText={(password) => {
              setPassword(password);
            }}
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
            onPress={handleRegisterAdmin}
          >
            <Text style={styles.textButton}>Registrarme</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.linkRegistro}
          onPress={() => {navigation.navigate("Login")
            setEmail("");
            setPassword("");
            setName("");
          }}
        >
          <Text style={styles.linkRegistroText}>Login</Text>
        </TouchableOpacity>
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
  cardLogin: {
    marginTop: 40,
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
  contentTittle: {
    marginTop: 125,
  },
  contentTittleText: {
    fontSize: 40,
    fontWeight: "700",
    textAlign: "center",
    fontStyle: "italic",
  },
  boxText: {
    paddingVertical: 20,
    backgroundColor: "#cccccc30",
    borderRadius: 30,
    marginVertical: 10,
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
  boxInput: {
    paddingHorizontal: 15,
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
  },
  linkRegistro: {
    marginTop: 20,
    alignItems: "center",
  },
  linkRegistroText: {
    fontSize: 14,
    color: "#ccc",
    textTransform: "uppercase",
    textDecorationLine: "underline",
  },
});

export default RegistroUnico;
