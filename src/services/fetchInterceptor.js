import { API_BASE } from "../config/api";

// 🔥 URL BASE API
const API = API_BASE;

// 🔥 EVITAR EJECUCIONES DUPLICADAS
let procesandoCorreos = false;

// 🔥 FUNCIÓN WORKER
const procesarCorreos = async () => {

  // evitar múltiples ejecuciones simultáneas
  if (procesandoCorreos) return;

  procesandoCorreos = true;

  try {

    await window.originalFetch(
      API + "helpers/enviar_correos.php"
    );

  } catch (err) {

    console.error(
      "Error procesando correos:",
      err
    );

  } finally {

    procesandoCorreos = false;
  }
};

// 🔥 GUARDAR FETCH ORIGINAL
window.originalFetch = window.fetch;

// 🔥 INTERCEPTOR GLOBAL
window.fetch = async (...args) => {

  // ejecutar fetch normal
  const response = await window.originalFetch(...args);

  try {

    const url = args[0];

    const options = args[1] || {};

    const method = (
      options.method || "GET"
    ).toUpperCase();

    // 🔥 SOLO APIs INTERNAS
    const esApiInterna =
      typeof url === "string" &&
      url.includes(API);

    // 🔥 SOLO OPERACIONES QUE MODIFICAN
    const modificaDatos =
      ["POST", "PUT", "PATCH", "DELETE"]
        .includes(method);

    // 🔥 NO DISPARAR EL MISMO WORKER
    const esWorkerCorreos =
      typeof url === "string" &&
      url.includes("enviar_correos.php");

    // 🔥 EJECUTAR WORKER
    if (
      esApiInterna &&
      modificaDatos &&
      !esWorkerCorreos
    ) {

      // SIN BLOQUEAR UI
      procesarCorreos();
    }

  } catch (err) {

    console.error(
      "Error interceptor fetch:",
      err
    );
  }

  return response;
};