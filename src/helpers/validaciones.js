 //VALIDAR EMAIL
 export const validateEmail = (email) => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
 };

 //VALIDAR CONTRASEÑA
 export const validatePassword = (password) => {
   const regexUpperCase = /[A-Z]/; // Al menos una mayúscula
   if (password.length < 8) {
     return false;
   } else if (!regexUpperCase.test(password)) {
     return false;
   } else {
     return true;
   }
 };

 //VALIDAR CAMPO DECIMAL

 export const validateEntero = inputEntero => {
  const integerRegex = /^\d+$/;
  if (integerRegex.test(inputEntero) || inputEntero === "") {
    return inputEntero
  } else {
    return false
  }
 }

 // Ajustar la fecha para que refleje el huso horario local
export const formatearFecha = (fecha) => {
  const nuevaFecha = new Date(fecha);
  nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset()); // Ajusta al huso horario local

  const opciones = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return nuevaFecha.toLocaleDateString('es-ES', opciones);
};

export const formatearFechaOtroFormato = (fecha) => {
  const nuevaFecha = new Date(fecha);
  nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset()); // Ajusta al huso horario local

  const dia = nuevaFecha.getDate().toString().padStart(2, '0'); // Asegura 2 dígitos
  const mes = (nuevaFecha.getMonth() + 1).toString().padStart(2, '0'); // Mes en 2 dígitos
  const año = nuevaFecha.getFullYear();

  return `${dia}/${mes}/${año}`;
};

//HORA ACTUAL
export const formatearHora = () => {
  const nuevaHora = new Date();
  const opciones = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true // Formato de 12 horas con AM/PM
  };

  return nuevaHora.toLocaleTimeString('es-ES', opciones);
};

