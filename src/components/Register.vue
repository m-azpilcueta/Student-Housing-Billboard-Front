<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md6>
      <v-form ref="form" @submit.prevent="userRegister">
        <v-card class="mx-auto my-10">
          <v-card-text>
            <v-text-field v-model="user.nombre" label="Nombre" name="nombre" prepend-icon="mdi-account" type="text" :rules="requiredField"></v-text-field>
            <v-text-field v-model="user.login" label="Login" name="login" prepend-icon="mdi-account-circle" type="text" :rules="requiredField"></v-text-field>
            <v-text-field v-model="user.password" label="Contraseña" name="password" prepend-icon="lock" type="password" :rules="requiredField"></v-text-field>
            <v-text-field v-model="user.email" label="Email" name="email" prepend-icon="mdi-email " type="text" :rules="requiredField"></v-text-field>
            <v-text-field
              v-model="user.telefonoContacto"
              label="Telefono de Contacto"
              name="telefono"
              prepend-icon="mdi-cellphone"
              type="text"
              :rules="requiredField"
            ></v-text-field>
            <v-select
              v-model="universidad"
              :items="universidades"
              item-text="nombreUniversidad"
              prepend-icon="mdi-home-modern"
              return-object
              label="Universidad"
              type="text"
              :rules="requiredField"
            ></v-select>
            <!--
            <v-autocomplete clearable @click="cargarEstudiosByUniversidad" :disabled="comprobarUniversidad" v-model="estudioPrueba" :items="filtrados" item-text="nombreEstudio" prepend-icon="mdi-book" return-object label="Estudio escrito" placeholder="Empieza a escribir para buscar" type="text" :rules="requiredField"> </v-autocomplete>
            -->
            <v-combobox
              v-model="user.estudio"
              clearable
              @click="cargarEstudiosByUniversidad"
              :disabled="comprobarUniversidad"
              :items="filtrados"
              item-text="nombreEstudio"
              prepend-icon="mdi-book"
              return-object
              label="Estudio escrito"
              placeholder="Empieza a escribir para buscar"
              type="text"
              :rules="requiredField"
            >
            </v-combobox>
          </v-card-text>

          <v-card-actions>
            <v-btn color="error" @click="back()"> Cancelar <v-icon right dark> mdi-close-circle-outline </v-icon></v-btn>
            <v-spacer />
            <v-btn type="submit" color="primary"> Registrar <v-icon right dark> mdi-check-circle-outline </v-icon></v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import UniversidadRepository from "@/repositories/UniversidadRepository";
import AccountRepository from "@/repositories/AccountRepository";
import EstudioRepository from "@/repositories/EstudioRepository";

export default {
  data() {
    return {
      user: {
        estudio: {},
      },
      universidad: null,
      universidades: [],
      estudioPrueba: {
        nombreEstudio: null,
        universidad: {
          idUniversidad: null,
        },
      },
      filtrados: [],
      requiredField: [(v) => !!v || "Field is required"],
    };
  },
  computed: {
    comprobarUniversidad() {
      return this.universidad === null;
    },
  },
  async created() {
    this.universidades = await UniversidadRepository.findAllUniversidades();
  },
  methods: {
    async cargarEstudiosByUniversidad() {
      this.filtrados = await UniversidadRepository.findAllEstudiosByUniversidad(this.universidad.idUniversidad);
    },
    async userRegister() {
      if (!this.$refs.form.validate()) {
        return;
      }
      if (!this.filtrados.includes(this.user.estudio)) {
        this.estudioPrueba.nombreEstudio = this.user.estudio;
        this.estudioPrueba.universidad.idUniversidad = this.universidad.idUniversidad;
        await EstudioRepository.crearEstudio(this.estudioPrueba).then(async () => this.cargarEstudiosByUniversidad());
      }
      try {
        await AccountRepository.registerAccount(this.user);
        this.$router.replace({
          name: "Login",
        });
      } catch (err) {
        this.$notify({
          text: err.response.data.message,
          type: "error",
        });
      }
    },
    back() {
      this.$router.go(-1);
    },
  },
};
</script>
