<template>
  <v-container v-if="piso">
    <v-card class="mt-3 mb-5 pl-5 pr-5 pb-5">
      <v-row class="pt-5 pb-5">
        <v-col cols="6">
          <v-img v-if="imagenes.length === 0" :src="portada" height="350"></v-img>
          <v-carousel v-if="imagenes.length > 0" height="350">
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
      <div class="borde">
        <span><b>Preguntas y respuestas</b></span>
        <div v-if="mensajes.length == 0" class="d-flex justify-center align-center mt-2 mb-4">
          <span>Nadie ha realizado preguntas todavía.</span>
          <span v-if="!isLogged" class="ml-1">Debes iniciar sesión para realizar preguntas.</span>
        </div>
        <div v-for="m in mensajes" :key="m.id" class="d-flex flex-column">
          <div class="d-flex align-start">
            <v-icon size="40" class="mr-1">mdi-account-circle</v-icon>
            <div class="d-flex flex-column">
              <span
                ><b>{{ m.usuario.nombre }}</b> pregunta:</span
              >
              <span>{{ m.texto }}</span>
            </div>
          </div>
          <span v-if="m.respuesta"><b>Respuesta del anunciante: </b>{{ m.respuesta.texto }}</span>
          <div v-if="isLogged & isMismoUsuario & !m.respuesta" class="d-flex align-center mt-2 mb-4">
            <input v-model="nuevaRespuesta" class="texto-pregunta" placeholder="Escribe una respuesta" />
            <v-btn @click="responder(m.id)" class="ml-2" :disabled="nuevaRespuesta.length === 0">Publicar respuesta</v-btn>
          </div>
        </div>
        <div v-if="isLogged & !isMismoUsuario" class="d-flex align-center mt-2 mb-4">
          <input v-model="nuevaPregunta" class="texto-pregunta" placeholder="Escribe una pregunta" />
          <v-btn @click="preguntar()" class="ml-2" :disabled="nuevaPregunta.length === 0">Publicar pregunta</v-btn>
        </div>
      </div>
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
      mensajes: [],
      nuevaPregunta: "",
      nuevaRespuesta: "",
    };
  },
  name: "PisoDetail",
  created() {
    this.cargarPiso().then(() => {
      if (this.piso.imagenes.length > 0) {
        this.imagenes = this.piso.imagenes;
      }
      if (this.piso.mensajes.length > 0) {
        this.mensajes = this.piso.mensajes;
        this.mensajes.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
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
    isAdmin() {
      return this.user.authority === "ADMIN";
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
    async preguntar() {
      let m = await pisoRepository.hacerPregunta(this.piso.idPiso, { texto: this.nuevaPregunta });
      this.mensajes = m.mensajes;
      this.nuevaPregunta = "";
    },
    async responder(idPregunta) {
      let m = await pisoRepository.responder(this.piso.idPiso, idPregunta, { texto: this.nuevaRespuesta });
      this.mensajes = m.mensajes;
      this.nuevaRespuesta = "";
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
.texto-pregunta {
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 0.2em 0.5em;
  flex-grow: 1;
}
</style>
