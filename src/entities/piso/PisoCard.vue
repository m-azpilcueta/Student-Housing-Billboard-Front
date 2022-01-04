<template>
  <v-card>
    <v-img :src="cargarPortada(piso)"></v-img>
    <v-icon size="25" class="favoritos" color="red darken-2" v-if="isLogged & isDisponible">mdi-heart-outline</v-icon>
    <v-card-title>
      {{ piso.nombre }}
    </v-card-title>
    <v-card-text class="d-flex align-center">
      <v-icon class="mr-2" size="48">mdi-account-circle</v-icon>
      <div class="d-flex flex-column">
        <b>Estudio del anunciante:</b>
        {{ piso.anunciante.estudio.nombreEstudio }}
        <br />
        {{ piso.anunciante.estudio.universidad.nombreUniversidad }}
      </div>
    </v-card-text>
    <div class="d-flex align-center justify-space-between">
      <v-card-subtitle class="d-flex align-center">
        <v-icon class="mr-1" color="red darken-2">mdi-map-marker</v-icon>
        <span
          ><b>{{ piso.localidad }}, {{ piso.provincia }}</b></span
        >
      </v-card-subtitle>
      <v-card-title>{{ piso.importe }}€</v-card-title>
    </div>
    <div class="no-disp d-flex justify-center align-center" v-if="!isDisponible">
      <v-card-title>Piso no disponible</v-card-title>
    </div>
  </v-card>
</template>

<script>
import store from "@/common/store";

export default {
  name: "PisoCard",
  props: {
    piso: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isLogged() {
      return store.state.user.logged;
    },
    isDisponible() {
      return this.piso.disponible;
    },
  },
  methods: {
    cargarPortada(piso) {
      if (piso.imagenes.length > 0) {
        for (let i = 0; i < piso.imagenes.length; i++) {
          let x = piso.imagenes[i];
          if (x.portada === true) return `http://localhost:8080/api/pisos/${this.piso.idPiso}/imagenes/${x.idImagen}`;
        }
      }
      return require("@/assets/placeholder.png");
    },
  },
};
</script>

<style scoped>
.favoritos {
  position: absolute;
  top: 5%;
  right: 5%;
  cursor: pointer;
}

.no-disp {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgb(52, 52, 52, 0.8);
  color: #eaeaea;
}
</style>
