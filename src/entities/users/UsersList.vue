<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>Lista de usuarios</v-card-title>
      <v-card-text v-if="users.length === 0">No hay usuarios registrados.</v-card-text>
      <v-row v-if="users.length > 0" class="align-center">
        <v-col cols="4" v-for="u in users" :key="u.id">
          <UsersCard :user="u"></UsersCard>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import UsersCard from "./UsersCard.vue";
import UserRepository from "@/repositories/UserRepository";

export default {
  data() {
    return {
      users: [],
    };
  },
  components: { UsersCard },
  mounted() {
    this.cargarUsuarios();
  },
  methods: {
    async cargarUsuarios() {
      this.users = await UserRepository.findAll().catch((err) => {
        this.$notify({
          text: err.response.data.message,
          type: "error",
        });
      });
    },
  },
};
</script>
