<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <h1>Users List</h1>
      </v-col>
      <v-col cols="12" sm="4" lg="3" v-for="user in users" :key="user.id">
        <UsersCard :user="user"></UsersCard>
      </v-col>
    </v-row>
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
  async mounted() {
    this.users = await UserRepository.findAll();
  },
};
</script>
