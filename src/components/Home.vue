<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="piso in pisos" :key="piso.id">
        <PisoCard :piso="piso"></PisoCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PisoCard from "@/entities/piso/PisoCard";
import PisoRepository from "@/repositories/PisoRepository";
export default {
  data() {
    return {
      pisos: [],
    };
  },
  mounted() {
    this.cargarPisos();
  },
  components: { PisoCard },
  methods: {
    async cargarPisos() {
      this.pisos = await PisoRepository.findAll();
    },
  },
};
</script>
