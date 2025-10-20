// helpers/ErrorHandler.js
import { message } from 'antd';

const ErrorHandler = (error) => {
  // extraer información del error de Axios
  if (error.response) {
    // El servidor respondió con un status != 2xx
    message.error(`Error ${error.response.status}: ${error.response.data.error || 'Algo salió mal'}`);
  } else if (error.request) {
    // No hubo respuesta del servidor
    message.error("No se recibió respuesta del servidor");
  } else {
    // Otro error al preparar la petición
    message.error(`Error: ${error.message}`);
  }
};

export default ErrorHandler;
