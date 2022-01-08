<template>
  <v-container>
    <v-card class="pr-5 pl-5 pb-5">
      <v-card-title class="pl-0">Mis favoritos</v-card-title>
      <div v-if="favoritos.length === 0" class="d-flex justify-center align-center mb-2">
        <span>No has seleccionado ningún piso como favorito.</span>
      </div>
      <v-row v-if="favoritos.length > 0">
        <v-col cols="3" v-for="f in favoritos" :key="f.idPiso">
          <PisoCard :piso="f"></PisoCard>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import PisoCard from "@/entities/piso/PisoCard";
import accountRepository from "@/repositories/AccountRepository";
export default {
  components: { PisoCard },
  data() {
    return {
      usuario: {},
      favoritos: [],
    };
  },
  name: "Favoritos",
  mounted() {
    this.cargarUsuario();
  },
  methods: {
    async cargarUsuario() {
      this.usuario = await accountRepository.getAccount();
      this.favoritos = this.usuario.favoritos;
    },
  },
};
</script>

<style scoped></style>
