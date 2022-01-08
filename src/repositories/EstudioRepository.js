import HTTP from "@/common/http";

const resource = "estudios";

export default {
  async findAll() {
    const response = await HTTP.get(resource);
    return response.data;
  },

  async crearEstudio(estudio) {
    const response = await HTTP.post(`${resource}`, estudio);
    return response.data;
  },
};
