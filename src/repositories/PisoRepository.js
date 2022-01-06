import HTTP from "@/common/http";

const resource = "pisos";

export default {
  async findAll() {
    const response = await HTTP.get(resource);
    return response.data;
  },
  async publicar(piso) {
    if (piso.idPiso) {
      return await HTTP.put(`${resource}/${piso.idPiso}`, piso);
    }
    return await HTTP.post(resource, piso);
  },
  async findById(id) {
    const response = await HTTP.get(`${resource}/${id}`);
    return response.data;
  },
  async subirImagen(id, file) {
    const formData = new FormData();
    formData.append("imagen", file);
    return (
      await HTTP.post(`${resource}/${id}/imagenes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  },
  async cargarImagenes(id) {
    const response = await HTTP.get(`${resource}/${id}/imagenes`);
    return response.data;
  },
  async ponerPortada(idPiso, idImagen, body) {
    const response = await HTTP.put(`${resource}/${idPiso}/imagenes/${idImagen}`, body);
    return response.data;
  },
};
