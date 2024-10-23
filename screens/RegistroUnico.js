import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

//IMPORT AXIOS PARA HACER PETICIONES A LA BASE DE DATOS
import axios from "axios";

//IMPORT URL
import { url } from "../src/helpers/url";

//IMPORTS VALIDACIONES Y ALERTAS
import { validateEmail, validatePassword } from "../src/helpers/validaciones";

const RegistroUnico = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rolId, setRolId] = useState(1);


  //MOSTRAR CONTRASEÑA
  const viewPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  //ALERTA
  const nextAlert = () => {
    Alert.alert(
      "Muy bien!",
      "Administrador Principal Registrado Exitosamente.",
      [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("Login");
          },
          style: "default",
        },
      ],
      { cancelable: false }
    );
  };

  //FUNCION PARA ENVIAR DATOS AL END POINT EN EL SERVER
  const handleRegisterAdmin = async () => {
    try {
      if (!name || !email || !password) {
        Alert.alert(
          "Error",
          "Todos los campos son obligatorios",

          [
            {
              text: "OK",
            },
          ]
        );
        return;
      }

      if (!validateEmail(email)) {
        Alert.alert("Error", "El correo no es válido Formato Incorrecto.");
        return;
      }

      if (!validatePassword(password)) {
        Alert.alert(
          "Contraseña invalida",
          "¡Tu contraseña no cumple con los requisitos, Debe Contener 8 Caracteres y 1 Mayuscula!",
          [
            {
              text: "OK",
            },
          ]
        );
        return;
      }

      const response = await axios.post(
        `${url}/registerAdmin`,
        {
          name,
          email,
          password,
          rolId,
        }
      );
      if (response) {
        nextAlert();
      } else {
        console.error("Error al Registrar Datos");
      }
    } catch (error) {
      console.error("Error al registrar administrador:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentTittle}>
        <Text style={styles.contentTittleText}>Bienvenid<Text style={{color:'#000', fontSize: 42, fontWeight: '700', fontStyle:'italic'}}>o</Text></Text>
        <Text style={styles.contentTittleText}><Text style={{fontSize: 36, textAlign:'center', color:'#fad105'}}>Registrate Aqui</Text></Text>
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
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.linkRegistroText}>Login</Text>
            </TouchableOpacity>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
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
    marginTop: 125
  },
  contentTittleText: {
    fontSize: 40,
    fontWeight: "700",
    textAlign:'center',
    fontStyle:'italic',
    letterSpacing:4
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
    width:'80%'
  },
  textButton: {
    color: "#000",
    fontWeight: "600",
    fontSize: 20,
    textAlign:'center',
    letterSpacing: 6
  },
  linkRegistro: {
    marginTop: 20,
    alignItems:'center'
  },
  linkRegistroText: {
    fontSize: 14,
    color: "#ccc",
    textTransform: 'uppercase',
    letterSpacing: 5
  },
});

export default RegistroUnico;
