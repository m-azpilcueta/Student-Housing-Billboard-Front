<template>
  <v-container>
    <v-card class="mx-auto my-5" max-width="800">
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

    <h2 class="font-weight-regular">Lista de Pisos publicados</h2>
    <v-col cols="12" sm="6" md="8" v-if="pisos.length === 0" class="d-flex align-center justify-center">
      <span>No se han encontrado pisos.</span>
    </v-col>

    <v-col cols="12" sm="6" md="4" v-for="piso in pisos" :key="piso.idPiso">
      <PisoCard :piso="piso"></PisoCard>
    </v-col>
  </v-container>
</template>

<script>
import UserRepository from "@/repositories/UserRepository";
import PisoCard from "@/entities/piso/PisoCard";

export default {
  name: "UserProfile",
  data() {
    return {
      user: {},
      pisos: [],
    };
  },
  components: { PisoCard },
  async mounted() {
    this.user = await UserRepository.findOne(this.$route.params.id);
    this.pisos = await UserRepository.findAllPisosByAnunciante(this.$route.params.id);
  },
};
</script>
