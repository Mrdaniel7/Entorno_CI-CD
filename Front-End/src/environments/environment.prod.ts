export const environment = {
  production: true,
  // apiBaseUrl: 'http://localhost:9096' // <-- Configurado para Back-End en el MISMO contenedor en puerto 8080
  apiBaseUrl: 'http://host.docker.internal:8082/api'
};
