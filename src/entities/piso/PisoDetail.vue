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
            <span id="disponible" :class="colorDisponible">{{ setDisponible }}</span>
            <v-icon @click="gestionarFavs()" size="35" class="pointer ml-2" v-if="isLogged & isDisponible & !isMismoUsuario & !isAdmin" color="red darken-2">{{
              favSelector
            }}</v-icon>
          </div>
          <div class="d-flex align-center mb-4 mt-4 borde">
            <div class="d-flex flex-column mr-5">
              <v-icon size="50">mdi-account-circle</v-icon>
              <span
                ><b>{{ piso.anunciante.nombre }}</b></span
              >
            </div>
            <div class="d-flex flex-column">
              <div class="d-flex">
                <v-icon size="20" class="mr-1">mdi-email</v-icon>
                <span>{{ piso.anunciante.email }}</span>
              </div>
              <div class="d-flex">
                <v-icon size="20" class="mr-1">mdi-phone</v-icon>
                <span>{{ piso.anunciante.telefonoContacto }}</span>
              </div>
              <div class="d-flex">
                <v-icon size="20" class="mr-1">mdi-book</v-icon>
                <span>{{ piso.anunciante.estudio.nombreEstudio }}</span>
              </div>
              <div class="d-flex">
                <v-icon size="20" class="mr-1">mdi-home-modern</v-icon>
                <span>{{ piso.anunciante.estudio.universidad.nombreUniversidad }}</span>
              </div>
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
        <div v-if="mensajes.length === 0" class="d-flex justify-center align-center mt-2 mb-4">
          <span>Nadie ha realizado preguntas todavía.</span>
          <span v-if="!isLogged" class="ml-1">Debes iniciar sesión para realizar preguntas.</span>
        </div>
        <div v-for="m in mensajes" :key="m.id" class="d-flex flex-column">
          <Mensaje :mensaje="m" :piso="piso"></Mensaje>
          <div v-if="isLogged & isMismoUsuario & !m.respuesta" class="d-flex align-center mt-2 mb-4">
            <input v-model="nuevaRespuesta" class="texto-pregunta" placeholder="Escribe una respuesta" />
            <v-btn color="primary" @click="responder(m.id)" class="ml-2" :disabled="nuevaRespuesta.length === 0">Publicar respuesta</v-btn>
          </div>
        </div>
        <div v-if="isLogged & !isMismoUsuario & !isAdmin" class="d-flex align-center mt-2 mb-4">
          <input v-model="nuevaPregunta" class="texto-pregunta" placeholder="Escribe una pregunta" />
          <v-btn color="primary" @click="preguntar()" class="ml-2" :disabled="nuevaPregunta.length === 0">Publicar pregunta</v-btn>
        </div>
      </div>
      <div v-if="isAdmin" class="d-flex mt-1">
        <v-btn color="red darken-2" class="error mt-2 flex-grow-1" @click="borrarPiso()">Eliminar piso</v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import moment from "moment";
import pisoRepository from "@/repositories/PisoRepository";
import store from "@/common/store";
import userRepository from "@/repositories/UserRepository";
import Mensaje from "@/entities/piso/Mensaje";

export default {
  components: { Mensaje },
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
    colorDisponible() {
      if (this.piso.disponible) return "primary flex-grow-1";
      else return "red darken-2 flex-grow-1";
    },
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
    isAutorPregunta(m) {
      return this.user.id === m.usuario.id;
    },
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
      let x = await pisoRepository.responder(this.piso.idPiso, idPregunta, { texto: this.nuevaRespuesta });
      this.mensajes = x.mensajes;
      this.nuevaRespuesta = "";
    },
    async borrarPiso() {
      try {
        await pisoRepository.borrarPiso(this.piso.idPiso);
        await this.$router.replace({
          name: "PisoList",
        });
      } catch (e) {
        this.$notify({
          text: e.response.data.message,
          type: "error",
        });
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
.texto-pregunta {
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 0.2em 0.5em;
  flex-grow: 1;
}
</style>
