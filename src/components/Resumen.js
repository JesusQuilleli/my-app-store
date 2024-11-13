import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";

import axios from "axios";
import { url } from "../helpers/url.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { PagosContext } from "./Context/pagosContext.js";

import Pagos from "./Pagos";
import Deudores from "./Deudores";

const Resumen = () => {

  const {verPagos} = useContext(PagosContext);

  const [modalPagos, setModalPagos] = useState(false);
  const [modalDeudores, setModalDeudores] = useState(false);    

  return (
    <View style={styles.container}>

      <TouchableOpacity 
      style={styles.btn}
      onPress={() => {
        setModalPagos(true);
      }}
      >
        <Text style={{color:'#000', fontSize: 24}}>Pagos{' '}</Text>
        <Text style={styles.nro}>{verPagos.length}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={styles.btn}
      onPress={() => {
        setModalDeudores(true);
      }}
      >
        <Text style={{color:'#000', fontSize: 24}}>Deudores</Text>
        <Text style={styles.nro}>15</Text>
      </TouchableOpacity>

      <Modal visible={modalPagos} animationType="fade">
        <Pagos 
        setModalPagos={setModalPagos}
        verPagos={verPagos}
        />
      </Modal>

      <Modal visible={modalDeudores} animationType="fade">
        <Deudores/>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: '#f2f2f2'
  },
  btn: {
    backgroundColor: "#fff",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 20,
    padding: 20,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around'
  },
  nro:{
    fontSize: 30,
    fontWeight: '900'
  },
 
  tableVentas: {
    width: "90%",
    marginTop: 10,
    borderRadius: 25,
    overflow: "hidden",
    maxHeight: 250,
  },
  item: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomColor: "#000",
    borderBottomWidth: 0.2,
  },
  title: {
    fontSize: 18,
    color: '#fee03e',
    fontWeight: '600'
  },
  fecha:{
    fontSize: 14,
    fontWeight: '300'
  },
  monto: {
    fontSize: 14,
    fontWeight: '800'
  }
});

export default Resumen;
