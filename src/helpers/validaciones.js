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


 //FORMATEAR FECHA
 export const formatearFecha = fecha => {
  const nuevaFecha = new Date(fecha);
  const opciones = {
     weeday: 'long',
     year: 'numeric',
     month: 'long',
     day: 'numeric'
  }

  return nuevaFecha.toLocaleDateString('es-Es', opciones)
}

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

