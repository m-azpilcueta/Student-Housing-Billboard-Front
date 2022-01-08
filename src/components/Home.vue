<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="d-flex align-start">
          <v-card-title class="mr-2">Ordenar por:</v-card-title>
          <v-select :items="ordenacion" @input="cargarPisosFiltrados()" v-model="sort" item-value="value" class="mr-5" placeholder="Seleccionar ordenación"></v-select>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card>
          <v-card-title>Filtrar por:</v-card-title>
          <v-select class="pr-4 pl-4" label="Universidad"></v-select>
          <v-select class="pr-4 pl-4" label="Estudios"></v-select>
          <v-card-subtitle>Provincia</v-card-subtitle>
          <v-card-subtitle>Localidad</v-card-subtitle>
          <v-card-subtitle>Nº de habitaciones</v-card-subtitle>
          <v-card-subtitle>Nº de personas</v-card-subtitle>
          <v-card-subtitle>Importe mensual</v-card-subtitle>
          <v-card-subtitle>Disponibilidad</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="8" v-if="pisos.length === 0" class="d-flex align-center justify-center">
        <span>Todavía no se ha publicado ningún piso.</span>
      </v-col>
      <v-col cols="12" sm="6" md="4" v-for="piso in pisos" :key="piso.idPiso">
        <PisoCard :piso="piso"></PisoCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PisoCard from "@/entities/piso/PisoCard";
import PisoRepository from "@/repositories/PisoRepository";
const ordenacion = [
  { text: "Fecha de publicación (descendente)", value: "MAS_RECIENTE" },
  { text: "Fecha de publicación (ascendente)", value: "MENOS_RECIENTE" },
  { text: "Importe mensual (mayor a menor)", value: "IMPORTE_DESCENDENTE" },
  { text: "Importe mensual (menor a mayor)", value: "IMPORTE_ASCENDENTE" },
];
export default {
  data() {
    return {
      pisos: [],
      ordenacion,
      sort: ordenacion[0].value,
    };
  },
  mounted() {
    this.cargarPisosFiltrados();
  },
  components: { PisoCard },
  methods: {
    async cargarPisosFiltrados() {
      this.pisos = await PisoRepository.findAll(this.sort);
    },
  },
};
</script>

<style scoped></style>
