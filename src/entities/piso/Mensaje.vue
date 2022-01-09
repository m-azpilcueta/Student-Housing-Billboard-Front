<template>
  <div>
    <div class="d-flex align-start">
      <v-icon size="40" class="mr-1">mdi-account-circle</v-icon>
      <div class="d-flex flex-column">
        <span
          ><b>{{ mensaje.usuario.nombre }}</b> pregunta:</span
        >
        <span>{{ mensaje.texto }}</span>
        <div v-if="isAdmin || isAutorPregunta(mensaje)" class="d-flex">
          <span @click="cambiarModifPregunta" class="editar mr-2 pointer"><u>Editar</u></span>
          <span @click="borrarMensaje(mensaje.id)" class="eliminar pointer"><u>Eliminar</u></span>
        </div>
      </div>
    </div>
    <div v-if="modifPregunta" class="mt-2 mb-2 d-flex">
      <input v-model="mensaje.texto" class="texto-pregunta" placeholder="Escribe una pregunta" />
      <v-btn color="primary" @click="modificarMensaje(1, mensaje.id, mensaje.texto)" class="ml-2" :disabled="mensaje.texto.length === 0">Modificar pregunta</v-btn>
    </div>
    <div v-if="mensaje.respuesta" class="d-flex flex-column justify-center">
      <div class="d-flex flex-wrap">
        <span><b>Respuesta del anunciante: </b>{{ mensaje.respuesta.texto }}</span>
        <div v-if="isAdmin || isMismoUsuario" class="d-flex align-center">
          <span @click="cambiarModifRespuesta()" class="editar ml-2 mr-2 pointer"><u>Editar</u></span>
          <span @click="borrarMensaje(mensaje.respuesta.id)" class="eliminar pointer"><u>Eliminar</u></span>
        </div>
      </div>
      <div v-if="modifRespuesta" class="mt-2 mb-2 d-flex flex-wrap">
        <input v-model="mensaje.respuesta.texto" class="texto-pregunta" placeholder="Escribe una respuesta" />
        <v-btn color="primary" @click="modificarMensaje(2, mensaje.respuesta.id, mensaje.respuesta.texto)" class="ml-2" :disabled="mensaje.texto.length === 0"
          >Modificar respuesta</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import pisoRepository from "@/repositories/PisoRepository";
import store from "@/common/store";

export default {
  data() {
    return {
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
  },
  methods: {
    isAutorPregunta(m) {
      return this.user.id === m.usuario.id;
    },
    cambiarModifPregunta() {
      if (this.modifPregunta) this.modifPregunta = false;
      else this.modifPregunta = true;
    },
    cambiarModifRespuesta() {
      if (this.modifRespuesta) this.modifRespuesta = false;
      else this.modifRespuesta = true;
    },
    async borrarMensaje(idPregunta) {
      await pisoRepository.borrarPregunta(this.piso.idPiso, idPregunta);
      this.mensaje.respuesta = null;
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
