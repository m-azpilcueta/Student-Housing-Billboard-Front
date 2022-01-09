import HTTP from "@/common/http";

const resource = "users";

export default {
  async findAll() {
    const response = await HTTP.get(resource);
    return response.data;
  },

  async findAllPisosByAnunciante(id) {
    const response = await HTTP.get(`${resource}/${id}/pisos`);
    return response.data;
  },

  async findOne(id) {
    return (await HTTP.get(`${resource}/${id}`)).data;
  },

  async hacerFavorito(idUser, piso) {
    const response = await HTTP.put(`${resource}/${idUser}/favoritos`, piso);
    return response.data;
  },

  async quitarFavorito(idUser, idPiso) {
    const response = await HTTP.delete(`${resource}/${idUser}/favoritos/${idPiso}`);
    return response.data;
  },
  async borrarUsuario(idUser) {
    const response = await HTTP.delete(`${resource}/${idUser}`);
    return response.data;
  },
  async desactivarUsuario(idUser) {
    const response = await HTTP.put(`${resource}/${idUser}/desactivate`);
    return response.data;
  },
  async activarUsuario(idUser) {
    const response = await HTTP.put(`${resource}/${idUser}/activate`);
    return response.data;
  },
};
