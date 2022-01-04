import HTTP from "@/common/http";

const resource = "uni";

export default {
  async findAllUniversidades() {
    const response = await HTTP.get(resource);
    return response.data;
  },
};
