<template>
  <v-layout align-center justify-center class="mb-5 mt-5">
    <v-flex xs12 sm8 md6>
      <v-form ref="form" @submit.prevent="userRegister">
        <v-card class="pa-4">
          <v-card-title>{{ cambiarBotonRegistrarEditar }} usuario</v-card-title>
          <v-card-text>
            <v-text-field v-model="user.nombre" label="Nombre" name="nombre" prepend-icon="mdi-account" type="text" :rules="requiredField"></v-text-field>
            <v-text-field v-model="user.login" label="Login" name="login" prepend-icon="mdi-account-circle" type="text" :rules="requiredField"></v-text-field>
            <v-text-field v-model="user.password" label="Contraseña" name="password" prepend-icon="lock" type="password" :rules="requiredField"></v-text-field>
            <v-text-field v-model="user.email" label="Email" name="email" prepend-icon="mdi-email " type="text" :rules="requiredField"></v-text-field>
            <v-text-field
              v-model="user.telefonoContacto"
              label="Teléfono de contacto"
              name="telefono"
              prepend-icon="mdi-cellphone"
              type="text"
              :rules="requiredField"
            ></v-text-field>
            <v-select
              @change="cargarEstudiosByUniversidad()"
              v-model="user.universidad"
              :items="universidades"
              item-text="nombreUniversidad"
              prepend-icon="mdi-home-modern"
              return-object
              label="Universidad"
              type="text"
              :rules="requiredField"
            ></v-select>
            <v-combobox
              v-model="user.estudio"
              :items="filtrados"
              prepend-icon="mdi-book"
              label="Estudio"
              return-object
              item-text="nombreEstudio"
              item-value="nombreEstudio"
              :disabled="estudioDisabled"
              clearable
              persistent-hint
              hint="Escribe el estudio y pulsa 'Enter' en el teclado para crearlo si no existe. Posteriormente, selecciónalo."
              @keyup.enter="crearEstudio()"
            >
            </v-combobox>
          </v-card-text>

          <v-card-actions class="d-flex justify-space-around">
            <v-btn color="error" @click="back()"> Cancelar <v-icon right dark> mdi-close-circle-outline </v-icon></v-btn>
            <v-btn type="submit" color="primary"> {{ cambiarBotonRegistrarEditar }} <v-icon right dark> mdi-check-circle-outline </v-icon></v-btn>
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
import UserRepository from "@/repositories/UserRepository";

export default {
  data() {
    return {
      estudioDisabled: true,
      user: {},
      universidades: [],
      filtrados: [],
      requiredField: [(v) => !!v || "Este campo es obligatorio"],
    };
  },
  computed: {
    cambiarBotonRegistrarEditar() {
      if (this.$route.params.id) {
        return "Editar";
      } else {
        return "Registrar";
      }
    },
  },
  async created() {
    this.universidades = await UniversidadRepository.findAllUniversidades();

    if (this.$route.params.id) {
      this.user = await UserRepository.findOne(this.$route.params.id);
    } else {
      this.user = {};
    }
  },
  methods: {
    async cargarEstudiosByUniversidad() {
      this.filtrados = await UniversidadRepository.findAllEstudiosByUniversidad(this.user.universidad.idUniversidad);
      this.estudioDisabled = false;
    },
    async crearEstudio() {
      await EstudioRepository.crearEstudio({
        nombreEstudio: this.user.estudio,
        universidad: this.user.universidad,
      })
        .then(async () => (this.filtrados = await UniversidadRepository.findAllEstudiosByUniversidad(this.user.universidad.idUniversidad)))
        .catch((err) => {
          this.$notify({
            text: err.response.data.message,
            type: "error",
          });
        });
    },
    async userRegister() {
      if (!this.$refs.form.validate()) {
        return;
      }
      try {
        await AccountRepository.registerAccount(this.user);
        if (this.$route.params.id) {
          this.back();
        } else {
          await this.$router.replace({
            name: "Login",
          });
        }
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
