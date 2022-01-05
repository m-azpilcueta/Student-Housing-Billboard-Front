import HTTP from "@/common/http";

const resource = "localidades";

export default {
  async cargarLocalidades() {
    const response = await HTTP.get(resource);
    return response.data;
  },
};
