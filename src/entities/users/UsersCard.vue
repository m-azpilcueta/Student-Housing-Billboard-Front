<template>
  <div class="mb-4" v-if="usuario">
    <v-row class="d-flex flex-column flex-sm-row">
      <v-col class="d-flex justify-center align-end">
        <v-icon size="125">mdi-account-circle</v-icon>
      </v-col>
      <v-col class="d-flex flex-column align-center align-sm-start">
        <h2>{{ usuario.login }}</h2>
        <p><strong>Activo: </strong>{{ convertirBool(usuario.active) }}</p>
        <div v-if="!isMismoUsuario" class="d-flex flex-column justify-center">
          <v-btn v-if="!usuario.active" small class="primary mb-2" @click="desbanearUsuario(usuario.id)">Desbanear</v-btn>
          <v-btn v-if="usuario.active" small class="warning mb-2" @click="banearUsuario(usuario.id)">Banear</v-btn>
          <v-btn small class="error" @click="borrarUsuario(usuario.id)">Eliminar</v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import userRepository from "@/repositories/UserRepository";
import store from "@/common/store";

export default {
  data() {
    return {
      usuario: this.user,
    };
  },
  name: "UsersCard",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isMismoUsuario() {
      return store.state.user.id === this.usuario.id;
    },
  },
  methods: {
    convertirBool(valor) {
      if (valor) return "Sí";
      else return "No";
    },
    async borrarUsuario(idUser) {
      await userRepository
        .borrarUsuario(idUser)
        .then((this.usuario = null))
        .catch((err) => {
          this.$notify({
            text: err.response.data.message,
            type: "error",
          });
        });
    },
    async banearUsuario(idUser) {
      await userRepository
        .desactivarUsuario(idUser)
        .then((resp) => {
          this.usuario = resp;
        })
        .catch((err) => {
          this.$notify({
            text: err.response.data.message,
            type: "error",
          });
        });
    },
    async desbanearUsuario(idUser) {
      await userRepository
        .activarUsuario(idUser)
        .then((resp) => {
          this.usuario = resp;
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

<style scoped></style>
