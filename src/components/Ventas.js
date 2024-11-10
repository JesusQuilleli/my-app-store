import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";

import FormularioVenta from "./sub-components/FormularioVenta.js";
import InformacionVenta from "./sub-components/InformacionVenta.js";

import axios from "axios";
import { url } from "../helpers/url.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { formatearFecha } from "../helpers/validaciones.js";

import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Picker } from "@react-native-picker/picker";

const Ventas = () => {
  //FORMULARIO VENTAS
  const [formVentas, setFormVentas] = useState(false);

  //CLIENTES Y PRODUCTOS
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  //VENTAS
  const [ventasResumidas, setVentasResumidas] = useState([]);
  const [ventasDetalladas, setVentasDetalladas] = useState([]);
  const [modalVentasDetalladas, setModalVentasDetalladas] = useState(false);

  //FECHAS
  const [verFecha, setVerFecha] = useState(false);
  const [fechaInicial, setFechaIncial] = useState(new Date());
  const [fechaFinal, setFechaFinal] = useState(new Date());
  const [botonLimpiarFecha, setBotonLimpiarFecha] = useState(false);

  //VER VENTAS POR ESTADO
  const [filtro, setFiltro] = useState("todas"); // Estado inicial en "todas"

  //TASAS
  const [verTasas, setVerTasas] = useState([]);

  const TasaBolivares = verTasas.find((tasa) => tasa.MONEDA === "BOLIVARES")
    ? parseFloat(
        verTasas.find((tasa) => tasa.MONEDA === "BOLIVARES").TASA
      ).toFixed(2)
    : "No disponible";

  const TasaPesos = verTasas.find((tasa) => tasa.MONEDA === "PESOS")
    ? parseFloat(verTasas.find((tasa) => tasa.MONEDA === "PESOS").TASA).toFixed(
        0
      )
    : "No disponible";


  //FUNCION CARGAR TASAS
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

  //FUNCION CARGAR CLIENTES
  const cargarClientes = async () => {
    try {
      const adminIdString = await AsyncStorage.getItem("adminId");
      if (adminIdString === null) {
        console.log("ID de administrador no encontrado.");
        return;
      }
      const adminId = parseInt(adminIdString, 10);
      if (isNaN(adminId)) {
        console.log("ID de administrador no es un número válido.");
        return;
      }

      const response = await axios.get(`${url}/cargarClientes/${adminId}`);
      const resultadoClientes = response.data.result;
      setClientes(resultadoClientes);
    } catch (error) {
      console.error("Ha ocurrido un error al cargar Clientes", error);
    }
  };

  //FUNCION CARGAR PRODUCTOS EN VENTAS
  const cargarProductos = async () => {
    try {
      const adminIdString = await AsyncStorage.getItem("adminId");
      if (adminIdString === null) {
        console.log("ID de administrador no encontrado.");
        return;
      }
      const adminId = parseInt(adminIdString, 10);
      if (isNaN(adminId)) {
        console.log("ID de administrador no es un número válido.");
        return;
      }
      const respuesta = await axios.get(`${url}/cargarProductos/${adminId}`);
      const resultadoProductos = respuesta.data.resultado;
      setProductos(resultadoProductos);
      //setProductoNoEncontrado(false);
    } catch (error) {
      console.log("Error al cargar Productos", error);
    }
  };

  //FUNCION CARGAR VENTAS
  const cargarVentas = async () => {
    try {
      const adminIdString = await AsyncStorage.getItem("adminId");
      if (adminIdString === null) {
        console.log("ID de administrador no encontrado.");
        return;
      }
      const adminId = parseInt(adminIdString, 10);
      if (isNaN(adminId)) {
        console.log("ID de administrador no es un número válido.");
        return;
      }
      const respuesta = await axios.get(`${url}/infoResum/${adminId}`);
      const resultadoVentasResumidas = respuesta.data.response;
      setVentasResumidas(resultadoVentasResumidas);
    } catch (error) {
      console.log("Error al cargar Ventas", error);
    }
  };

  //FUNCION OBTENER DETALLES EN VENTAS
  const cargarVentasDetalladas = async (ID_VENTA) => {
    try {
      const adminIdString = await AsyncStorage.getItem("adminId");
      if (adminIdString === null) {
        console.log("ID de administrador no encontrado.");
        return;
      }
      const adminId = parseInt(adminIdString, 10);
      if (isNaN(adminId)) {
        console.log("ID de administrador no es un número válido.");
        return;
      }

      // Agregar adminId e ID_VENTA en la URL
      const respuesta = await axios.get(
        `${url}/infoDetalle/${adminId}/${ID_VENTA}`
      );
      const resultadoVentasDetalladas = respuesta.data.response;
      setVentasDetalladas(resultadoVentasDetalladas[0]);
      await cargarTasaUnica();
    } catch (error) {
      console.log("Error al cargar Ventas", error);
    }
  };

  //CALL-BACK CERRAR FORMULARIO
  const closeForm = () => {
    setFormVentas(false);
  };

  //FUNCION SELECCIONAR FECHA INICIAL
  const showDatepickerInicial = () => {
    DateTimePickerAndroid.open({
      value: fechaInicial,
      onChange: (event, selectedDate) => {
        const currentDate = selectedDate || fechaInicial;
        setFechaIncial(currentDate); // Actualiza la fecha seleccionada
      },
      mode: "date",
      is24Hour: true,
    });
  };

  //FUNCION SELECCIONAR FECHA FINAL
  const showDatepickerFinal = () => {
    DateTimePickerAndroid.open({
      value: fechaFinal,
      onChange: (event, selectedDate) => {
        const currentDate = selectedDate || fechaFinal;
        setFechaFinal(currentDate); // Actualiza la fecha seleccionada
      },
      mode: "date",
      is24Hour: true,
    });
  };

  //FUNCION VER VENTAS POR FECHAS
  const verRangoFechas = async () => {
    try {
      if (!fechaInicial || !fechaFinal) {
        Alert.alert(
          "Obligatorio",
          "Selecciona Una Fecha Inicial y una Final para ver las Ventas."
        );
        return;
      }

      const adminIdString = await AsyncStorage.getItem("adminId");
      if (adminIdString === null) {
        console.log("ID de administrador no encontrado.");
        return;
      }
      const adminId = parseInt(adminIdString, 10);
      if (isNaN(adminId)) {
        console.log("ID de administrador no es un número válido.");
        return;
      }

      // Convertir las fechas a formato ISO (YYYY-MM-DD)
      const fechaInicio = fechaInicial.toISOString().split("T")[0];
      const fechaFin = fechaFinal.toISOString().split("T")[0];

      // Realizar la solicitud con los parámetros de consulta
      const respuesta = await axios.get(`${url}/infoResumFechas/${adminId}`, {
        params: {
          fechaInicio: fechaInicio,
          fechaFin: fechaFin,
        },
      });

      // Comprobación de la respuesta
      if (respuesta.data && respuesta.data.response) {
        const resultadoVentasResumidas = respuesta.data.response;
        setVentasResumidas(resultadoVentasResumidas);
      } else {
        setVentasResumidas([]);
      }
    } catch (error) {
      console.log("Error al cargar Ventas", error);
    }
  };

  //FUNCION LIMPIAR FECHAS VISTAS
  const limpiarFecha = async () => {
    await cargarVentas();
    setBotonLimpiarFecha(false);
    setVerFecha(false);
  };

  const handleFiltroChange = (value) => {
    setFiltro(value);
    // Aquí puedes agregar la lógica para filtrar la tabla según el valor seleccionado
    // Ejemplo:
    // if (value === "pendientes") {
    //   // Filtrar ventas pendientes
    // } else if (value === "pagadas") {
    //   // Filtrar ventas pagadas
    // } else {
    //   // Mostrar todas las ventas
    // }
  };

  useEffect(() => {
    cargarVentas();
    cargarTasaUnica();
  }, []);

  const Item = ({ cliente, fecha, estado }) => (
    <View style={styles.item}>
      <Text style={styles.nombreCliente}>{cliente}</Text>
      <Text style={styles.fechaPedido}>{formatearFecha(fecha)}</Text>
      <Text
        style={
          estado === "PAGADO" ? styles.estadoPagado : styles.estadoNoPagado
        }
      >
        {estado}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.ventasText}>
        Ventas <Text style={{ color: "#fcd53f" }}>Realizadas</Text>
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          marginTop: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setVerFecha(!verFecha);
          }}
          style={styles.BtnFecha}
        >
          <Text style={styles.BtnFechaText}>Rango de Fechas</Text>
        </TouchableOpacity>
        <View>
          <Picker
            selectedValue={filtro}
            onValueChange={(value) => handleFiltroChange(value)}
            style={styles.picker}
          >
            <Picker.Item label="Todas" value="todas" />
            <Picker.Item label="Pendientes" value="pendientes" />
            <Picker.Item label="Pagadas" value="pagadas" />
          </Picker>
        </View>
      </View>

      {verFecha && (
        <View style={styles.botonesContainer}>
          <TouchableOpacity
            onPress={showDatepickerInicial}
            style={styles.btnFechaIncial}
          >
            <Text style={styles.btnFechaIncialText}>Fecha Inicial</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={showDatepickerFinal}
            style={styles.btnFechaFinal}
          >
            <Text style={styles.btnFechaFinalText}>Fecha Final</Text>
          </TouchableOpacity>
          {botonLimpiarFecha ? (
            <TouchableOpacity
              onPress={limpiarFecha}
              style={styles.btnLimpiarFecha}
            >
              <FontAwesome name="close" size={24} color="black" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                verRangoFechas();
                setBotonLimpiarFecha(true);
              }}
              style={styles.btnverFecha}
            >
              <MaterialIcons name="pageview" size={30} color="black" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {ventasResumidas.length === 0 && (
        <View style={{ alignItems: "center", marginTop: 15 }}>
          <Text style={{ fontSize: 24, fontWeight: "900" }}>
            No Hay Ventas Realizadas
          </Text>
        </View>
      )}

      <View style={styles.tableVentas}>
        <FlatList
          data={ventasResumidas}
          keyExtractor={(item) => item.ID_VENTA}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setModalVentasDetalladas(true);
                cargarVentasDetalladas(item.ID_VENTA);
                
              }}
            >
              <Item
                cliente={item.CLIENTE}
                fecha={item.FECHA}
                estado={item.ESTADO_PAGO}
              />
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.BtnVenta}
          onPress={async () => {
            setFormVentas(true);
            await cargarTasaUnica();
          }}
        >
          <Text style={styles.BtnVentaText}>Realizar Venta</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={formVentas} animationType="slide">
        <FormularioVenta
          setFormVentas={setFormVentas}
          cargarClientes={cargarClientes}
          clientes={clientes}
          setClientes={setClientes}
          cargarProductos={cargarProductos}
          productos={productos}
          setProductos={setProductos}
          closeForm={closeForm}
          cargarVentas={cargarVentas}
          TasaBolivares={TasaBolivares}
          TasaPesos={TasaPesos}
        />
      </Modal>

      <Modal visible={modalVentasDetalladas} animationType="fade">
        <InformacionVenta
          setModalVentasDetalladas={setModalVentasDetalladas}
          ventasDetalladas={ventasDetalladas}
          setVentasDetalladas={setVentasDetalladas}
          TasaBolivares={TasaBolivares}
          TasaPesos={TasaPesos}
        />
      </Modal>
    </View>
  );
};

export default Ventas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {},
  buttonContainer: {
    padding: 10,
    alignItems: "center",
  },
  BtnVenta: {
    backgroundColor:'green',
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  BtnVentaText: {
    textAlign: "center",
    fontSize: 24,
    color: "#FFF",
    fontWeight: "900",
    textTransform: "uppercase",
  },
  ventasText: {
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 20,
    textTransform: "uppercase",
  },
  tableVentas: {
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    flex: 1,
    maxHeight: 470,
  },
  item: {
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 12,
  },
  nombreCliente: {
    fontSize: 15,
    fontWeight: "700",
  },
  fechaPedido: {
    fontSize: 13,
    fontWeight: "500",
  },
  estadoPagado: {
    fontSize: 13,
    fontWeight: "500",
    color: "green",
  },
  estadoNoPagado: {
    fontSize: 13,
    fontWeight: "500",
    color: "red",
  },
  Busqueda: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 5,
  },
  botonesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  BtnFecha: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 50,
    marginTop: 5,
  },
  BtnFechaText: {
    fontSize: 15,
    fontWeight: "900",
  },
  btnFechaIncial: {
    backgroundColor: "gray",
    padding: 8,
    borderRadius: 50,
    marginHorizontal: 5,
  },
  btnFechaIncialText: {
    fontWeight: "900",
    fontSize: 12,
  },
  btnLimpiarFecha: {
    padding: 8,
    borderRadius: 50,
    marginHorizontal: 5,
  },
  btnFechaFinalText: {
    fontWeight: "900",
    fontSize: 12,
  },
  btnFechaFinal: {
    backgroundColor: "#888999",
    padding: 8,
    borderRadius: 50,
    marginHorizontal: 5,
  },
  btnverFecha: {
    padding: 8,
  },
  picker: {
    height: 50,
    width: 160,
  },
});
