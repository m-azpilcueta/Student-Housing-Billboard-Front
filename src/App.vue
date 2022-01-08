<template>
  <v-app>
    <!-- Notificaciones usando vue-notification -->
    <notifications :max="3" :width="400" position="top center" />

    <v-app-bar app color="primary" dark>
      <v-toolbar-title>
        <router-link to="/" v-slot="{ navigate }" custom>
          <span @click="navigate" class="pointer">UniPiso</span>
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn to="/pisos" exact text>pisos</v-btn>

        <v-btn active-class="hide-active" text to="/" v-if="isLogged">
          <v-icon left>mdi-heart</v-icon>
          Favoritos
        </v-btn>
        <v-btn active-class="hide-active" text to="/register" v-if="!isLogged">
          <v-icon left>mdi-account-plus</v-icon>
          Registrarse
        </v-btn>
        <v-btn active-class="hide-active" text to="/login" v-if="!isLogged">
          <v-icon left>mdi-login</v-icon>
          Iniciar sesión
        </v-btn>
        <v-btn icon @click="logout()" v-if="isLogged">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import store from "@/common/store";
import auth from "@/common/auth";

export default {
  name: "App",
  data() {
    return {
      user: store.state.user,
    };
  },
  computed: {
    isLogged() {
      return this.user.logged;
    },
    isAdmin() {
      return this.user.authority == "ADMIN";
    },
  },
  methods: {
    logout() {
      auth.logout();
      // Después de hacer logout nos vamos a home
      if (this.$router.currentRoute.name != "Home") {
        this.$router.push({ name: "Home" });
      }
    },
  },
};
</script>

<style lang="scss" src="./App.scss"></style>
