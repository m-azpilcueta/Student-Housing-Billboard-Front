import HTTP from "@/common/http";

const resource = "posts";

export default {
  async findAll(query) {
    let url = resource;
    if (query) {
      url += `?query=${query}`;
    }
    const response = await HTTP.get(url);
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

  async saveImage(id, file) {
    const formData = new FormData();
    formData.append("file", file);
    return (
      await HTTP.post(`${resource}/${id}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  },
};
