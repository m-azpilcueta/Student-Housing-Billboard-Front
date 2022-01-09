<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="d-flex align-center pl-5 pr-5">
          <v-icon>mdi-sort</v-icon>
          <v-card-title>Ordenar por:</v-card-title>
          <v-select :items="ordenacion" @input="cargarPisosFiltrados()" v-model="sort" item-value="value" placeholder="Seleccionar ordenación"></v-select>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="pl-4 pr-4 pb-5">
          <div class="d-flex">
            <v-icon>mdi-filter</v-icon>
            <v-card-title>Filtrar por:</v-card-title>
          </div>
          <v-select
            @change="estudioItems()"
            v-model="filtros.universidad"
            :items="universidades"
            item-text="nombreUniversidad"
            item-value="idUniversidad"
            class="pr-4 pl-4"
            label="Universidad"
          ></v-select>
          <v-select
            v-model="filtros.estudio"
            :items="estudios"
            item-text="nombreEstudio"
            item-value="idEstudio"
            :disabled="habilitarEstudios"
            class="pr-4 pl-4"
            label="Estudios"
          ></v-select>
          <v-select v-model="filtros.provincia" :items="provincias" class="pr-4 pl-4" label="Provincia"></v-select>
          <v-select v-model="filtros.localidad" :items="localidades" class="pr-4 pl-4" label="Localidad"></v-select>
          <v-select v-model="filtros.habitaciones" class="pr-4 pl-4" label="Nº de habitaciones" :items="items"></v-select>
          <v-select v-model="filtros.personas" class="pr-4 pl-4" label="Nº de personas" :items="items"></v-select>
          <v-card-subtitle class="radio-text pb-2">Importe mensual:</v-card-subtitle>
          <div class="d-flex pr-4 pl-4 justify-space-between flex-nowrap">
            <v-text-field v-model="filtros.min" class="mr-1" label="Mínimo" prefix="€"></v-text-field>
            <v-text-field v-model="filtros.max" class="ml-1" label="Máximo" prefix="€"></v-text-field>
          </div>
          <v-card-subtitle class="radio-text pb-0">Disponibilidad:</v-card-subtitle>
          <v-checkbox class="pr-4 pl-4" v-model="filtros.disp" label="Disponible"></v-checkbox>
          <v-checkbox class="pr-4 pl-4 mt-0" v-model="filtros.nodisp" label="No disponible"></v-checkbox>
          <div class="d-flex justify-center align-center flex-nowrap">
            <v-btn color="primary" class="mr-1" @click="aplicarFiltros()">Aplicar filtros</v-btn>
            <v-btn @click="resetFiltros()" class="ml-1">Resetear filtros</v-btn>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="8" v-if="pisos.length === 0" class="d-flex align-center justify-center">
        <span>No se han encontrado pisos.</span>
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
import localidadRepository from "@/repositories/LocalidadRepository";
import provinciaRepository from "@/repositories/ProvinciaRepository";
import universidadRepository from "@/repositories/UniversidadRepository";

const ordenacion = [
  { text: "Fecha de publicación (descendente)", value: "MAS_RECIENTE" },
  { text: "Fecha de publicación (ascendente)", value: "MENOS_RECIENTE" },
  { text: "Importe mensual (mayor a menor)", value: "IMPORTE_DESCENDENTE" },
  { text: "Importe mensual (menor a mayor)", value: "IMPORTE_ASCENDENTE" },
];

const items = [
  { text: "1", value: 1 },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 },
  { text: "5", value: 5 },
  { text: "6 o más", value: 6 },
];
export default {
  data() {
    return {
      pisos: [],
      localidades: [],
      provincias: [],
      universidades: [],
      estudios: [],
      ordenacion,
      sort: ordenacion[0].value,
      query: "",
      items,
      filtros: {
        universidad: null,
        estudio: null,
        provincia: null,
        localidad: null,
        habitaciones: null,
        personas: null,
        max: null,
        min: null,
        disp: null,
        nodisp: null,
      },
    };
  },
  computed: {
    habilitarEstudios() {
      return this.filtros.universidad == null;
    },
  },
  mounted() {
    this.cargarDatos();
    this.cargarPisosFiltrados();
  },
  components: { PisoCard },
  methods: {
    async cargarPisosFiltrados() {
      this.pisos = await PisoRepository.findAll(this.query, this.sort).catch((err) => {
        this.$notify({
          text: err.response.data.message,
          type: "error",
        });
      });
    },
    async aplicarFiltros() {
      this.query = "";
      if (this.filtros.universidad) this.query += `anunciante.estudio.universidad.idUniversidad = ${this.filtros.universidad} and `;
      if (this.filtros.estudio) this.query += `anunciante.estudio.idEstudio = ${this.filtros.estudio} and `;
      if (this.filtros.provincia) this.query += `provincia = '${this.filtros.provincia}' and `;
      if (this.filtros.localidad) this.query += `localidad = '${this.filtros.localidad}' and `;
      if (this.filtros.habitaciones) this.query += `habitaciones = ${this.filtros.habitaciones} and `;
      if (this.filtros.personas) this.query += `personas = ${this.filtros.personas} and `;
      if (this.filtros.min) this.query += `importe >= ${this.filtros.min} and `;
      if (this.filtros.max) this.query += `importe <= ${this.filtros.max} and `;
      if (this.filtros.disp) this.query += `disponible is true and `;
      if (this.filtros.nodisp) this.query += `disponible is false`;
      if (this.query.slice(-4) === "and ") this.query = this.query.substr(0, this.query.length - 5);
      await this.cargarPisosFiltrados();
    },
    async cargarDatos() {
      this.localidades = await localidadRepository.cargarLocalidades();
      this.provincias = await provinciaRepository.cargarProvincias();
      this.universidades = await universidadRepository.findAllUniversidades();
    },
    async estudioItems() {
      this.estudios = await universidadRepository.findAllEstudiosByUniversidad(this.filtros.universidad);
    },
    async resetFiltros() {
      Object.keys(this.filtros).forEach((key) => {
        this.filtros[key] = null;
      });
    },
  },
};
</script>

<style scoped>
.radio-text {
  font-size: 16px;
}
</style>
