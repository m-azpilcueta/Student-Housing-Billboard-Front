import HTTP from "@/common/http";

const resource = "estudios";

export default {
  async findAll() {
    const response = await HTTP.get(resource);
    return response.data;
  },

  async findAllEstudiosByUniversidad(id) {
    const response = await HTTP.get(`${resource}/universidad/${id}`);
    return response.data;
  },
};
