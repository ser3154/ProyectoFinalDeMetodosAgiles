// api.js
// Minimal API helpers for demo (fake auth). Adjust BASE_URL if needed.
const API = (function () {
  const BASE_URL = "http://localhost:3002/api";

  async function createExperiencia(formData) {
    const res = await fetch(`${BASE_URL}/experiencias/registrar`, {
      method: "POST",
      body: formData,
    });
    return res;
  }

  return {
    createExperiencia,
  };
})();
