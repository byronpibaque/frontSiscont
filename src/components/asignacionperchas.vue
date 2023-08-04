<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Asignar Perchas</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field class="text-xs-center" v-model="search" append-icon="search"
          label="Búsqueda" single-line hide-details>
        </v-text-field>
        <v-spacer></v-spacer>
        <template>
          <v-btn color="primary" dark class="mb-2" @click="verNuevo = 1" disabled>
            Nuevo
          </v-btn>
        </template>
      </v-toolbar>
      
      <v-flex xs12 sm12 md12 lg12 xl12>
        <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
          <v-layout row wrap>
            <v-flex xs12 sm2 md2 lg2 xl2>
              <v-text-field v-model="numComprobante" label="Número Comprobante">
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm3 md3 lg3 xl3>
              <v-text-field
                v-model="fechaFactura"
                label="Fecha Emi. Fact."
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm5 md5 lg5 xl5>
              <v-text-field
                v-model="descripcion"
                label="Descripcion de la compra"
              ></v-text-field>
            </v-flex>
   
            <v-flex xs12 sm12 md12 lg12 xl12>
              <template>
                <v-data-table :headers="cabeceraDetalles" :items="detalles" hide-actions
                  class="elevation-1">
                  <template slot="items" slot-scope="props">
                    <td class="text-xs-center blue--text">
                      {{ props.item.producto }}
                    </td>
                    <!-- <td class="text-xs-center">
                      <v-text-field
                      disabled
                        v-model="props.item.cantidad"
                      ></v-text-field>
                    </td> -->
                    <td class="text-xs-center">
                      <v-text-field
                       disabled
                        v-model="props.item.fracciones"
                      ></v-text-field>
                    </td>
                    <td class="text-xs-center">
                      <v-text-field disabled v-model="props.item.bonificacion"></v-text-field>
                    </td>

                    <template v-if="props.item.estado">
                      <td>
                        <v-autocomplete v-show="esGuardaAlmacen" multiple
                          v-model="props.item.percha" :items="perchas"
                          label="Asignación de perchas">
                        </v-autocomplete>                      
                      </td>
                      <td v-if="existeRefriSelected( props.item )">
                        <v-text-field type="number" v-model="props.item.temperatura"></v-text-field>
                      </td>
                    </template>

                    <td v-else class="text-md-center" style="color: #827717">
                      <h4>Este articulo aun no pasa la cuarentena</h4>
                    </td>
                  </template>
                  <template slot="no-data">
                    <h3>No hay artículos agregados al detalle.</h3>
                  </template>
                </v-data-table>
                
              </template>
            </v-flex>
            <v-flex xs12 sm12 md12 v-show="valida">
              <div class="red--text" v-for="v in validaMensaje" :key="v"
                v-text="v">
              </div>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12 xl12>
              <v-btn color="blue darken-1" flat @click.native="ocultarNuevo()">
                Cancelar
              </v-btn>
              <v-btn color="success" v-if="verDetalle == 0 && estado==0" @click.native="guardar()">
                ACTUALIZAR
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>   

      <!-- TABLA DONDE SE MUESTRA TODAS LAS COMPRAS PARA ASIGNAR -->
      <v-data-table v-if="!verNuevo" :headers="cabeceraCompras" :items="compras"
        class="elevation-1" :items-per-page="5" :search="search">
        <template v-slot:items="props">
          <td>
            <v-icon small class="mr-2" @click="verDetalleC(props.item)">tab</v-icon>
          </td>
          <td class=" blue--text"> {{ props.item.descripcion.toUpperCase() }} </td>
          <td> {{ props.item.numComprobante }} </td>
          <td> {{ formatearFecha(props.item.createdAt) }} </td>
        </template>
        <template slot="no-data">
          <h3>No hay artículos agregados al detalle.</h3>
        </template>
      </v-data-table>
      <!-- FINDE TABLA DONDE SE MUESTRA TODAS LAS COMPRAS PARA ASIGNAR -->
    </v-flex>
  </v-layout>
</template>

<script>
import moment from "moment";
import axios from "axios";
import Swal from "sweetalert2";
export default {
  name: 'asignacionPerchas',
  computed: {
    esGuardaAlmacen() {
      return (this.$store.state.usuario.rol == "609ed47286d0416b4a050c58");
    }
  },
  data() {
    return {      
      perchas:[],
      cabeceraCompras: [
        { text: "Opciones", value: "borrar", sortable: false },
        { text: "DESCRIPCION", value: "descripcion", sortable: false },
        { text: "# COMPROBANTE", value: "numComprobante", sortable: false },    
        { text: "Fecha", value: "createdAt", sortable: false }      
      ],
      compras: [],
      articulos: [],
      cabeceraArticulos: [
        { text: "Seleccionar", value: "seleccionar", sortable: false },
        { text: "Codigo Barras", value: "codigoBarras", sortable: false },
        { text: "Codigo Lote", value: "codigoLote", sortable: false },
        { text: "Nombre Comercial", value: "nombreComercial", sortable: false }
      ],
      search: "",
      verDetalle: 0,
      verNuevo: 0,
      validaMensaje: [],
      valida: false,
      cabeceraDetalles: [     
        { text: "Producto", value: "producto", sortable: false },
        // { text: "Cantidad", value: "cantidad", sortable: false },
        { text: "Unidades", value: "unidades", sortable: false },
        { text: "Bonificacion", value: "bonificacion", sortable: false },
        { text: "Asignar percha", value: "asignarPercha", sortable: false },     
        { text: "Temperatura", value: "temperatura" }     
      ],
      accion:[
        { text: "Aprobado", value: 1},
        { text: "No Aprobado", value: 0},
      ],
      detalles: [],
      codigo: "",
      errorArticulo: "",
      numComprobante: "",
      fechaFactura: "",
      descripcion: "",
      codigoBodega: "",
      adModal: 0,
      adModalD:0,
      adAccion: 0,
      adAccionD: 0,
      adNombre: "",
      adId: "",
      descripcionD:"",
      id:"",
      estado:0
    };
  },
  methods: {
    listar_perchas(){
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let newData =[]
      axios.get("perchas/list", configuracion).then(function(response) {
          let data = response.data
          data.forEach(x => {
            let niveles = x.niveles
            niveles.forEach(y => { newData.push( x.descripcion+"-"+y.nivel ) });
          });
          me.perchas=newData
        }).catch(function(error) {
          console.log(error);
        });  
    },
    listarDetalles(id) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios.get("asignacionpercha/query?_id=" + id, configuracion).then(function(response) {
          me.detalles = response.data.detalles;
      }).catch(function(error) {
          console.log(error);
      });
    },
    verDetalleC(data) {
      this.verNuevo = 1;
      this.numComprobante = data.numComprobante;
      this.descripcion = data.descripcion;
      this.estado=data.estado
      this.fechaFactura = this.formatearFecha(data.createdAt);

      this.listarDetalles(data._id);
      this.id=data._id
    },
    formatearFecha(value) {
      if (value) {
        return moment(String(value)).format("DD/MM/YYYY");
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
        axios.get("asignacionpercha/list?codigoDistribuidor=" + codigoDistribuidor, configuracion)
          .then(function(response) {
            if (response.status == 200) me.compras = response.data;
            else console.log(response);            
          }).catch(function(error) {
            console.log(error);
          });
      }
    },
    ocultarNuevo() {
      this.verNuevo = 0;
      this.limpiar();
    },
    limpiar(){
      this.numComprobante = "";
      this.fechaFactura = "";
      this.descripcion = "";
      this.errorArticulo = "";
      this.total = 0;
      this.detalles = [];
      this.estado=0
      this.valida = 0;
      this.validaMensaje = [];
    },
    obtenerBodega() {
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      if (codigoDistribuidor == undefined) {
      } else {
        axios.get("bodega/query?codigoDistribuidor=" + codigoDistribuidor, configuracion)
          .then(function(response) {
            me.codigoBodega = response.data._id;
          }).catch(function(error) {
            console.log(error);
          });
      }
    },
    existeRefriSelected( data ){
      var existe = false;
      if ( typeof(data.percha) == 'object') {
        existe = data.percha.some( percha => percha.includes('REFRI')  )
      }
      return existe
    },
    guardar(){ 
      let error = false;
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };

      //Código para guardar
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;
      //Corrobar que se aya ingresado la temp o dejar en null aquella que no esten en refri
      this.detalles.map( (detalle, index ) => {
        if ( detalle.percha.some( percha => percha.includes('REFRI')  ) ) {
          if ( !detalle.temperatura ){
            Swal.fire( "Noticias!", `Debes agregar la temperatura en la fila ${ index + 1 }`, "warning");
            error = true;
          }
        }else
          detalle.temperatura = null;
      })
      
      
      if (!error) {
        this.detalles.map( detalle => { detalle.percha = detalle.percha.toString() })
        
        axios.put("asignacionpercha/actualizar",{
            _id:this.id,
            numComprobante: this.numComprobante,
            fechaFactura: this.fechaFactura,
            detalles: this.detalles,
            descripcion: this.descripcion,
            codigoBodega: this.codigoBodega,
            codigoDistribuidor: codigoDistribuidor,
            codigoUsuario: codigoUsuario,
          }, configuracion).then(function(response) {
          if (response.status == 200) 
            Swal.fire( "Noticias!", "Se asignado percha correctamente.", "success");
          else
            Swal.fire("Ops!","Hubo problemas al intentar asignar percha.","err");
          
          me.limpiar();
          me.ocultarNuevo();          
        }).catch(function(error) {
          console.log(error);
        });
      }
    },
    encuentra(id) {
      let sw = 0;
      for (var i = 0; i < this.detalles.length; i++) {
        if (this.detalles[i]._id == id) {
          sw = true;
        }
      }
      return sw;
    },
    agregarDetalle(data) {
      this.errorArticulo = null;
      if (this.encuentra(data._id) == true) {
        this.errorArticulo = "El artículo ya ha sido agregado.";
      } else {
        this.detalles.unshift({
          _id: data._id,
          producto: data.nombreComercial,
          cantidad: 0,
          fracciones: 0,
          bonificacion: 0,
          fxcaja: data.codigoProducto.fraccionCaja,
          fraccionesTotales: data.fraccionesTotales,
          costoNeto: 0,
          pvp: data.pvp,
          pvm: data.pvm,
          punit: data.punit,
          descuento: data.descuento,
          iva: data.iva,
        });

        this.codigo = "";
      }
    }
  },
  created() {
    this.listar();
    this.obtenerBodega();
    this.listar_perchas()
  },
};
</script>

<style></style>
