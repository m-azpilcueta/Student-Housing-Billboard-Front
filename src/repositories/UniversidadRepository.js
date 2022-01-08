import HTTP from "@/common/http";

const resource = "universidades";

export default {
  async findAllUniversidades() {
    const response = await HTTP.get(resource);
    return response.data;
  },
  async findAllEstudiosByUniversidad(id) {
    const response = await HTTP.get(`${resource}/${id}/estudios`);
    return response.data;
  },
};
