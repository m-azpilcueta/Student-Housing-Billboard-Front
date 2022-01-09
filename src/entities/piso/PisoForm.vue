<template>
  <v-container class="mt-3 mb-5">
    <v-form ref="form" @submit.prevent="save">
      <v-card>
        <v-row>
          <v-col :cols="dataCols">
            <v-card-title>{{ setPageName }}</v-card-title>
            <v-card-text>
              <v-text-field v-model="piso.nombre" label="Título del piso" :rules="requiredField"></v-text-field>
              <v-row>
                <v-col cols="3">
                  <v-text-field v-model="piso.importe" label="Importe" prefix="€" :rules="requiredField"></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-text-field v-model="piso.superficie" label="Superficie" :rules="requiredField"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-select v-model="piso.habitaciones" :items="items" label="Nº habitaciones" :rules="requiredField"></v-select>
                </v-col>
                <v-col cols="3">
                  <v-select v-model="piso.personas" :items="items" label="Nº personas" :rules="requiredField"></v-select>
                </v-col>
              </v-row>
              <div class="d-flex align-center">
                <span class="radio-text mr-4">Amueblado:</span>
                <v-radio-group v-model="piso.amueblado" row mandatory>
                  <v-radio label="Sí" :value="true"></v-radio>
                  <v-radio label="No" :value="false"></v-radio>
                </v-radio-group>
              </div>
              <v-text-field v-model="piso.calle" label="Calle" :rules="requiredField"></v-text-field>
              <v-row>
                <v-col cols="4">
                  <v-text-field v-model="piso.numero" label="Número/Portal" :rules="requiredField"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="piso.pisoLetra" label="Letra" :rules="requiredField"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="piso.codigoPostal" label="Código postal" :rules="requiredField"></v-text-field>
                </v-col>
              </v-row>
              <v-select v-model="piso.provincia" label="Provincia" :items="provincias" :rules="requiredField"></v-select>
              <v-select v-model="piso.localidad" label="Localidad" :items="localidades" :rules="requiredField"></v-select>
              <v-textarea counter v-model="piso.descripcion" label="Decripción" rows="7" :rules="bodyRules"></v-textarea>
              <div class="d-flex align-center">
                <span class="mr-4 radio-text">Disponible:</span>
                <v-radio-group v-model="piso.disponible" row mandatory>
                  <v-radio label="Sí" :value="true"></v-radio>
                  <v-radio label="No" :value="false"></v-radio>
                </v-radio-group>
              </div>
            </v-card-text>
            <div class="d-flex justify-center mb-4">
              <v-btn @click="back()" class="mr-2">Cancelar</v-btn>
              <v-btn class="ml-2" color="primary" type="submit">Publicar</v-btn>
            </div>
          </v-col>
          <v-col v-if="isEdit" cols="6">
            <v-card-title>Añadir imágenes</v-card-title>
            <div class="ml-4 mb-4">
              <v-img :src="portada" width="350"></v-img>
            </div>
            <v-row v-if="imagenes.length > 0" class="pl-4 pr-4">
              <v-col cols="3" v-for="i in imagenes" :key="i.id" class="d-flex flex-column justify-center">
                <v-img class="pointer" @click="setPortada(i)" :src="fotoCargada(i)" height="75"></v-img>
                <v-icon @click="borrarImagen(i)" color="red darken-2" class="mt-1 pointer">mdi-delete</v-icon>
              </v-col>
            </v-row>
            <div class="d-flex align-center">
              <input @change="guardarImagen()" type="file" ref="hidImagen" class="d-none" />
              <v-btn @click="cargarImagen()" color="primary" class="ml-4 mr-4 mt-4">Adjuntar imagen</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
import pisoRepository from "@/repositories/PisoRepository";
import localidadRepository from "@/repositories/LocalidadRepository";
import provinciaRepository from "@/repositories/ProvinciaRepository";

export default {
  data() {
    return {
      piso: {},
      portada: require("@/assets/placeholder.png"),
      imagenes: [],
      requiredField: [(v) => !!v || "Este campo es obligatorio"],
      items: [
        { text: "1", value: 1 },
        { text: "2", value: 2 },
        { text: "3", value: 3 },
        { text: "4", value: 4 },
        { text: "5", value: 5 },
        { text: "6 o más", value: 6 },
      ],
      provincias: [],
      localidades: [],
    };
  },
  name: "PisoForm",
  computed: {
    isEdit() {
      return this.$route.params.id;
    },
    dataCols() {
      if (!this.isEdit) return 12;
      else return 6;
    },
    setPageName() {
      if (this.isEdit) return "Editar piso";
      else return "Publicar piso";
    },
    bodyRules() {
      const reglas = [(v) => !!v || "Este campo es obligatorio", (v) => (v || "").length <= 500 || `El número máximo de caracteres es 500`];
      return reglas;
    },
  },
  mounted() {
    this.cargarPiso();
  },
  methods: {
    cargarImagen() {
      this.$refs.hidImagen.click();
    },
    async guardarImagen() {
      await pisoRepository
        .subirImagen(this.$route.params.id, this.$refs.hidImagen.files[0])
        .then(async () => (this.imagenes = await pisoRepository.cargarImagenes(this.$route.params.id)))
        .catch((err) => {
          this.$notify({
            text: err.response.data.message,
            type: "error",
          });
        });
    },
    fotoCargada(i) {
      return `http://localhost:8080/api/pisos/${this.piso.idPiso}/imagenes/${i.idImagen}`;
    },
    async cargarPiso() {
      this.localidades = await localidadRepository.cargarLocalidades();
      this.provincias = await provinciaRepository.cargarProvincias();
      if (this.isEdit) {
        this.piso = await pisoRepository.findById(this.$route.params.id);
        this.imagenes = this.piso.imagenes;
        this.imagenes.forEach((i) => {
          if (i.portada === true) this.portada = `http://localhost:8080/api/pisos/${this.piso.idPiso}/imagenes/${i.idImagen}`;
        });
      }
    },
    async setPortada(i) {
      await pisoRepository
        .ponerPortada(this.piso.idPiso, i.idImagen, {
          idPiso: this.piso.idPiso,
          idImagen: i.idImagen,
          portada: true,
        })
        .then(async () => (this.imagenes = await pisoRepository.cargarImagenes(this.$route.params.id)));
      this.portada = `http://localhost:8080/api/pisos/${this.piso.idPiso}/imagenes/${i.idImagen}`;
    },
    async borrarImagen(i) {
      await pisoRepository
        .borrarImagen(this.piso.idPiso, i.idImagen)
        .then(async () => {
          if (i.portada) this.portada = require("@/assets/placeholder.png");
          this.imagenes = await pisoRepository.cargarImagenes(this.$route.params.id);
        })
        .catch((err) => {
          this.$notify({
            text: err.response.data.message,
            type: "error",
          });
        });
    },
    back() {
      this.$router.go(-1);
    },
    async save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      try {
        let pisocopia = JSON.parse(JSON.stringify(this.piso));
        pisocopia.imagenes = [];
        await pisoRepository.publicar(pisocopia).then(
          async (pisoPublicado) =>
            await this.$router.replace({
              name: "PisoDetail",
              params: { id: pisoPublicado.data.idPiso },
            })
        );
      } catch (err) {
        this.$notify({
          text: err.response.data.message,
          type: "error",
        });
      }
    },
  },
};
</script>

<style scoped>
.radio-text {
  font-size: 16px;
}
</style>
