<template>
  <v-container>
    <v-card class="pr-5 pl-5 pb-5">
      <v-card-title class="pl-0">Mis favoritos</v-card-title>
      <div v-if="favoritos.length === 0" class="d-flex justify-center align-center mb-2">
        <h3 class="font-weight-light">No se han seleccionado pisos como favoritos.</h3>
      </div>
      <v-row v-if="favoritos.length > 0">
        <v-col cols="4" v-for="f in favoritos" :key="f.idPiso">
          <PisoCard :piso="f" :estudio-visible="true"></PisoCard>
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
      try {
        this.usuario = await accountRepository.getAccount();
      } catch (err) {
        this.$notify({
          text: err.response.data.message,
          type: "error",
        });
      } finally {
        this.favoritos = this.usuario.favoritos;
      }
    },
  },
};
</script>

<style scoped></style>
