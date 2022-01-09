import HTTP from "@/common/http";

const resource = "estudios";

export default {
  async crearEstudio(estudio) {
    const response = await HTTP.post(`${resource}`, estudio);
    return response.data;
  },
};
