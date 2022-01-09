<template>
  <v-app>
    <!-- Notificaciones usando vue-notification -->
    <notifications :max="3" :width="400" position="top center" />

    <v-app-bar app color="light-blue darken-1" dark>
      <v-toolbar-title>
        <router-link to="/" v-slot="{ navigate }" custom>
          <span @click="navigate" class="pointer">UniPiso</span>
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn to="/pisos" exact text>
          <v-icon left>mdi-domain</v-icon>
          pisos
        </v-btn>
        <v-btn active-class="hide-active" text :to="{ name: 'Favorites', params: { id: user.id } }" v-if="isLogged & !isAdmin">
          <v-icon left>mdi-heart</v-icon>
          Favoritos
        </v-btn>
        <v-btn text to="/users" v-if="isAdmin">
          <v-icon left>mdi-account-group</v-icon>
          Usuarios
        </v-btn>
        <v-btn active-class="hide-active" text to="/register" v-if="!isLogged">
          <v-icon left>mdi-account-plus</v-icon>
          Registrarse
        </v-btn>
        <v-btn text active-class="hide-active" :to="{ name: 'UsersProfile', params: { id: user.id } }" v-if="isLogged"> <v-icon left>mdi-account</v-icon> Mi perfil </v-btn>
        <v-btn active-class="hide-active" text to="/login" v-if="!isLogged">
          <v-icon left>mdi-login</v-icon>
          Iniciar sesión
        </v-btn>
        <v-btn text @click="logout()" v-if="isLogged">
          <v-icon left>mdi-logout</v-icon>
          Cerrar sesión
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
      if (this.$router.currentRoute.name != "PisoList") {
        this.$router.push({ name: "PisoList" });
      }
    },
  },
};
</script>

<style lang="scss" src="./App.scss"></style>
