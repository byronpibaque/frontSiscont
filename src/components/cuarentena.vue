<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Cuarentena</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-text-field class="text-xs-center" v-model="search" append-icon="search"
          label="Búsqueda" single-line hide-details>
        </v-text-field>

        <v-spacer></v-spacer>

        <template>
        
        </template>
      </v-toolbar>
      <v-flex xs12 sm12 md12 lg12 xl12>

        <!-- AQUI SE MUESTRA EL DETALLE DEL PRODUCTO EN CUARENTENA -->
        <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
          <v-layout row wrap>
            <v-flex xs12 sm2 md2 lg2 xl2>
              <v-text-field v-model="numComprobante" label="Número Comprobante"></v-text-field>
            </v-flex>
            <v-flex xs12 sm3 md3 lg3 xl3>
              <v-text-field v-model="fechaFactura" label="Fecha Emi. Fact."></v-text-field>
            </v-flex>
            <v-flex xs12 sm5 md5 lg5 xl5>
              <v-text-field v-model="descripcion" label="Descripcion de la compra"></v-text-field>
            </v-flex>
   
            <v-flex xs12 sm12 md12 lg12 xl12>
              <template>
                <v-data-table :headers="cabeceraDetalles" :items="detalles"
                  hide-actions class="elevation-1">
                  <template slot="items" slot-scope="props">
                    <td>
                      <template v-if="props.item.estado">
                        <v-icon small class="red--text" @click="activarDesactivarMostrar(1,props.item)">
                          save
                        </v-icon>
                      </template>
                      <template v-else>
                        <v-icon small @click="activarDesactivarMostrar(2,props.item)">save</v-icon>
                      </template>                      
                    </td>
                    <td class="text-xs-center blue--text">
                      {{ props.item.producto }}
                    </td>
                    <!-- <td class="text-xs-center">
                      <v-text-field disabled v-model="props.item.cantidad">
                      </v-text-field>
                    </td> -->
                    <td class="text-xs-center">
                      <v-text-field disabled v-model="props.item.fracciones">
                      </v-text-field>
                    </td>
                    <td class="text-xs-center">
                      <v-text-field disabled v-model="props.item.bonificacion">
                      </v-text-field>
                    </td>
                      <td>
                        <div v-if="props.item.estado">
                          <span class="green--text">Aceptado</span>
                        </div>
                        <div v-else>
                          <span class="orange--text">En espera</span>
                        </div>
                      </td>
                      <td>
                      <v-autocomplete v-show="esQuimico || esGuardaAlmacen"
                        v-model="props.item.estado" :items="accion" label="Estado curentena">
                      </v-autocomplete>
                    </td>
                    <td v-show="esQuimico">
                      <div v-if="props.item.estado">
                        <span class="green--text">LISTO PARA ASIGNAR PERCHA PERCHA</span>
                      </div>
                      <div v-else>    
                        <v-text-field v-model="props.item.descripcion"></v-text-field>
                      </div>
                    </td>
                  </template>
                  <template slot="no-data">
                    <h3>No hay artículos agregados al detalle.</h3>
                  </template>
                </v-data-table>
                
              </template>
            </v-flex>

            <v-flex xs12 sm12 md12 v-show="valida">
              <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
              </div>
            </v-flex>

            <v-flex xs12 sm12 md12 lg12 xl12>
              <v-btn color="blue darken-1" flat @click.native="ocultarNuevo()">Atras</v-btn>         
            </v-flex>
          </v-layout>
        </v-container>
        <!-- FIN DE DONDE SE MUETRA DETALLE DE CUARENTENA -->

      </v-flex>

      <!-- ACTUALIZAR ALGUN PRODUCTO DE LA CUARENTENA -->
      <v-dialog v-model="adModal" max-width="290">
          <v-card>
            <v-card-title class="headline" v-if="adAccion==1">Actualizar Item</v-card-title>
            <v-card-title class="headline" v-if="adAccion==2">Actualizar Item</v-card-title>
            <v-card-text>
              Estás a punto de
              <span v-if="adAccion==1">actualizar</span>
              <span v-if="adAccion==2">actualizar</span>
              el item {{adNombre}}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="activarDesactivarCerrar()" color="green darken-1" flat="flat">Cancelar</v-btn>
              <v-btn
                v-if="adAccion==1"
                @click="activar()"
                color="blue darken-4"
                flat="flat"
              >ACTUALIZAR</v-btn>
              <v-btn
                v-if="adAccion==2"
                @click="desactivar()"
                color="blue darken-4"
                flat="flat"
              >ACTUALIZAR</v-btn>
            </v-card-actions>
          </v-card>
      </v-dialog>
      <!-- FIN DE MODAL ACTUALIZAR ALGUN PRODUCTO DE LA CUARENTENA -->
   
      <!-- SE MUESTRAN EL LISTADO CUARENTENAS -->
      <v-data-table v-if="!verNuevo" :headers="cabeceraCompras" :items="compras"
        class="elevation-1" :items-per-page="5" :search="search">
        <template v-slot:items="props">
          <td>
            <v-icon small class="mr-2 " @click="verDetalleC(props.item)">tab</v-icon>
          </td>
          <td class=" blue--text">
            {{ (props.item.codigoProveedor) ? 
              props.item.codigoProveedor.razonsocial 
              : 'No se agrego proveedor' 
            }}
          </td>
          <td class=" blue--text">{{ props.item.descripcion.toUpperCase() }}</td>
          <td>{{ props.item.numComprobante }}</td>
          <td>{{ formatearFecha(props.item.createdAt) }}</td>
        </template>
        <template slot="no-data">
          <h3>No hay artículos agregados al detalle.</h3>
        </template>
      </v-data-table>
      <!-- FIN DE EL LISTADO CUARENTENAS -->

    </v-flex>
  </v-layout>
</template>

<script>
import moment from "moment";
import axios from "axios";
export default {
  data() {
    return {      
      cabeceraCompras: [
        { text: "Opciones", value: "borrar", sortable: false },
        { text: "PROVEEDOR", value: "proveedor", sortable: true },
        { text: "DESCRIPCION", value: "descripcion", sortable: false },
        { text: "# COMPROBANTE", value: "numComprobante", sortable: false },    
        { text: "Fecha", value: "createdAt", sortable: true }      
      ],
      compras: [],
      cabeceraArticulos: [
        { text: "Seleccionar", value: "seleccionar", sortable: false },

        { text: "Codigo Barras", value: "codigoBarras", sortable: false },
        { text: "Codigo Lote", value: "codigoLote", sortable: false },
        { text: "Nombre Comercial", value: "nombreComercial", sortable: false },
      ],
      dialog: 0,
      verNuevo: 0,
      validaMensaje: [],
      valida: false,
      cabeceraDetalles: [
        { text: "Borrar", value: "borrar", sortable: false },
        { text: "Producto", value: "producto", sortable: false },
        // { text: "Cantidad", value: "cantidad", sortable: false },
        { text: "Unidades", value: "fracciones", sortable: false },
        { text: "Bonificacion", value: "bonificacion", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
        { text: "Accion", value: "accion", sortable: false },
        { text: "Descripcion", value: "descripcion", sortable: false },
      ],
      accion:[
        { text: "Aprobado", value: 1},
        { text: "No Aprobado", value: 0},
      ],
      detalles: [],
      numComprobante: "",
      fechaFactura: "",
      descripcion: "",
      search: '',
      adModal: 0,
      adModalD:0,
      adAccion: 0,
      adAccionD: 0,
      adNombre: "",
      adNombreD:"",
      adId: "",
      adIdD: "",
      descripcionD:"",
      cuarentena_id: ''
    };
  },
  computed: {
    esQuimico() {
      return (this.$store.state.usuario.rol == "6425b4e63015a625b227f4b7");
    },
    esGuardaAlmacen() {
      return (this.$store.state.usuario.rol == "609ed47286d0416b4a050c58");
    }
  },
  methods: {  
    ocultarNuevo(){
      this.verNuevo = 0
    },
    listarDetalles(id) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios.get("cuarentena/query?_id=" + id, configuracion).then(function(response) {
          me.detalles = response.data.detalles;
        }).catch(function(error) {
          console.log(error);
        });
    },
    verDetalleC(data) {
      this.cuarentena_id = data._id
      this.verNuevo = 1;
      this.numComprobante = data.numComprobante;
      this.descripcion = data.descripcion;
      this.fechaFactura = this.formatearFecha(data.createdAt);
      this.listarDetalles(data._id);
    },
    formatearFecha(value) {
      if (value) {
        return moment(String(value)).format("MM/DD/YYYY");
      }
    },
    listar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;
      if (codigoDistribuidor == undefined) {
      } else {
        axios
          .get(
            "cuarentena/list?codigoDistribuidor=" + codigoDistribuidor,
            configuracion
          )
          .then(function(response) {
            if (response.status == 200) {
              me.compras = response.data;
            } else {
              console.log(response);
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.producto;
      this.adId = item._id;
      this.descripcionD=item.descripcion
      if (accion == 1) {
        this.adAccion = 1;
      } else if (accion == 2) {
        this.adAccion = 2;
      } else {
        this.adModal = 0;
      }
    },
    activarDesactivarCerrar() {
      this.adModal = 0;
    },
    activar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios.put("cuarentena/activateD", { 
        _id: this.adId, 
        cuarentena_id: this.cuarentena_id,
        numComprobante: this.numComprobante 
      }, configuracion).then(function(response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";         
        }).catch(function(error) {
          console.log(error);
        });
    },
    desactivar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios.put("cuarentena/deactivateD", { 
        _id: this.adId,
        descripcion: this.descripcionD,
        cuarentena_id: this.cuarentena_id,
        numComprobante : this.numComprobante
      }, configuracion)
        .then(function(response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";       
        }).catch(function(error) {
          console.log(error);
        });
    },
  },
  created() {
    this.listar();
  },
};
</script>

<style></style>
