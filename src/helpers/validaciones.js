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
