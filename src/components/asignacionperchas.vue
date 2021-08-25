<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Asignar Perchas</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Búsqueda"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <template>
          <v-btn
            color="primary"
            dark
            class="mb-2"
            @click="verNuevo = 1"
            disabled
            >Nuevo</v-btn
          >
        </template>
      </v-toolbar>
      <v-flex xs12 sm12 md12 lg12 xl12>
        <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
          <v-layout row wrap>
            <v-flex xs12 sm2 md2 lg2 xl2>
              <v-text-field
                v-model="numComprobante"
                label="Número Comprobante"
              ></v-text-field>
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
                <v-data-table
                  :headers="cabeceraDetalles"
                  :items="detalles"
                  hide-actions
                  class="elevation-1"
                >
                  <template slot="items" slot-scope="props">
              
                    <td class="text-xs-center blue--text">
                      {{ props.item.producto }}
                    </td>
                    <td class="text-xs-center">
                      <v-text-field
                      disabled
                        v-model="props.item.cantidad"
                      ></v-text-field>
                    </td>
                    <td class="text-xs-center">
                      <v-text-field
                       disabled
                        v-model="props.item.fracciones"
                      ></v-text-field>
                    </td>
                    <td class="text-xs-center">
                      <v-text-field
                       disabled
                        v-model="props.item.bonificacion"
                      ></v-text-field>
                    </td>
                      <td>
                      <v-autocomplete
                        v-model="props.item.percha"
                        :items="perchas"
                        label="Asignación de perchas"
                      ></v-autocomplete>
                    </td>
                  </template>
                  <template slot="no-data">
                    <h3>No hay artículos agregados al detalle.</h3>
                  </template>
                </v-data-table>
                
              </template>
            </v-flex>
            <v-flex xs12 sm12 md12 v-show="valida">
              <div
                class="red--text"
                v-for="v in validaMensaje"
                :key="v"
                v-text="v"
              ></div>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12 xl12>
              <v-btn color="blue darken-1" flat @click.native="ocultarNuevo()"
                >Cancelar</v-btn
              >
              <v-btn
                color="success"
                v-if="verDetalle == 0 && estado==0"
                @click.native="guardar()"
                >ACTUALIZAR</v-btn
              >
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
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
   
      <v-dialog v-model="dialog" max-width="1000px">
        <v-card>
          <v-card-title>
            <span class="headline">Seleccione un artículo</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12 lg12 xl12>
                  <v-text-field
                    v-model="texto"
                    @keyup.enter="listarArticulosnombres(texto)"
                    class="text-xs-center"
                    append-icon="search"
                    label="Búsqueda"
                  ></v-text-field>
                  <template>
                    <v-data-table
                      :headers="cabeceraArticulos"
                      :items="articulos"
                      class="elevation-1"
                    >
                      <template v-slot:items="props">
                        <td class="justify-center layout px-0">
                          <v-icon
                            small
                            class="mr-2"
                            @click="agregarDetalle(props.item)"
                            >add</v-icon
                          >
                        </td>
                        <td class="blue--text">{{ props.item.codigoBarra }}</td>
                        <td class="blue--text">{{ props.item.codigoLote }}</td>
                        <td class="">{{ props.item.nombreComercial }}</td>
                      </template>
                    </v-data-table>
                  </template>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-data-table
        v-if="!verNuevo"
        :headers="cabeceraCompras"
        :items="compras"
        class="elevation-1"
        :items-per-page="5"
        :search="search"
      >
        <template v-slot:items="props">
          <td>
            <v-icon small class="mr-2 " @click="verDetalleC(props.item)"
              >tab</v-icon
            >
             <!-- <template v-if="props.item.estado">
              <v-icon small @click="activarDesactivarMostrar(2,props.item)">block</v-icon>
            </template>
            <template v-else>
              <v-icon small @click="activarDesactivarMostrar(1,props.item)">check</v-icon>
            </template> -->
          </td>
          <td class=" blue--text">
            {{ props.item.descripcion }}
          </td>
          <td>
            {{ props.item.numComprobante }}
          </td>

          <td>
            {{ formatearFecha(props.item.createdAt) }}
          </td>
          <!-- <td>
            <div v-if="props.item.estado">
              <span class="green--text">Aceptado</span>
            </div>
            <div v-else>
              <span class="red--text">Anulado</span>
            </div>
          </td> -->
        </template>
        <template slot="no-data">
          <h3>No hay artículos agregados al detalle.</h3>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from "moment";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
export default {
  computed: {
    calcularTotal: function() {
      let resultado =
        parseFloat(this.calcularSubtotal) +
        parseFloat(this.calcularIva) -
        parseFloat(this.calcularDescuento);
      return resultado.toFixed(2);
    },
    calcularDescuento: function() {
      let resultado = 0.0;
      for (let index = 0; index < this.detalles.length; index++) {
        let cant = 0;
        let pu = 0;
        let totalsinimpuesto = 0;
        let codigoPorcent = 0;
        let calculoporcentual = 0;
        let descto = 0;
        let tarifa = 0;
        let val = 0;
        const element = this.detalles[index];
        cant = parseInt(element.fraccionesTotales);
        pu = parseFloat(element.punit);
        descto = parseFloat(element.descuento);
        val = (cant * pu * descto) / 100;
        resultado = resultado + val;
      }

      return resultado.toFixed(2);
    },
    calcularIva: function() {
      let resultado = 0.0;
      for (let index = 0; index < this.detalles.length; index++) {
        let cant = 0;
        let pu = 0;
        let totalsinimpuesto = 0;
        let codigoPorcent = 0;
        let calculoporcentual = 0;
        let descto = 0;
        let tarifa = 0;
        let val = 0;
        const element = this.detalles[index];
        cant = parseInt(element.fraccionesTotales);
        pu = parseFloat(element.punit);
        val = cant * pu;
        if (element.iva != 0) {
          resultado = resultado + val * 0.12;
        }
      }

      return resultado.toFixed(2);
    },
    calcularSubtotal: function() {
      let resultado = 0.0;
      for (let index = 0; index < this.detalles.length; index++) {
        let cant = 0;
        let pu = 0;
        let totalsinimpuesto = 0;
        let codigoPorcent = 0;
        let calculoporcentual = 0;
        let descto = 0;
        let tarifa = 0;
        let val = 0;
        const element = this.detalles[index];
        cant = parseInt(element.fraccionesTotales);
        pu = parseFloat(element.punit);
        val = cant * pu;
        resultado = resultado + val;
      }

      return resultado.toFixed(2);
    },
  },
  watch: {},
  data() {
    return {
      
      perchas:[],
      accionC:0,
      cabeceraCompras: [
        { text: "Opciones", value: "borrar", sortable: false },
        { text: "DESCRIPCION", value: "descripcion", sortable: false },
        { text: "# COMPROBANTE", value: "numComprobante", sortable: false },
    
        { text: "Fecha", value: "createdAt", sortable: false },
      
      ],
      compras: [],
      _idProveedor: "",
      texto: "",
      articulos: [],
      cabeceraArticulos: [
        { text: "Seleccionar", value: "seleccionar", sortable: false },
        { text: "Codigo Barras", value: "codigoBarras", sortable: false },
        { text: "Codigo Lote", value: "codigoLote", sortable: false },
        { text: "Nombre Comercial", value: "nombreComercial", sortable: false },
      ],
      dialog: 0,
      total: 0,
      totalimpuesto: 0,
      totaldescuento: 0,
      subtotal: 0,
      search: "",
      verDetalle: 0,
      verNuevo: 0,
      validaMensaje: [],
      valida: false,
      cabeceraDetalles: [
     
        { text: "Producto", value: "producto", sortable: false },
        { text: "Cantidad", value: "cantidad", sortable: false },
        { text: "Fracciones", value: "fracciones", sortable: false },
        { text: "Bonificacion", value: "bonificacion", sortable: false },
        { text: "Asignar percha", value: "asignarPercha", sortable: false },
     
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
      direccion_Proveedor: "",
      razonSocial_Proveedor: "",
      ruc_proveedor: "",
      codigoBodega: "",
      adModal: 0,
      adModalD:0,
      adAccion: 0,
       adAccionD: 0,
      adNombre: "",
      adNombreD:"",
      adId: "",
       adIdD: "",
       descripcionD:"",
       id:"",
       estado:0
    };
  },
  props: {},
  methods: {
    listar_perchas(){
        let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
       let newData =[]
      axios
        .get("perchas/list", configuracion)
        .then(function(response) {
         let data = response.data
         data.forEach(x => {
           let niveles = x.niveles
           niveles.forEach(y => {
            
               newData.push(x.descripcion+"-"+y.nivel)
              
           });
          
         });

           me.perchas=newData
       
        })
        .catch(function(error) {
          console.log(error);
        });  
    },
    listarDetalles(id) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("asignacionpercha/query?_id=" + id, configuracion)
        .then(function(response) {
          me.detalles = response.data.detalles;
        })
        .catch(function(error) {
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
            "asignacionpercha/list?codigoDistribuidor=" + codigoDistribuidor,
            configuracion
          )
          .then(function(response) {
            if (response.status == 200) {
              // console.log(response.data);
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
    ocultarNuevo() {
      this.verNuevo = 0;
      this.limpiar();
    },
    limpiar() {
      this.direccion_Proveedor = "";
      this.razonSocial_Proveedor = "";
      
      this.ruc_proveedor = "";
      this.numComprobante = "";
      this.fechaFactura = "";
      this.descripcion = "";
      this.errorArticulo = "";
      this.total = 0;
      this.totalimpuesto = 0;
      this.totaldescuento = 0;
      this.subtotal = 0;
      this._idProveedor = "";
      this.detalles = [];
      this.estado=0
      this.valida = 0;
      this.validaMensaje = [];
    },
    limpiarbusqueda() {
      this.texto = "";
      this.articulos = [];
    },
    close() {
      this.dialog = 0;
      this.limpiarbusqueda();
    },
    obtenerBodega() {
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      if (codigoDistribuidor == undefined) {
      } else {
        axios
          .get(
            "bodega/query?codigoDistribuidor=" + codigoDistribuidor,
            configuracion
          )
          .then(function(response) {
            me.codigoBodega = response.data._id;
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    listarArticulosnombres(code) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;

      axios
        .get(
          "inventario/busca?data=" + code + "&codigoBodega=" + me.codigoBodega,
          configuracion
        )
        .then(function(response) {
          if (response.status == 206) {
            Swal.fire("Aviso", response.data.message, "error");
          } else {
            me.articulos = response.data;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    validar_guardar() {
      this.valida = 0;
      this.validaMensaje = [];
      // if(isNaN(this.fraccionCaja)){
      //    this.validaMensaje.push("Fraccion x caja debe ser solo numero.");
      // }
      if (this.numComprobante.length == 0) {
        this.validaMensaje.push("Debe ingresar el numero de comprobante.");
      }
      if (this.fechaFactura.length == 0) {
        this.validaMensaje.push(
          "Debe ingresar la fecha de emision de la factura."
        );
      }
      if (this.descripcion.length == 0) {
        this.validaMensaje.push("Debe ingresar la descripcion de la compra");
      }
      if (this.ruc_proveedor.length == 0) {
        this.validaMensaje.push(
          "Debe ingresar el numero de RUC del proveedor."
        );
      }
      if (this.razonSocial_Proveedor.length == 0) {
        this.validaMensaje.push("Falta razon social del proveedor.");
      }
      if (this.direccion_Proveedor.length == 0) {
        this.validaMensaje.push("Falta direccion de proveedor.");
      }

      if (this.detalles.length == 0) {
        this.validaMensaje.push(
          "Debe ingresar al menos un detalle a la factura de compra."
        );
      }
      /*       cantidad: 0,
          fracciones: 0,
          bonificacion: 0,
          fxcaja: data.codigoProducto.fraccionCaja,
          fraccionesTotales: data.fraccionesTotales,
          costoNeto: 0,
          pvp: data.pvp,
          pvm: data.pvm,
          punit: data.punit,
          descuento: data.descuento,
          iva: data.iva, */
      for (let i = 0; i < this.detalles.length; i++) {
        const L = this.detalles[i];
        if (L.cantidad.length == 0) {
          this.validaMensaje.push("CANTIDAD no puede ser un valor vacio.");
        }
        if (parseInt(L.cantidad) < 0) {
          this.validaMensaje.push("CANTIDAD no puede ser un valor negativo.");
        }
        if (L.fracciones.length == 0) {
          this.validaMensaje.push("FRACCIONES no puede ser un valor vacio.");
        }
        if (parseInt(L.fracciones) < 0) {
          this.validaMensaje.push("FRACCIONES no puede ser un valor negativo.");
        }
        if (L.bonificacion.length == 0) {
          this.validaMensaje.push("BONIFICACION no puede ser un valor vacio.");
        }
        if (parseInt(L.bonificacion) < 0) {
          this.validaMensaje.push(
            "BONIFICACION no puede ser un valor negativo."
          );
        }
        if (L.pvm == 0 || L.pvm.length == 0) {
          this.validaMensaje.push("PVM no puede ser un valor vacio.");
        }
        if (L.pvp == 0 || L.pvp.length == 0) {
          this.validaMensaje.push("PVP no puede ser un valor vacio.");
        }
        if (L.punit == 0 || L.punit.length == 0) {
          this.validaMensaje.push("P. UNIT no puede ser un valor vacio.");
        }
        if (L.descuento.length == 0) {
          this.validaMensaje.push("DESCUENTO no puede ser un valor vacio.");
        }
        if (L.pvm < 0) {
          this.validaMensaje.push("PVM no puede ser negativo.");
        }
        if (L.pvp < 0) {
          this.validaMensaje.push("PVP no puede ser negativo.");
        }

        if (L.punit < 0) {
          this.validaMensaje.push("P. UNIT no puede ser negativo.");
        }

        if (L.descuento < 0) {
          this.validaMensaje.push("DESCUENTO no puede ser negativo.");
        }
      }

      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    guardar() {
 
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };

      //Código para guardar
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;

      axios
        .put(
          "asignacionpercha/actualizar",
          {
            _id:this.id,
            numComprobante: this.numComprobante,
            fechaFactura: this.fechaFactura,
            detalles: this.detalles,
            descripcion: this.descripcion,
            codigoBodega: this.codigoBodega,
            codigoDistribuidor: codigoDistribuidor,
            codigoUsuario: codigoUsuario,
          },
          configuracion
        )
        .then(function(response) {
          if (response.status == 200) {
            Swal.fire(
              "Noticias!",
              "Se asignado percha correctamente.",
              "success"
            );
          } else {
            Swal.fire(
              "Ops!",
              "Hubo problemas al intentar asignar percha.",
              "err"
            );
          }
          me.limpiar();
          me.ocultarNuevo();
          
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    eliminarDetalle(arr, item) {
      let i = arr.indexOf(item);
      if (i != -1) {
        arr.splice(i, 1);
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
    },
    buscarCodigo(code) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;

      axios
        .get(
          "inventario/buscaCodigo?data=" +
            code +
            "&codigoBodega=" +
            me.codigoBodega,
          configuracion
        )
        .then(function(response) {
          if (response.status == 206) {
            Swal.fire("Aviso", response.data.message, "error");
          } else {
            if (response.data.length > 1) {
              Swal.fire(
                "Aviso",
                "Se estan mostrando mas de un resultado \n deberia buscar en pantalla.",
                "error"
              );
            } else {
              me.agregarDetalle(response.data);
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    buscarProveedor(data) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;

      axios
        .get("proveedor/consulta?data=" + data, configuracion)
        .then(function(response) {
          if (response.status == 206) {
            Swal.fire("Error", response.data.message, "error");
          } else {
            me.direccion_Proveedor = response.data.direccion;
            me.razonSocial_Proveedor = response.data.razonsocial;
            me._idProveedor = response.data._id;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
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
      axios
        .put("asignacionpercha/activateD", { _id: this.adId }, configuracion)
        .then(function(response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
         
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    desactivar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("asignacionpercha/deactivateD", { _id: this.adId,descripcion:this.descripcionD }, configuracion)
        .then(function(response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
       
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
  created() {
    this.listar();
    this.obtenerBodega();
    this.listar_perchas()
  },
};
</script>

<style></style>
