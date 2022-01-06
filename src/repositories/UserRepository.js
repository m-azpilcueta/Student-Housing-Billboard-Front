import HTTP from "@/common/http";

const resource = "users";

export default {
  async findAll() {
    const response = await HTTP.get(resource);
    return response.data;
  },
  async hacerFavorito(idUser, piso) {
    const response = await HTTP.put(`${resource}/${idUser}/favoritos`, piso);
    return response.data;
  },
  async quitarFavorito(idUser, idPiso) {
    const response = await HTTP.delete(`${resource}/${idUser}/favoritos/${idPiso}`);
    return response.data;
  },
};
