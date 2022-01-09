<template>
  <div v-if="pregunta">
    <div class="d-flex align-start">
      <v-icon size="40" class="mr-1">mdi-account-circle</v-icon>
      <div class="d-flex flex-column">
        <span
          ><b>{{ pregunta.usuario.nombre }}</b> pregunta:</span
        >
        <span>{{ pregunta.texto }}</span>
        <div v-if="isAdmin || isAutorPregunta(pregunta)" class="d-flex">
          <span @click="cambiarModifPregunta" class="editar mr-2 pointer"><u>Editar</u></span>
          <span @click="borrarMensaje(1, pregunta.id)" class="eliminar pointer"><u>Eliminar</u></span>
        </div>
      </div>
    </div>
    <div v-if="modifPregunta" class="mt-2 mb-2 d-flex">
      <input v-model="pregunta.texto" class="texto-pregunta" placeholder="Escribe una pregunta" />
      <v-btn color="primary" @click="modificarMensaje(1, pregunta.id, pregunta.texto)" class="ml-2" :disabled="pregunta.texto.length === 0">Modificar pregunta</v-btn>
    </div>
    <div v-if="pregunta.respuesta" class="d-flex flex-column justify-center">
      <div class="d-flex flex-wrap">
        <span><b>Respuesta del anunciante: </b>{{ pregunta.respuesta.texto }}</span>
        <div v-if="isAdmin || isMismoUsuario" class="d-flex align-center">
          <span @click="cambiarModifRespuesta()" class="editar ml-2 mr-2 pointer"><u>Editar</u></span>
          <span @click="borrarMensaje(2, pregunta.respuesta.id)" class="eliminar pointer"><u>Eliminar</u></span>
        </div>
      </div>
      <div v-if="modifRespuesta" class="mt-2 mb-2 d-flex flex-wrap">
        <input v-model="pregunta.respuesta.texto" class="texto-pregunta" placeholder="Escribe una respuesta" />
        <v-btn color="primary" @click="modificarMensaje(2, pregunta.respuesta.id, pregunta.respuesta.texto)" class="ml-2" :disabled="pregunta.texto.length === 0"
          >Modificar respuesta</v-btn
        >
      </div>
    </div>
    <div v-if="isLogged & isMismoUsuario & !pregunta.respuesta" class="d-flex align-center mt-2 mb-4">
      <input v-model="nuevaRespuesta" class="texto-pregunta" placeholder="Escribe una respuesta" />
      <v-btn color="primary" @click="responder(pregunta.id)" class="ml-2" :disabled="nuevaRespuesta.length === 0">Publicar respuesta</v-btn>
    </div>
  </div>
</template>

<script>
import pisoRepository from "@/repositories/PisoRepository";
import store from "@/common/store";

export default {
  data() {
    return {
      pregunta: this.mensaje,
      modifPregunta: false,
      modifRespuesta: false,
      nuevaRespuesta: "",
      user: store.state.user,
    };
  },
  name: "Mensaje",
  props: {
    mensaje: {
      type: Object,
      required: true,
    },
    piso: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isAdmin() {
      return this.user.authority === "ADMIN";
    },
    isMismoUsuario() {
      return this.user.id === this.piso.anunciante.id;
    },
    isLogged() {
      return store.state.user.logged;
    },
  },
  methods: {
    async responder(idPregunta) {
      this.pregunta = await pisoRepository.responder(this.piso.idPiso, idPregunta, { texto: this.nuevaRespuesta });
      this.nuevaRespuesta = "";
    },
    isAutorPregunta(m) {
      return this.user.id === m.usuario.id;
    },
    cambiarModifPregunta() {
      this.modifPregunta = !this.modifPregunta;
    },
    cambiarModifRespuesta() {
      this.modifRespuesta = !this.modifRespuesta;
    },
    async borrarMensaje(valor, idPregunta) {
      await pisoRepository.borrarPregunta(this.piso.idPiso, idPregunta);
      if (valor === 2) this.pregunta.respuesta = null;
      if (valor === 1) this.pregunta = null;
    },
    async modificarMensaje(valor, idMensaje, texto) {
      await pisoRepository.modificarPregunta(this.piso.idPiso, idMensaje, {
        id: idMensaje,
        texto: texto,
      });
      if (valor === 1) this.cambiarModifPregunta();
      else this.cambiarModifRespuesta();
    },
  },
};
</script>

<style scoped>
.editar {
  color: royalblue;
}
.eliminar {
  color: darkred;
}
.texto-pregunta {
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 0.2em 0.5em;
  flex-grow: 1;
}
</style>
