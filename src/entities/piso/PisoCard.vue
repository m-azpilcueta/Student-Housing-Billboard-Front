<template>
  <v-card>
    <router-link :to="{ name: 'PisoDetail', params: { id: piso.idPiso } }" v-slot="{ navigate }" custom>
      <v-img @click="navigate" class="pointer" :src="cargarPortada(piso)"></v-img>
    </router-link>
    <v-icon @click="gestionarFavs()" size="25" class="favoritos" color="red darken-2" v-if="isLogged & isDisponible & !isMismoUsuario & !isAdmin">{{ favSelector }}</v-icon>
    <router-link :to="{ name: 'PisoDetail', params: { id: piso.idPiso } }" v-slot="{ navigate }" custom>
      <v-card-title @click="navigate" class="pointer">
        {{ piso.nombre }}
      </v-card-title>
    </router-link>
    <v-card-text v-if="estudioVisible" class="d-flex align-center">
      <v-icon class="mr-2" size="48" color="light-blue lighten-2">mdi-account-circle</v-icon>
      <div class="d-flex flex-column">
        <b>Estudio del anunciante:</b>
        {{ piso.anunciante.estudio.nombreEstudio }}
        <br />
        {{ piso.anunciante.estudio.universidad.nombreUniversidad }}
      </div>
    </v-card-text>
    <div class="d-flex align-center justify-space-between">
      <v-card-subtitle class="d-flex align-center">
        <v-icon class="mr-1" color="grey darken-3">mdi-map-marker</v-icon>
        <span
          ><b>{{ piso.localidad }}, {{ piso.provincia }}</b></span
        >
      </v-card-subtitle>
      <v-card-title class="light-blue--text">{{ piso.importe }}€</v-card-title>
    </div>
    <div class="no-disp d-flex justify-center align-center" v-if="!isDisponible">
      <v-card-title>Piso no disponible</v-card-title>
    </div>
  </v-card>
</template>

<script>
import store from "@/common/store";
import userRepository from "@/repositories/UserRepository";

export default {
  name: "PisoCard",
  data() {
    return {
      favoritos: store.state.user.favoritos,
    };
  },
  props: {
    piso: {
      type: Object,
      required: true,
    },
    estudioVisible: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    isAdmin() {
      return store.state.user.authority === "ADMIN";
    },
    isLogged() {
      return store.state.user.logged;
    },
    isDisponible() {
      return this.piso.disponible;
    },
    isMismoUsuario() {
      return store.state.user.id === this.piso.anunciante.id;
    },
    isFav() {
      let j = this.favoritos;
      for (let x = 0; x < j.length; x++) {
        if (j[x].idPiso === this.piso.idPiso) return true;
      }
      return false;
    },
    favSelector() {
      if (this.isFav) return "mdi-heart";
      else return "mdi-heart-outline";
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
    async gestionarFavs() {
      if (!this.isFav) {
        let u = await userRepository.hacerFavorito(store.state.user.id, { idPiso: this.piso.idPiso });
        this.favoritos = u.favoritos;
      } else {
        let u = await userRepository.quitarFavorito(store.state.user.id, this.piso.idPiso);
        this.favoritos = u.favoritos;
      }
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
