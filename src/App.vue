<template>
  <v-app id="app">
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="drawer"
      v-if="logueado"
    >
      <v-list dense>
        <template>
          <v-list-tile :to="{ name: 'home' }">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Inicio</v-list-tile-title>
          </v-list-tile>
        </template>
        <template>
          <!-- BODEGA -->
          <v-list-group
            v-if="esAdministrador || esGerente || esGuardaAlmacen || esSupervisor"
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>Bodega</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="blue--text" :to="{ name: 'compras' }">
              <v-list-tile-action>
                <v-icon>post_add</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Compras</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
                <v-list-tile class="red--text" :to="{ name: 'egresos' }">
              <v-list-tile-action>
                <v-icon>view_in_ar</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Egresos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="orange--text" :to="{ name: 'cuarentena' }">
              <v-list-tile-action>
                <v-icon>dashboard</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Cuarentena</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="purple--text" :to="{ name: 'asignarperchas' }">
              <v-list-tile-action>
                <v-icon>trending_flat</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Asignacion de perchas</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="blue--text" :to="{ name: 'perchas' }">
              <v-list-tile-action>
                <v-icon>precision_manufacturing</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Perchas</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="green--text" :to="{ name: 'inventario' }">
              <v-list-tile-action>
                <v-icon>inventory</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Inventario</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="blue--text" :to="{ name: 'crearfabricantes' }">
              <v-list-tile-action>
                <v-icon>precision_manufacturing</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Fabricantes</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <!-- PERSONAS -->
          <v-list-group
            v-if="
              esAdministrador ||
              esGerente ||
              esGuardaAlmacen ||
              esSupervisor ||
              esFacturacion ||
              esContabilidad ||
              esComprasPublicas
            "
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>Personas</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="green--text" :to="{ name: 'proveedores' }">
              <v-list-tile-action>
                <v-icon>people</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Proveedores</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="green--text" :to="{ name: 'clientes' }">
              <v-list-tile-action>
                <v-icon>people</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Clientes</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <!-- DOCUMENTOS COMERCIALES -->
          <v-list-group
            v-if="
              esAdministrador ||
              esGerente ||
              esGuardaAlmacen ||
              esSupervisor ||
              esFacturacion ||
              esContabilidad ||
              esComprasPublicas
            "
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>Documentos Comerciales</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="green--text" :to="{ name: 'facturas' }">
              <v-list-tile-action>
                <v-icon>article</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Facturas</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="blue--text" :to="{ name: 'retenciones' }">
              <v-list-tile-action>
                <v-icon>description</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Retenciones</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <!-- CONSULTAS -->
          <v-list-group
            v-if="
              esAdministrador ||
              esGerente ||
              esGuardaAlmacen ||
              esSupervisor ||
              esFacturacion ||
              esContabilidad ||
              esComprasPublicas
            "
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>Consultas</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="green--text" :to="{ name: '' }">
              <v-list-tile-action>
                <v-icon>article</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Consulta Facturas</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="blue--text" :to="{ name: 'consultaretenciones' }">
              <v-list-tile-action>
                <v-icon>description</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Consulta Retenciones</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="blue--text" :to="{ name: 'consultacuentasporpagar' }">
              <v-list-tile-action>
                <v-icon>description</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Consulta cuentas por pagar</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <!-- ADMINISTRACION -->
          <v-list-group v-if="esAdministrador || esGerente || esSupervisor">
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>Administración</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="blue--text" :to="{ name: 'creardistribuidores' }">
              <v-list-tile-action>
                <v-icon>supervisor_account</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Distribuidores</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="green--text" :to="{ name: 'crearbodegas' }">
              <v-list-tile-action>
                <v-icon>admin_panel_settings</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Bodegas</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="blue--text" :to="{ name: 'usuarios' }">
              <v-list-tile-action>
                <v-icon>people</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Usuarios</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="green--text" :to="{ name: 'secuenciales' }">
              <v-list-tile-action>
                <v-icon>rotate_right</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Secuenciales</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar id="tool" dark app :clipped-left="$vuetify.breakpoint.mdAndUp" fixed>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">MENÚ</span>
      </v-toolbar-title>
      <span class="hidden-sm-and-down" v-if="$store.state.usuario"
        >Usuario: {{ usuario() }}</span
      >
      <v-spacer></v-spacer>
       <span class="hidden-sm-and-down" v-if="$store.state.usuario"
        >Rol: {{ rol() }}</span
      >
      <v-spacer></v-spacer>
      <span class="hidden-sm-and-down" v-if="$store.state.usuario"
        >Distribuidor: {{ farmacia() }}</span
      >
      <v-spacer></v-spacer>
      <v-btn icon @click="salir()" v-if="logueado">
        <v-icon>logout</v-icon>
      </v-btn>
      <v-btn icon :to="{ name: login }" v-else>
        <v-icon>apps</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view />
        </v-slide-y-transition>
      </v-container>
    </v-content>

    <v-footer dark height="auto">
      <v-layout justify-center>
        <v-flex text-xs-center>
          <v-card flat tile id="tool" class="white--text">
            <v-card-text class="white--text pt-0">Acounting &copy;2021</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      drawer: true,
      login: "",
      user: "",
      rold:"",
      farma: "",
    };
  },
  computed: {
    logueado() {
      return this.$store.state.usuario;
    },
    esAdministrador() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "609ed2679b1f0569cef1bf4d"
      );
    },
    esGerente() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "609ed45086d0416b4a050c57"
      );
    },
    esGuardaAlmacen() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "609ed47286d0416b4a050c58"
      );
    },
    esContabilidad() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "609ed47b86d0416b4a050c59"
      );
    },
    esComprasPublicas() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "609ed48086d0416b4a050c5a"
      );
    },
    esSupervisor() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "609ed48786d0416b4a050c5b"
      );
    },
    esFacturacion() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "60c0e96c13a9bc08b085f378"
      );
    },
  },
  created() {
    this.$store.dispatch("autoLogin");
  },

  methods: {
    farmacia() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let configuracion = { headers: header };
      if (codigoDistribuidor != undefined) {
        axios
          .get("distribuidor/query?_id=" + codigoDistribuidor, configuracion)
          .then(function (response) {
            me.farma = response.data.nombreComercial;
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        me.farma = "ADMINISTRADOR";
      }
      return this.farma;
    },
    usuario() {
      return this.$store.state.usuario.usuario;
    },
    rol(){
     let me = this;
      let header = { Token: this.$store.state.token };
      let codigoROl = this.$store.state.usuario.rol;
      let configuracion = { headers: header };
   
        axios
          .get("rol/query?_id=" + codigoROl, configuracion)
          .then(function (response) {
            
            me.rold = response.data.descripcion;
          })
          .catch(function (error) {
            console.log(error);
          });
  
      return this.rold;
    },
    isMobile() {
      if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/BlackBerry/i)
      ) {
        return true;
      } else {
        return false;
      }
    },
    salir() {
      this.$store.dispatch("salir");
      this.Farmacia = "";
      this.NombreUsuario = "";
      this.usuarios = [];
      this.farmacias = [];
    },
  },
};
</script>
<style>
#tool {
  background-color: rgb(72, 184, 141);
  /* background-image: url("./assets/19399009.jpg"); */
  /* background-repeat: no-repeat;
    background-size: cover; */
}
</style>
