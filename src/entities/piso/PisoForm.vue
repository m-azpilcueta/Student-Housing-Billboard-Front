<template>
  <v-container class="d-flex justify-center text-center">
    <v-form ref="form" @submit.prevent="save">
      <v-card class="pa-4">
        <v-card-title>Publicar piso</v-card-title>
        <v-card-text>
          <v-text-field v-model="piso.nombre" :rules="requiredField" label="Título del anuncio"></v-text-field>
          <div class="d-flex justify-space-between flex-wrap">
            <v-text-field v-model="piso.importe" class="mr-4" :rules="requiredField" label="Importe" prefix="€"></v-text-field>
            <v-text-field v-model="piso.superficie" :rules="requiredField" label="Superficie"></v-text-field>
          </div>
          <div class="d-flex justify-space-between flex-wrap">
            <v-select v-model="piso.habitaciones" :rules="requiredField" class="mr-4" :items="items" item-text="text" item-value="value" label="Número de habitaciones"></v-select>
            <v-select v-model="piso.personas" :rules="requiredField" :items="items" item-text="text" item-value="value" label="Número de personas"></v-select>
          </div>
          <div class="d-flex align-center flex-wrap">
            <span id="amueblado" class="mr-4">Amueblado</span>
            <v-radio-group v-model="piso.amueblado" :rules="requiredField" row>
              <v-radio label="Sí" value="true"></v-radio>
              <v-radio label="No" value="false"></v-radio>
            </v-radio-group>
          </div>
          <v-text-field v-model="piso.calle" :rules="requiredField" label="Calle"></v-text-field>
          <div class="d-flex justify-space-between flex-wrap">
            <v-text-field v-model="piso.numero" :rules="requiredField" class="mr-4" label="Portal/Puerta"></v-text-field>
            <v-text-field v-model="piso.pisoLetra" :rules="requiredField" class="mr-4" label="Letra"></v-text-field>
            <v-text-field v-model="piso.codigoPostal" :rules="requiredField" class="mr-4" label="Código Postal"></v-text-field>
          </div>
          <v-select v-model="piso.provincia" :rules="requiredField" label="Provincia" :items="provincias"></v-select>
          <v-select v-model="piso.localidad" :rules="requiredField" label="Localidad" :items="localidades"></v-select>
          <v-textarea v-model="piso.descripcion" :rules="requiredField" label="Descripción"></v-textarea>
          <div class="d-flex align-center flex-wrap">
            <span id="disponible" class="mr-4">Disponible</span>
            <v-radio-group v-model="piso.disponible" :rules="requiredField" row>
              <v-radio label="Sí" value="true"></v-radio>
              <v-radio label="No" value="false"></v-radio>
            </v-radio-group>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn>Cancelar</v-btn>
          <v-btn color="primary" type="submit">Publicar</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
import provinciaRepository from "@/repositories/ProvinciaRepository";
import localidadRepository from "@/repositories/LocalidadRepository";
import pisoRepository from "@/repositories/PisoRepository";

export default {
  name: "PisoForm",
  data() {
    return {
      piso: {},
      requiredField: [(v) => !!v || "Campo obligatorio"],
      provincias: [],
      localidades: [],
      items: [
        { text: "1", value: 1 },
        { text: "2", value: 2 },
        { text: "3", value: 3 },
        { text: "4", value: 4 },
        { text: "5", value: 5 },
        { text: "6 o más", value: 6 },
      ],
    };
  },
  created() {
    this.cargarZonas();
  },
  methods: {
    async cargarZonas() {
      this.provincias = await provinciaRepository.cargarProvincias();
      this.localidades = await localidadRepository.cargarLocalidades();
    },
    async save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      try {
        await pisoRepository.publicar(this.piso);
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
.v-form {
  width: 100%;
  max-width: 650px;
}
#amueblado,
#disponible {
  font-size: 16px;
}
</style>
