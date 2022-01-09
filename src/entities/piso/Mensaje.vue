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
          <span class="editar mr-2 pointer"><u>Editar</u></span>
          <span @click="borrarMensaje(mensaje.id)" class="eliminar pointer"><u>Eliminar</u></span>
        </div>
      </div>
    </div>
    <div v-if="mensaje.respuesta" class="d-flex">
      <span><b>Respuesta del anunciante: </b>{{ mensaje.respuesta.texto }}</span>
      <div v-if="isAdmin || isMismoUsuario" class="d-flex">
        <span class="editar ml-2 mr-2 pointer"><u>Editar</u></span>
        <span @click="borrarMensaje(mensaje.respuesta.id)" class="eliminar pointer"><u>Eliminar</u></span>
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
    isAutorPregunta(m) {
      return this.user.id === m.usuario.id;
    },
    async borrarMensaje(idPregunta) {
      await pisoRepository.borrarPregunta(this.piso.idPiso, idPregunta);
      this.mensaje.respuesta = null;
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
