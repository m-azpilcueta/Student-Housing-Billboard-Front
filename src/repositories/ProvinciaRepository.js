import HTTP from "@/common/http";

const resource = "provincias";

export default {
  async cargarProvincias() {
    const response = await HTTP.get(resource);
    return response.data;
  },
};
