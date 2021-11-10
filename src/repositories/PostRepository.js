import HTTP from "@/common/http";

const resource = "posts";

export default {
  async findAll() {
    const response = await HTTP.get(resource);
    return response.data;
  },

  async findOne(id) {
    return (await HTTP.get(`${resource}/${id}`)).data;
  },

  async save(post) {
    if (post.id) {
      return (await HTTP.put(`${resource}/${post.id}`, post)).data;
    } else {
      return (await HTTP.post(`${resource}`, post)).data;
    }
  },

  async delete(id) {
    return await HTTP.delete(`${resource}/${id}`);
  },
};
