import HTTP from "@/common/http";

export default {
  async authenticate(credentials) {
    return (await HTTP.post(`authenticate`, credentials)).data;
  },

  async getAccount() {
    return (await HTTP.get(`account`)).data;
  },

  async registerAccount(user) {
    if (user.id) {
      return (await HTTP.put(`users/${user.id}`, user)).data;
    }
    return (await HTTP.post(`register`, user)).data;
  },
};
