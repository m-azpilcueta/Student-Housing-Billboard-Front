<template>
  <v-layout align-center justify-center class="mb-5 mt-5">
    <v-flex xs12 sm8 md4>
      <v-form @submit.prevent="userLogin">
        <v-card class="pa-4">
          <v-card-title>Iniciar sesión</v-card-title>
          <v-card-text>
            <v-text-field label="Login" name="login" prepend-icon="person" type="text" v-model="username"></v-text-field>

            <v-text-field v-model="password" label="Password" name="password" prepend-icon="lock" type="password"></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" color="light-blue lighten-2" class="white--text">Iniciar sesión</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import auth from "../common/auth";

export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    userLogin() {
      auth
        .login({
          login: this.username,
          password: this.password,
        })
        .then(() => {
          // vamos a la página anterior después de autenticarnos
          this.$router.go(-1);
        })
        .catch((err) => {
          this.$notify({
            text: err.response.data.message,
            type: "error",
          });
        });
    },
  },
};
</script>
