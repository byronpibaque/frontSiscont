<template>
  <div style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin: auto;">
    <v-flex grow mt-4 row>
      <h3 class="text-sm-center">CAMBIAR USUARIO/CONTRASEÑA</h3>
    </v-flex>
    <v-flex grow mt-4 row style="text-align: center;">
      <div>
        <v-radio-group v-model="formUser.tipo" style="display: inline-flex;">
          <v-radio label="Usuario" value="usuario"></v-radio>
          <v-radio label="Contraseña" value="password"></v-radio>
      </v-radio-group>
      </div>
    </v-flex>

    <v-flex v-if="formUser.tipo != ''"
      grow mt-4 row style="text-align: center;width: 50%;margin-left: 25%;">
        <v-container>
          <v-layout>
            <v-flex xs12 md4>
              <v-text-field v-model.trim="formUser.campo1" :type="(formUser.tipo == 'usuario') ? 'text' : 'password'"
                :label="(formUser.tipo == 'usuario') ? 'Usuario' : 'Contraseña'" required>
              </v-text-field>
            </v-flex>

            <v-flex xs12 md4 class="ml-4">
              <v-text-field v-model.trim="formUser.campo2" :type="(formUser.tipo == 'usuario') ? 'text' : 'password'"
                :label="(formUser.tipo == 'usuario') ? 'Confirmar Usuario' : 'Confirmar Contraseña'" 
                required>
              </v-text-field>
            </v-flex>

            <v-btn :loading="loading" color="success" 
              class="mt-3 ml-4" @click="actualizar" >
              Actualizar
            </v-btn>
          </v-layout>
        </v-container>
    </v-flex>

  </div>    
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
export default {
  name: 'SetCredenciales',
  computed: {
    esGuardaAlmacen() {
      return (this.$store.state.usuario.rol == "609ed47286d0416b4a050c58");
    }
  },
  data() {
    return { 
      loading: false, 
      formUser: {
        campo1: '',
        campo2: '',
        tipo: ''
      } 
    };
  },
  methods: {
    mostrarNotificacion(title, icon){
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      Toast.fire({ icon, title })
    },
    async actualizar(){
      if ( this.formUser.campo1.length == 0 ) 
        return this.mostrarNotificacion("completa el primer campo", "warning")  
      if ( this.formUser.campo2.length == 0 ) 
        return this.mostrarNotificacion("completa el segundo campo", "warning")  
      if ( this.formUser.campo1 != this.formUser.campo2 ) 
        return this.mostrarNotificacion("Los campos no son iguales, por favor verificar", "warning")  

      try {
        this.formUser.usuario_id      = this.$store.state.usuario._id;
        this.formUser.distribuidor_id = this.$store.state.usuario.codigoDistribuidor;
        this.loading = true;

        await axios.put('/usuario/setCredenciales', this.formUser);
        
        this.loading = false;
        
        const msg = `El ${ (this.formUser.tipo == 'usuario') ? 'Usuario' : 'Contraseña' }  se actualizo exitosamente`
        
        this.mostrarNotificacion(msg, "success");

        this.formUser.campo1 = ""
        this.formUser.campo2 = ""
      } catch (error) {
        this.loading = false;
        this.mostrarNotificacion("Hubo en error al actualizar", "error");
      }

    }
  }
};
</script>

<style></style>
