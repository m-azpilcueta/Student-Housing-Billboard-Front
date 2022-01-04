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
        <v-btn to="/posts" exact text>posts</v-btn>
        <v-btn to="/posts_preloading" exact text>posts preloading</v-btn>
        <v-btn to="/posts_sin_vuetify" exact text>posts sin vuetify</v-btn>
        <v-btn active-class="hide-active" icon to="/login" v-if="!isLogged">
          <v-icon>mdi-login</v-icon>
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
