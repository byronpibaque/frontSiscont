<template>
  <div id="principal">
    <v-layout justify-center>
      <div id="login">
        <div id="cajas">
          <v-flex>
            <v-text-field
              prepend-icon="account_circle"
              autofocus
              color="accent"
              v-model="email"
              label="Usuario"
              required
            >
            </v-text-field>
          </v-flex>
          <v-flex>
            <v-select v-model="select" :items="listDistribuidores" item-text="nombreComercial" 
              item-value="codigoDistribuidor" label="Selecciona una Distribuidora" persistent-hint return-object single-line prepend-icon="inventory">
            </v-select>
          </v-flex>
          <v-flex>
            <v-text-field
              prepend-icon="lock"
              type="password"
              color="accent"
              v-model="password"
              label="Contraseña"
              v-on:keyup.enter="ingresar"
              required
            >
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12 v-show="errorM">
            <div class="red--text" v-text="errorM"></div>
          </v-flex>
          <v-flex>
            <v-flex text-xs-center>
              <v-btn class="boton" @click="ingresar()">INICIAR</v-btn>
            </v-flex>
          </v-flex>
        </div>
      </div>
    </v-layout>
  </div>
</template>

<script>
import axios from "axios";
import os from "os";
import Swal from "sweetalert2";
export default {
  name: 'Login',
  created() {},
  computed: {},
  data() {
    return {
      listDistribuidores: [],
      select: {
        codigoDistribuidor:"60a285006626313363286dfe",
        nombreComercial:"COFARMO DISTRIBUCIONES"
      },
      email: "",
      password: "",
      errorM: null,
      ipobt: "",
      ipalmacenada: "",
      val: [],
    };
  },
  methods: {
    async comprobacion(ipobtenida, ippublica) {
      if (ipobtenida == ippublica) {
        return true;
      } else {
        return false;
      }
    },
    async getDistribuidoras(){      
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios.get("distribuidor/list", configuracion).then(function({ data }) {
        data.forEach(distribuidora => {
          me.listDistribuidores.push({
            codigoDistribuidor: distribuidora._id,
            nombreComercial: distribuidora.nombreComercial
          })
        });
      }).catch(function(error) {
        console.log(error);
      });
    },
    ingresar() {
      axios.post(
          "usuario/login?data=" + this.email +"&clave=" + this.password +"&codigoDistribuidor=" +
            this.select.codigoDistribuidor)
        .then((respuesta) => {
          if (respuesta.data.user.login.codigoDistribuidor == undefined) {
            this.$store.dispatch("guardarToken", respuesta.data.tokenReturn);
            this.$router.push({ name: "home" });
          }else {
            this.$store.dispatch("guardarToken", respuesta.data.tokenReturn);
            this.$router.push({ name: "home" });
          }
        }).catch((err) => {
          console.log(err);
          Swal.fire({ title: "<strong>Error</strong>", icon: "error", html:err.response.data,
            showCloseButton: true, showCancelButton: true, focusConfirm: false
          });
        });
    },
  },
  mounted(){
    this.getDistribuidoras();
  }
};
</script>

<style>
#principal {
  /* background-image: url('../assets/moon.jpg');   */
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  background-repeat: no-repeat;
  background-size: cover;
}
#card {
  width: 70%;
  height: 100%;
  margin-left: 0%;
}
#cajas {
  width: 300px;
  height: 250px;
  margin-top: 35px;
}
#login {
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 5px 3px 5px rgb(127, 139, 133);
  background-color: rgba(255, 255, 255, 0.541);
  width: 500px;
  height: 350px;
  border: 2px solid rgb(30, 224, 150);
  /* border-radius: 25px; */
  /* opacity: 0.3; */
}
.boton {
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  width: 300px;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  opacity: 0.9;
  font-size: 16px;
}

.boton:hover {
  background-color: #367e48; /* Green */
  color: rgb(0, 255, 34);
}
</style>
