<template>
  <v-container v-if="piso">
    <v-card class="mt-3 mb-5 pl-5 pr-5 pb-5">
      <v-row class="pt-5 pb-5">
        <v-col cols="6">
          <v-carousel height="350">
            <v-carousel-item v-for="i in imagenes" :key="i.idImagen" :src="srcConstructor(i)"></v-carousel-item>
          </v-carousel>
          <div class="d-flex flex-column mt-5 borde">
            <span><b>Descripción:</b></span>
            <span>{{ piso.descripcion }}</span>
          </div>
        </v-col>
        <v-col cols="6">
          <div class="d-flex">
            <span id="disponible" class="primary flex-grow-1">{{ setDisponible }}</span>
            <v-icon @click="gestionarFavs()" size="35" class="pointer ml-2" v-if="isLogged & isDisponible & !isMismoUsuario" color="red darken-2">{{ favSelector }}</v-icon>
          </div>
          <div class="d-flex align-center mb-4 mt-4 borde">
            <div class="d-flex flex-column mr-5">
              <v-icon size="50">mdi-account-circle</v-icon>
              <span
                ><b>{{ piso.anunciante.nombre }}</b></span
              >
            </div>
            <div class="d-flex flex-column">
              <span>{{ piso.anunciante.email }}</span>
              <span>{{ piso.anunciante.telefonoContacto }}</span>
              <span>{{ piso.anunciante.estudio.nombreEstudio }}</span>
              <span>{{ piso.anunciante.estudio.universidad.nombreUniversidad }}</span>
            </div>
          </div>
          <span
            ><b>{{ piso.nombre }}</b></span
          >
          <br />
          <span
            ><i>Publicado el {{ parsearFecha(piso.fechaPublicacion) }}</i></span
          >
          <br />
          <div class="d-flex mt-4">
            <v-icon size="36" color="red darken-2">mdi-map-marker</v-icon>
            <div class="d-flex flex-column ml-2">
              <span>{{ piso.calle }} {{ piso.numero }}, {{ piso.pisoLetra }}</span>
              <span>{{ piso.codigoPostal }} {{ piso.localidad }}, {{ piso.provincia }}</span>
            </div>
          </div>
          <div class="d-flex flex-column mt-4">
            <span><b>Importe mensual: </b>{{ piso.importe }}€</span>
            <span><b>Número de habitaciones: </b>{{ piso.habitaciones }}</span>
            <span><b>Número de personas: </b>{{ piso.personas }}</span>
            <span><b>Amueblado: </b>{{ conversorBoolean(piso.amueblado) }}</span>
            <span><b>Superficie: </b>{{ piso.superficie }} m2</span>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import moment from "moment";
import pisoRepository from "@/repositories/PisoRepository";
import store from "@/common/store";
import userRepository from "@/repositories/UserRepository";

export default {
  data() {
    return {
      piso: null,
      imagenes: [],
      portada: require("@/assets/placeholder.png"),
      user: store.state.user,
    };
  },
  name: "PisoDetail",
  created() {
    this.cargarPiso().then(() => {
      if (this.piso.imagenes.length > 0) {
        this.imagenes = this.piso.imagenes;
      }
    });
  },
  computed: {
    setDisponible() {
      if (this.piso.disponible) return "Disponible";
      else return "No disponible";
    },
    isLogged() {
      return store.state.user.logged;
    },
    isDisponible() {
      return this.piso.disponible;
    },
    isMismoUsuario() {
      return this.user.id === this.piso.anunciante.id;
    },
    isFav() {
      let j = this.user.favoritos;
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
    async cargarPiso() {
      this.piso = await pisoRepository.findById(this.$route.params.id);
    },
    parsearFecha(fecha) {
      return moment(fecha).format("DD/MM/YYYY");
    },
    conversorBoolean(valor) {
      if (valor) return "Sí";
      else return "No";
    },
    srcConstructor(i) {
      return `http://localhost:8080/api/pisos/${this.piso.idPiso}/imagenes/${i.idImagen}`;
    },
    async gestionarFavs() {
      if (!this.isFav) {
        let u = await userRepository.hacerFavorito(this.user.id, { idPiso: this.piso.idPiso });
        this.user.favoritos = u.favoritos;
      } else {
        let u = await userRepository.quitarFavorito(this.user.id, this.piso.idPiso);
        this.user.favoritos = u.favoritos;
      }
    },
  },
};
</script>

<style scoped>
#disponible {
  color: white;
  padding: 0.5em 1em;
  border-radius: 5px;
  border: none;
  display: block;
  text-align: center;
}
.borde {
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 0.5em 1em;
}
</style>
