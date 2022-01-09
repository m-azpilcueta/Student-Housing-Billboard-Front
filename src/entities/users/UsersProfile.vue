<template>
  <v-container>
    <v-card class="mx-auto my-5" max-width="800" v-if="user">
      <div class="d-flex">
        <div class="d-flex flex-column mx-10 my-7">
          <v-icon size="150" color="light-blue">mdi-account-circle</v-icon>
        </div>
        <div class="d-flex flex-column my-10">
          <h3>{{ user.nombre }} - {{ user.login }}</h3>
          <div class="d-flex">
            <h4 class="font-weight-medium">Email</h4>
            <h4 class="font-weight-regular">: {{ user.email }}</h4>
          </div>
          <div class="d-flex">
            <h4 class="font-weight-medium">Telefono de Contacto</h4>
            <h4 class="font-weight-regular">: {{ user.telefonoContacto }}</h4>
          </div>
          <div class="d-flex">
            <h4 class="font-weight-medium">Universidad</h4>
            <h4 class="font-weight-regular">: {{ user.estudio.universidad.nombreUniversidad }}</h4>
          </div>
          <div class="d-flex">
            <h4 class="font-weight-medium">Estudio cursado actualmente</h4>
            <h4 class="font-weight-regular">: {{ user.estudio.nombreEstudio }}</h4>
          </div>
          <v-card-actions>
            <v-row align="center" justify="space-between">
              <v-btn class="white--text my-5" color="blue" :to="{ name: 'UsersUpdate' }"> Editar <v-icon right dark> mdi-pencil </v-icon></v-btn>
            </v-row>
          </v-card-actions>
        </div>
      </div>
    </v-card>

    <div class="d-flex">
      <h2 class="font-weight-regular">Lista de pisos publicados</h2>
      <v-btn class="ml-5" color="amber lighten-1" to="/pisos/new">Publicar piso <v-icon right dark> mdi-plus-circle </v-icon> </v-btn>
    </div>

    <div v-if="pisos.length === 0" class="d-flex align-center justify-center" style="margin-top: 3em">
      <h3 class="font-weight-light">No se han encontrado pisos.</h3>
    </div>

    <v-row v-if="pisos.length > 0" class="mt-5">
      <v-col cols="12" sm="6" md="4" v-for="piso in pisos" :key="piso.idPiso">
        <PisoCard :piso="piso"></PisoCard>
        <div class="d-flex justify-space-around mt-2">
          <router-link :to="{ name: 'PisoUpdate', params: { id: piso.idPiso } }" v-slot="{ navigate }" custom>
            <v-btn class="white--text flex-grow-1 mr-1" color="blue" @click="navigate"> Editar <v-icon right dark> mdi-pencil </v-icon></v-btn>
          </router-link>
          <v-btn class="error flex-grow-1 ml-1" @click="borrarPiso(piso.idPiso)">Eliminar<v-icon right dark> mdi-delete</v-icon></v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UserRepository from "@/repositories/UserRepository";
import PisoRepository from "@/repositories/PisoRepository";
import PisoCard from "@/entities/piso/PisoCard";

export default {
  name: "UsersProfile",
  data() {
    return {
      user: null,
      pisos: [],
    };
  },
  components: { PisoCard },
  async mounted() {
    this.user = await UserRepository.findOne(this.$route.params.id);
    this.pisos = await UserRepository.findAllPisosByAnunciante(this.$route.params.id);
  },
  methods: {
    async borrarPiso(idPiso) {
      await PisoRepository.borrarPiso(idPiso).then(async () => (this.pisos = await UserRepository.findAllPisosByAnunciante(this.$route.params.id)));
    },
  },
};
</script>
