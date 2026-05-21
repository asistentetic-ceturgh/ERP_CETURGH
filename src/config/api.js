const isLocal = window.location.hostname === "localhost";

export const API_BASE = isLocal
  ? "http://localhost/API_CETURGH/"
  : "https://ceturghperu.edu.pe/API_CETURGH/";