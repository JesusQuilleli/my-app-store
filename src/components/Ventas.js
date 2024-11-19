import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  TextInput,
  Linking,
} from "react-native";

import FormularioVenta from "./sub-components/components--Ventas/FormularioVenta.js";
import InformacionVenta from "./sub-components/components--Ventas/InformacionVenta.js";

import { PagosContext } from "./Context/pagosContext.js";

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

  const {
    cargarPagos,
    cargarProductos,
    productos,
    setProductos,
    ventasResumidas,
    setVentasResumidas,
    cargarVentas,
  } = useContext(PagosContext);

  //CLIENTES Y PRODUCTOS
  const [clientes, setClientes] = useState([]);

  //VENTAS
  const [ventasDetalladas, setVentasDetalladas] = useState([]);
  const [modalVentasDetalladas, setModalVentasDetalladas] = useState(false);

  //FECHAS
  const [verFecha, setVerFecha] = useState(false);
  const [fechaInicial, setFechaIncial] = useState(new Date());
  const [fechaFinal, setFechaFinal] = useState(new Date());
  const [botonLimpiarFecha, setBotonLimpiarFecha] = useState(false);

  //VER VENTAS POR ESTADO
  const [filtroVentas, setFiltroVentas] = useState("todas"); // Estado inicial en "todas"

  //PARA ELIMINAR VENTAS
  const [ventasSeleccionadas, setVentasSeleccionadas] = useState([]);
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      setVerTasas(response.data.data);
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

  //FUNCION CARGAR VENTAS POR CEDULA CLIENTE
  const cargarVentasPorCedula = async (cedulaCliente) => {
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

      // Realizar la petición GET con el adminId y la cédula
      const respuesta = await axios.get(
        `${url}/infoResumCedula/${adminId}/${cedulaCliente}`
      );
      const resultadoVentasResumidas = respuesta.data.response;
      setVentasResumidas(resultadoVentasResumidas); // Establecer las ventas en el estado
    } catch (error) {
      console.log("Error al cargar Ventas filtradas por cédula", error);
    }
  };

  // Función cargarVentasEstadoPago con el estado de pago como argumento
  const cargarVentasEstadoPago = async (estadoPago) => {
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
      // Pasamos estadoPago como parámetro de consulta
      const respuesta = await axios.get(`${url}/ventasEstadoPago/${adminId}`, {
        params: { estadoPago },
      });
      const resultVentas = respuesta.data.response;
      setVentasResumidas(resultVentas);
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
        if (event.type === "set") {
          // Asegura que selectedDate esté en tu zona horaria local
          const localDate = new Date(
            selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
          );

          setFechaIncial(localDate); // Actualiza la fecha ajustada
        }
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
        if (event.type === "set") {
          // Asegura que selectedDate esté en tu zona horaria local
          const localDate = new Date(
            selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
          );

          setFechaFinal(localDate); // Actualiza la fecha ajustada
        }
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

  const handleFiltroChange = async (value) => {
    setFiltroVentas(value); // Actualizamos el filtro de ventas antes de hacer la carga

    if (value === "PENDIENTE" || value === "PAGADO") {
      await cargarVentasEstadoPago(value); // Pasamos el estado de pago seleccionado
    } else {
      await cargarVentas(); // Si el valor es diferente, cargamos todas las ventas
    }
  };

  const seleccionarVenta = (idVenta) => {
    setModoSeleccion(true); // Activa el modo selección al seleccionar una venta

    if (ventasSeleccionadas.includes(idVenta)) {
      // Si la venta ya está seleccionada, la deselecciona
      const nuevasVentasSeleccionadas = ventasSeleccionadas.filter(
        (id) => id !== idVenta
      );
      setVentasSeleccionadas(nuevasVentasSeleccionadas);

      // Si no quedan ventas seleccionadas, desactiva el modo selección
      if (nuevasVentasSeleccionadas.length === 0) {
        setModoSeleccion(false);
      }
    } else {
      // Si la venta no está seleccionada, la agrega a las seleccionadas
      setVentasSeleccionadas([...ventasSeleccionadas, idVenta]);
    }
  };

  // Función para seleccionar o deseleccionar todas las ventas
  const seleccionarTodas = () => {
    if (ventasSeleccionadas.length === ventasResumidas.length) {
      // Si ya están todas seleccionadas, deseleccionarlas
      setVentasSeleccionadas([]);
      setModoSeleccion(false);
    } else {
      // Seleccionar todas las ventas
      const todosLosIds = ventasResumidas.map((venta) => venta.ID_VENTA);
      setVentasSeleccionadas(todosLosIds);
    }
  };

  // Función para eliminar las ventas seleccionadas
  const eliminarVentasSeleccionadas = async () => {
    setIsLoading(true);
    try {
      // Realiza la solicitud DELETE al endpoint enviando los IDs de las ventas seleccionadas
      const response = await axios.delete(`${url}/eliminarVentas`, {
        data: { ids: ventasSeleccionadas },
      });

      if (response.status === 200) {
        // Filtra las ventas eliminadas de la lista en el frontend
        setVentasResumidas((ventas) =>
          ventas.filter(
            (venta) => !ventasSeleccionadas.includes(venta.ID_VENTA)
          )
        );

        // Limpia la selección y desactiva el modo selección
        setVentasSeleccionadas([]);
        setModoSeleccion(false);

        await cargarVentas();
        await cargarPagos();

        console.log("Ventas eliminadas con éxito");
      } else {
        console.log("Error: No se encontraron algunas ventas para eliminar");
      }
    } catch (error) {
      console.log("Error al eliminar ventas en el Frontend", error);
    } finally {
      setIsLoading(false);
    }
  };

  //ELIMINAR VENTAS
  const handlerEliminar = () => {
    // Mostrar la advertencia de confirmación
    Alert.alert(
      "Confirmar eliminación", // Título del alert
      "¿Estás seguro de eliminar todas las ventas seleccionadas?", // Mensaje
      [
        {
          text: "No", // Botón "No"
          onPress: () => {
            setVentasSeleccionadas([]);
            setModoSeleccion(false);
          },
          style: "cancel", // Estilo del botón "No"
        },
        {
          text: "Sí", // Botón "Sí"
          onPress: () => {
            eliminarVentasSeleccionadas();
          }, // Ejecuta la eliminación si elige "Sí"
          style: "destructive", // Estilo del botón "Sí" para indicar acción destructiva
        },
      ],
      { cancelable: false } // Hace que el alert no se cierre al tocar fuera de él
    );
  };

  useEffect(() => {
    cargarVentas();
    cargarTasaUnica();
  }, []);

  const Item = ({ venta, cliente, fecha, estado, seleccionado }) => (
    <View style={[styles.item, seleccionado && styles.itemSeleccionado]}>
      <Text style={styles.codigoVenta}>Codigo {venta}</Text>
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
            selectedValue={filtroVentas}
            onValueChange={(value) => handleFiltroChange(value)}
            style={styles.picker}
          >
            <Picker.Item label="Todas" value="todas" />
            <Picker.Item label="Pendientes" value="PENDIENTE" />
            <Picker.Item label="Pagadas" value="PAGADO" />
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

      <View style={styles.boxInput}>
        <View style={styles.contentButtonAndInput}>
          <View style={styles.input}>
            <TextInput
              placeholder="Buscar por Cedula"
              placeholderTextColor="#888"
              style={{ textAlign: "center" }}
              onChangeText={(value) => {
                if (value.length > 0) {
                  cargarVentasPorCedula(value);
                } else {
                  cargarVentas();
                }
              }}
            />
          </View>
        </View>
      </View>

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
                if (modoSeleccion) {
                  seleccionarVenta(item.ID_VENTA);
                } else {
                  setModalVentasDetalladas(true);
                  cargarVentasDetalladas(item.ID_VENTA);
                }
              }}
              onLongPress={() => seleccionarVenta(item.ID_VENTA)}
            >
              <Item
                venta={item.ID_VENTA}
                cliente={item.CLIENTE}
                fecha={item.FECHA}
                estado={item.ESTADO_PAGO}
                seleccionado={ventasSeleccionadas.includes(item.ID_VENTA)}
              />
            </TouchableOpacity>
          )}
        />
      </View>

      {!modoSeleccion && (
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
      )}

      {modoSeleccion && (
        <View style={styles.buttonContainerEliminar}>
          <TouchableOpacity
            style={styles.BtnEliminar}
            onPress={() => handlerEliminar()}
          >
            <Text style={styles.BtnEliminarText}>Eliminar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.BtnEliminar, { backgroundColor: "#888" }]}
            onPress={() => seleccionarTodas()}
          >
            <Text style={styles.BtnEliminarText}>
              {ventasSeleccionadas.length === ventasResumidas.length ? (
                <Text>Cancelar</Text>
              ) : (
                <Text>Seleccionar Todas</Text>
              )}
            </Text>
          </TouchableOpacity>
        </View>
      )}

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
          cargarVentas={cargarVentas}
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
    alignItems: "center",
  },
  header: {},
  buttonContainer: {
    padding: 10,
    alignItems: "center",
  },
  buttonContainerEliminar: {
    padding: 10,
    alignItems: "center",
    width: "100%",
  },
  BtnEliminar: {
    width: "80%",
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2.5,
  },
  BtnEliminarText: {
    textAlign: "center",
    fontSize: 18,
    color: "#FFF",
    fontWeight: "900",
    textTransform: "uppercase",
  },
  BtnVenta: {
    backgroundColor: "green",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2.5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 5,
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
  itemSeleccionado: {
    backgroundColor: "#dcdcdc", // Cambia el fondo para indicar selección
  },
  codigoVenta: {
    fontSize: 15,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  nombreCliente: {
    fontSize: 14,
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
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
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
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 5,
  },
  btnFechaIncialText: {
    fontWeight: "900",
    fontSize: 12,
  },
  btnLimpiarFecha: {
    padding: 8,
    borderRadius: 50,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 5,
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
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 5,
  },
  btnverFecha: {
    padding: 8,
  },
  picker: {
    height: 50,
    width: 160,
  },
  boxInput: {
    width: "100%",
    marginVertical: 15,
    textTransform: "uppercase",
  },
  input: {
    width: "70%",
    backgroundColor: "#efefef",
    borderBottomColor: "#fee03e",
    borderBottomWidth: 2,
    borderRadius: 24,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 5,
  },
  contentButtonAndInput: {
    width: "100%",
    alignItems: "center",
  },
  botonAvisar: {
    backgroundColor: "#25D366",
    padding: 15,
    margin: 10,
    borderRadius: 50,
    alignItems: "center",
  },
});
