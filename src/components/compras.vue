<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Compras</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field class="text-xs-center" v-model="search"
          append-icon="search" label="Búsqueda" single-line hide-details>
        </v-text-field>
        <v-spacer></v-spacer>
        <template>
          <v-btn v-show="esGuardaAlmacen"
            color="primary" dark class="mb-2" @click="verNuevo = 1" v-if="!verNuevo">
            Nuevo
          </v-btn>
        </template>
      </v-toolbar>

      <!-- CREAR NUEVA COMPRA -->
      <v-flex xs12 sm12 md12 lg12 xl12>
        <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
          <v-layout row wrap>
            <v-flex xs12 sm3 md3 lg3 xl3>
              <v-text-field v-model.trim="numComprobante" label="Numero Comprobante">
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6 lg6 xl6>
              <v-text-field v-model.trim="claveAcceso" label="Clave de acceso"></v-text-field>
            </v-flex>
         
            <v-flex xs12 sm3 md3>
              <v-dialog ref="dialog2" v-model="modal5" :return-value.sync="fechaFactura"
                persistent width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="fechaFactura" label="Fecha de factura"
                      prepend-icon="event" readonly v-bind="attrs" v-on="on">
                    </v-text-field>
                  </template>
                  <v-date-picker v-model="fechaFactura" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal5 = false">Cancelar</v-btn>
                    <v-btn
                      text
                      color="success"
                      @click="$refs.dialog2.save(fechaFactura)"
                    >Aceptar</v-btn>
                  </v-date-picker>
              </v-dialog>
            </v-flex>

            <v-flex xs12 sm9 md9 lg9 xl9>
              <v-textarea
              v-model="descripcion"
              label="Descripcion de la compra"
              ></v-textarea>
            </v-flex>

            <v-flex xs12 sm3 md3 style="display: flex;align-items: center;">
              <v-dialog ref="dialog3" v-model="modal6" :return-value.sync="fechaIngresoBodega"
                persistent width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="fechaIngresoBodega" label="Fecha de Ingreso a Bodega"
                      prepend-icon="event" readonly v-bind="attrs" v-on="on">
                    </v-text-field>
                  </template>
                  <v-date-picker v-model="fechaIngresoBodega" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal6 = false">Cancelar</v-btn>
                    <v-btn text color="success" @click="$refs.dialog3.save(fechaIngresoBodega)">
                      Aceptar
                    </v-btn>
                  </v-date-picker>
              </v-dialog>
            </v-flex>

            <v-flex xs12 sm6 md6 lg6 xl6>
              <v-autocomplete v-model="proveedorSelected" :disabled="isUpdating" :items="listProveedor"
                chips color="blue-grey lighten-2" label="Seleccionar Proveedor" 
                item-text="[razonsocial]" item-value="[razonsocial]" dense>
                <template v-slot:selection="data">
                  <v-chip :selected="data.selected" close @input="proveedorSelected = []">
                    {{ data.item.razonsocial }}
                  </v-chip>
                </template>
                <template v-slot:item="data">
                  <template>
                    <v-list-tile-content>
                      <v-list-tile-title v-html="data.item.razonsocial"></v-list-tile-title>
                    </v-list-tile-content>
                  </template>
                </template>
              </v-autocomplete>
            </v-flex>

            <v-flex xs12 sm2 md2 lg2 xl2>
              <v-text-field style="margin-top: 14px" v-model.trim="ruc_proveedor" 
                label="Ruc Proveedor" disabled>
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4 lg4 xl4>
              <v-text-field style="margin-top: 14px" v-model.trim="direccion_Proveedor" 
                label="Direccion" disabled>
              </v-text-field>
            </v-flex>

            <v-flex xs12 sm12 md12 lg12 xl12></v-flex>

            <v-flex xs12 sm8 md8 lg8 x8>
              <v-text-field v-model="codigo" label="Código" @keyup.enter="buscarCodigo(codigo)">
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm2 md2 lg2 xl2>
              <v-btn small fab dark color="teal" @click="dialog = 1">
                <v-icon dark>list</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs12 sm2 md2 lg2 xl2 v-show="errorArticulo">
              <div class="red--text" v-text="errorArticulo"></div>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12 xl12>
              <template>
                <v-data-table :headers="cabeceraDetalles" :items="detalles" hide-actions
                  class="elevation-1">
                  <template slot="items" slot-scope="props">
                    <td>
                      <v-icon small class="mr-2" @click="eliminarDetalle(detalles, props.item)">
                        delete
                      </v-icon>
                    </td>
                    <td class="blue--text">{{ props.item.codigoBarra }}</td>
                    <td class="blue--text">{{ props.item.codigoLote }}</td>
                    <td class="text-xs-center blue--text">{{ props.item.producto }}</td>
                    <td class="text-xs-center">
                      <v-text-field type="number" style="width: 60px" v-model="props.item.fracciones"></v-text-field>
                    </td>
                    <td class="text-xs-center">
                      <v-text-field type="number" v-model="props.item.bonificacion"></v-text-field>
                    </td>
                    <td class="text-xs-center green--text">
                      {{ props.item.fxcaja }}
                    </td>
                    <td class="text-xs-center green--text">
                      {{
                        (props.item.fraccionesTotales =
                          (parseInt(props.item.cantidad) +
                            parseInt(props.item.bonificacion)) +
                          parseInt(props.item.fracciones))
                      }}
                    </td>
                    <!-- <td class="text-xs-center green--text">
                       <v-text-field prefix="$" v-model="props.item.costoNeto" readonly></v-text-field>
                    </td> -->
                    <td class="text-xs-center green--text">
                      <v-text-field prefix="$" type="number" v-model="props.item.pcompra" @change="calcularCostoNeto()" style="width: 100px" class="centrar-textt">
                      </v-text-field>
                    </td>

                    <td class="text-xs-center green--text" v-if="props.item.iva">
                      <span>SI</span>
                    </td>

                    <td class="text-xs-center green--text" v-else>
                      <span>NO</span>
                    </td>
                    <td class="text-xs-center green--text">
                      <v-text-field type="number" prefix="$" v-model="props.item.descuento"
                         @change="calcularCostoNeto()" style="width: 100px">
                      </v-text-field>
                    </td>
                    <td class="text-xs-center green--text" v-if="props.item.iva">
                      ${{
                     ((parseFloat(props.item.fracciones)*parseFloat(props.item.pcompra))-parseFloat(props.item.descuento)).toFixed(2)
                      }}
                    </td>
                    <td class="text-xs-center green--text" v-else>
                      ${{
                    ( (parseFloat(props.item.fracciones)*parseFloat(props.item.pcompra))-parseFloat(props.item.descuento)).toFixed(2)
                      }}
                    </td>
                  </template>
                  <template slot="no-data">
                    <h3>No hay artículos agregados al detalle.</h3>
                  </template>
                </v-data-table>
                <span>Forma de pago</span>
                <v-flex xs12 sm4 md4 lg4 xl4>
                  <v-btn color="white" small flat class="primary"
                    @click="Agregarformapago()">
                    <v-icon>add</v-icon>
                    Nuevo detalle
                  </v-btn>
                </v-flex>
                <v-layout wrap>
                  <div id="formapago">
                    <v-flex xs12 sm12 md12 lg12 xl12>
                      <template>
                        <v-data-table :headers="cabeceraFormapago" :items="detallesFP"
                          hide-actions class="elevation-1">
                          <template slot="items" slot-scope="props">
                            <td>
                              <v-icon small class="mr-2" @click="eliminarDetalle(detallesFP, props.item)">
                                delete
                              </v-icon>
                            </td>
                            <td>
                              <v-autocomplete v-model="props.item.formaPago" :items="formaspagos"
                                label="Forma pago">
                              </v-autocomplete>
                            </td>
                            <td>
                              <v-text-field v-model="props.item.total"></v-text-field>
                            </td>
                            <td>
                              <v-autocomplete v-model="props.item.unidadTiempo" :items="tiempos"
                                label="Tiempo">
                              </v-autocomplete>
                            </td>
                            <td v-if="props.item.unidadTiempo == 'NINGUNO'">
                              <v-text-field v-model="props.item.plazo" disabled>
                              </v-text-field>
                            </td>
                            <td v-else>
                              <v-text-field v-model="props.item.plazo"></v-text-field>
                            </td>
                          </template>
                          <template slot="no-data">
                            <h3>No hay artículos agregados al detalle.</h3>
                          </template>
                        </v-data-table>
                      </template>
                    </v-flex>
                  </div>
                  <v-spacer></v-spacer>
                  <div id="totales">
                    <v-flex class="text-xs-right">
                      <strong>Sub Total:</strong>
                      ${{ (subtotal = calcularSubtotal) }}
                    </v-flex>
                    <v-flex class="text-xs-right">
                      <strong>Total Impuesto:</strong>
                      ${{ (totalimpuesto = calcularIva) }}
                    </v-flex>
                    <v-flex class="text-xs-right">
                      <strong>Total Descuento:</strong>
                      ${{ (totaldescuento = calcularDescuento) }}
                    </v-flex>
                    <v-flex class="text-xs-right">
                      <strong>Total:</strong>
                      ${{ (total = calcularTotal) }}
                    </v-flex>
                    <v-flex class="text-xs-right">
                      <strong>Total retenido:</strong>
                      ${{ totalRet }}
                    </v-flex>
                  </div>
                </v-layout>
              </template>
            </v-flex>

            <v-flex xs12 sm12 md12 v-show="valida">
              <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12 xl12>
              <v-btn color="blue darken-1" flat @click.native="ocultarNuevo()">
                Cancelar
              </v-btn>
              <v-btn color="success" v-if="verDetalle == 0 && !editando" @click.native="guardar()">
                Guardar
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
      <!-- FIN DE CREAR NUEVA COMPRA -->

      <!-- ACTIVAR O DESACTIVAR ITEMS -->
      <v-dialog v-model="adModal" max-width="290">
        <v-card>
          <v-card-title class="headline" v-if="adAccion == 1">Activar Item</v-card-title>
          <v-card-title class="headline" v-if="adAccion == 2"
            >Desactivar Item</v-card-title
          >
          <v-card-text>
            Estás a punto de
            <span v-if="adAccion == 1">activar</span>
            <span v-if="adAccion == 2">desactivar</span>
            el item {{ adNombre }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="activarDesactivarCerrar()" color="green darken-1" flat="flat"
              >Cancelar</v-btn
            >
            <v-btn
              v-if="adAccion == 1"
              @click="activar()"
              color="orange darken-4"
              flat="flat"
              >Activar</v-btn
            >
            <v-btn
              v-if="adAccion == 2"
              @click="desactivar()"
              color="orange darken-4"
              flat="flat"
              >Desactivar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- FINALIZACION DE ACTIVAR O DESACTIVAR ITEMS -->
      <v-dialog v-model="dialog" max-width="1000px">
        <v-card>
          <v-card-title>
            <span class="headline">Seleccione un artículo</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12 lg12 xl12>
                  <v-text-field v-model="texto" @keyup.enter="listarArticulosnombres(texto)"
                    class="text-xs-center" append-icon="search" label="Búsqueda">
                  </v-text-field>
                  <template>
                    <v-data-table :headers="cabeceraArticulos" :items="articulos" class="elevation-1">
                      <template v-slot:items="props">
                        <td class="justify-center layout px-0">
                          <v-icon small class="mr-2" @click="agregarDetalle(props.item)">
                            add
                          </v-icon>
                        </td>
                        <td class="blue--text">{{ props.item.codigoBarra }}</td>
                        <td class="blue--text">{{ props.item.codigoLote }}</td>
                        <td class="">{{ props.item.nombreComercial }}</td>
                        <td class="">{{ props.item.codigoProducto.fraccionCaja }}</td>
                        <td class="">{{ props.item.fraccionesTotales }}</td>
                        <td class="">{{ props.item.codigoFabricante.razonsocial }}</td>
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

      <!-- TABLA DE LISTADO DE LAS COMPRAS -->
      <v-data-table v-if="!verNuevo" :headers="cabeceraCompras" :items="compras"
        class="elevation-1" :search="search">
        <template v-slot:items="props">
          <td>
            <v-icon small class="mr-2" @click="verDetalleC(props.item)">tab</v-icon>
            <template v-if="esGuardaAlmacen">
              <template v-if="props.item.estado">
                <v-icon small @click="activarDesactivarMostrar(2, props.item)">block</v-icon>
              </template>
              <template v-else>
                <v-icon small @click="activarDesactivarMostrar(1, props.item)">check</v-icon>
              </template>
            </template>
          </td>
          <td class="blue--text"> {{ props.item.descripcion.toUpperCase() }} </td>
          <td> {{ props.item.codigoProveedor.razonsocial }} </td>
          <td> {{ props.item.numComprobante }} </td>
          <td v-if="props.item.claveAcceso"> {{ props.item.claveAcceso }} </td>
          <td v-else></td>
          <td>${{ props.item.subTotal }}</td>
          <td>${{ props.item.total }}</td>
          <td v-if="props.item.totalRetenido">${{ props.item.totalRetenido }}</td>
          <td v-else class="red--text">NO REGISTRA RETENCION</td>
          <td>${{ props.item.totalimpuesto }}</td>
          <td>${{ props.item.totaldescuento }}</td>
          <td>
            {{ formatearFecha(props.item.fechaFactura) }}
          </td>
          <td>
            <div v-if="props.item.estado">
              <span class="green--text">Aceptado</span>
            </div>
            <div v-else>
              <span class="red--text">Anulado</span>
            </div>
          </td>
        </template>
        <template slot="no-data">
          <h3>No hay artículos agregados al detalle.</h3>
        </template>
      </v-data-table>
      <!-- FIN TABLAS COMPRAS -->

    </v-flex>
  </v-layout>
</template>

<script>
import moment from "moment";
import axios from "axios";
import Swal from "sweetalert2";
export default {
  name: 'IndexCompras',
  computed: {
    calcularTotal: function () {
      let resultado =
        parseFloat(this.calcularSubtotal) +
        parseFloat(this.calcularIva) 
      return resultado.toFixed(2);
    },
    calcularDescuento: function () {
      let resultado = 0.0;
       for (let index = 0; index < this.detalles.length; index++) {
       
        const element = this.detalles[index];
        resultado = resultado +(parseFloat(element.descuento))
      }
      return resultado.toFixed(2);
    },
    calcularIva: function () {
      let resultado = 0.0;

      for (let index = 0; index < this.detalles.length; index++){
        let cant = 0;
        let fracc = 0;
        let fxc=0
        let val=0
        let pcompra=0
        let descuento=0
        let totalfracciones = 0;
        const element = this.detalles[index];

        if ( element.iva ) {
          fracc = parseFloat(element.fracciones);
          pcompra = parseFloat(element.pcompra);
          descuento = parseFloat(element.descuento);
  
          totalfracciones = (fracc * pcompra) - descuento ;
         
          resultado = resultado + totalfracciones;          
        }

      }

      resultado = resultado * 0.12
      
      return resultado.toFixed(2);
    },
    calcularSubtotal: function () {
      let resultado = 0.0;

      for (let index = 0; index < this.detalles.length; index++){
        let cant = 0;
        let fracc = 0;
        let fxc=0
        let val=0
        let pcompra=0
        let descuento=0
        let totalfracciones = 0;
        const element = this.detalles[index];

        fracc = parseFloat(element.fracciones);
        pcompra = parseFloat(element.pcompra);
        descuento = parseFloat(element.descuento);

        totalfracciones = (fracc * pcompra) - descuento ;
       
        resultado = resultado + totalfracciones;
      }

      return resultado.toFixed(2);
    },
    esGuardaAlmacen() {
      return (this.$store.state.usuario.rol == "609ed47286d0416b4a050c58");
    }
  },
  watch: {
    isUpdating (val) {
      if (val) { setTimeout(() => (this.isUpdating = false), 3000) }
    },
    proveedorSelected(newValue, _){
      if ( newValue.length == 0 ) {
        this.ruc_proveedor          = ""
        this.razonSocial_Proveedor  = ""
        this.direccion_Proveedor    = ""
        this._idProveedor           = ""
      }else{
        const proveedor = this.listProveedor.find( proveedor => proveedor.razonsocial == newValue )
        this.ruc_proveedor          = proveedor.ruc
        this.razonSocial_Proveedor  = proveedor.razonsocial
        this.direccion_Proveedor    = proveedor.direccion
        this._idProveedor           = proveedor._id
      }
    },
    verNuevo(newValue, _){
      if ( newValue == 1 && !this.editando ) {
        this.getProveedores();
      }
    }
  },
  data() {
    return { 
      editando: false,
      autoUpdate: true,
      proveedorSelected: [],
      isUpdating: false,
      listProveedor: [],
      modal5:false,
      modal6:false,
      cabeceraFormapago: [
        { text: "Borrar", value: "borrar", sortable: false },
        { text: "Forma de pago", value: "formapago", sortable: false },
        { text: "Total a pagar", value: "total", sortable: false },
        { text: "Plazo en:", value: "plazo", sortable: false },
        { text: "Tiempo en:", value: "unidadTiempo", sortable: false },
      ],
      detallesFP: [],
      formaspagos: [
        { text: "SIN UTILIZACION DEL SISTEMA FINANCIERO", value: "01" },
        { text: "COMPENSACIÓN DE DEUDAS", value: "15" },
        { text: "TARJETA DE DÉBITO", value: "16" },
        { text: "DINERO ELECTRÓNICO", value: "17" },
        { text: "TARJETA PREPAGO", value: "18" },
        { text: "TARJETA DE CRÉDITO", value: "19" },
        { text: "OTROS CON UTILIZACION DEL SISTEMA FINANCIERO", value: "20" },
        { text: "ENDOSO DE TÍTULOS", value: "21" },
      ],
      tiempos: ["NINGUNO", "dias", "meses", "años"],
      totalRet: 0,
      cabeceraCompras: [
        { text: "Opciones", value: "borrar", sortable: false },
        { text: "DESCRIPCION", value: "descripcion", sortable: false },
        { text: "Proveedor", value: "razonsocial",sortable: true },
        { text: "# COMPROBANTE", value: "numComprobante", sortable: false },
        { text: "Clave de acceso", value: "claveAcceso", sortable: false },
        { text: "Sub Total", value: "subTotal", sortable: false },
        { text: "Total", value: "total", sortable: false },
        { text: "Total retenido", value: "totalRetenido", sortable: false },
        { text: "Impuestos", value: "totalimpuesto", sortable: false },
        { text: "Descuentos", value: "totaldescuento", sortable: false },
        { text: "Fecha de emision", value: "fechaFactura", sortable: true },
        { text: "Estado", value: "estado", sortable: true },
      ],
      compras: [],
      claveAcceso: "",
      _idProveedor: "",
      texto: "",
      articulos: [],
      cabeceraArticulos: [
        { text: "Seleccionar", value: "seleccionar", sortable: false },

        { text: "Codigo Barras", value: "codigoBarra", sortable: false },
        { text: "Codigo Lote", value: "codigoLote", sortable: false },
        { text: "Nombre Comercial", value: "nombreComercial", sortable: false },
          { text: "F x Caja", value: "fraccionCaja", sortable: false },
            { text: "Stock", value: "fraccionesTotales", sortable: false },
              { text: "Laboratorio", value: "codigoFabricante.descripcion", sortable: false },
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
        { text: "Borrar", value: "borrar", sortable: false },
        { text: "Codigo Barras", value: "codigoBarra", sortable: false },
        { text: "Codigo Lote", value: "codigoLote", sortable: false },
        { text: "Producto", value: "producto", sortable: false },
        { text: "Unidades", value: "fracciones", sortable: false },
        { text: "Bonificacion", value: "bonificacion", sortable: false },
        { text: "U * Caja", value: "fxcaja", sortable: false },
        { text: "U Totales", value: "fraccionesTotales", sortable: false },
        // { text: "Costo Neto", value: "costoNeto", sortable: false },
        { text: "P Compra", value: "pcompra", sortable: false },
        { text: "IVA?", value: "iva", sortable: false },
        { text: "Descuento", value: "descuento", sortable: false },
        { text: "Sub Total", value: "subtotal", sortable: false },
      ],
      detalles: [],
      codigo: "",
      errorArticulo: "",
      numComprobante: "",
      fechaFactura: "",
      fechaIngresoBodega: "",
      descripcion: "",
      direccion_Proveedor: "",
      razonSocial_Proveedor: "",
      ruc_proveedor: "",
      codigoBodega: "",
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
    };
  },
  methods: {
    getProveedores(edit = false, proveedor = null) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios.get("proveedor/list", configuracion).then(function(response) {
        me.listProveedor = response.data
        if (edit) me.proveedorSelected = proveedor
      }).catch(function(error) {
        console.log(error);
      });
    },
    calcularCostoNeto(){      
      this.detalles.forEach(element => {   

        let f=parseFloat(element.fracciones)

        let desc=parseFloat(element.descuento)
        
        if(element.iva){
          let imp = parseInt(f)*parseFloat(element.pcompra)*0.12
          
          
          let subtotal= (parseFloat(f)*parseFloat(element.pcompra)-desc)+imp
          
          console.log( subtotal );
          let cNeto = (parseFloat(subtotal) / parseFloat(element.fraccionesTotales))
          
          element.costoNeto=parseFloat(cNeto).toFixed(2)  
       }else{
        let subtotal= parseFloat(f)*parseFloat(element.pcompra)-desc
        let cNeto = (parseFloat(subtotal) / parseFloat(element.fraccionesTotales))
        element.costoNeto=parseFloat(cNeto).toFixed(2)
       }
      });
    },
    Agregarformapago() {
      let me = this;
      me.detallesFP.unshift({
        formaPago: "01",
        total: this.total,
        plazo: 0,
        unidadTiempo: "NINGUNO",
      });
    },
    listarDetalles(id) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };

      axios.get("compras/query?_id=" + id, configuracion).then(function (response) {
        me.detalles = response.data.detalles;
        me.detallesFP = response.data.formaPago;
      }).catch(function (error) {
        console.log(error);
      });
    },
    async verDetalleC(data) {
      console.log(data);
      this.claveAcceso = data.claveAcceso;
      this.totalRet = data.totalRetenido;
      this.verNuevo = 1;
      this.editando = true;
      this.numComprobante = data.numComprobante;
      this.descripcion = data.descripcion;
      this.fechaFactura = this.formatearFecha(data.fechaFactura);
      this.fechaIngresoBodega = this.formatearFecha(data.fechaIngresoBodega);

      this.listarDetalles(data._id);

      await this.getProveedores(true, data.codigoProveedor.razonsocial);
    },
    formatearFecha(value) {
      if (value) { return moment(String(value)).format("YYYY-MM-DD"); }
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
          .get("compras/list?codigoDistribuidor=" + codigoDistribuidor, configuracion)
          .then(function (response) {
            if (response.status == 200) {
              me.compras = response.data;
            } else {
              console.log(response);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    ocultarNuevo() {
      this.editando = false;
      this.proveedorSelected = '';
      this.verNuevo = 0;
      this.limpiar();
    },
    limpiar() {
      this.detallesFP = [];
      this.claveAcceso = "";
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
          .get("bodega/query?codigoDistribuidor=" + codigoDistribuidor, configuracion)
          .then(function (response) {
            me.codigoBodega = response.data._id;
          })
          .catch(function (error) {
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
        .then(function (response) {
          if (response.status == 206) {
            Swal.fire("Aviso", response.data.message, "error");
          } else {
            console.log(response.data);
            me.articulos = response.data;
          }
        })
        .catch(function (error) {
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
        this.validaMensaje.push("Debe ingresar la fecha de emision de la factura.");
      }
      if (this.descripcion.length == 0) {
        this.validaMensaje.push("Debe ingresar la descripcion de la compra");
      }
      if (this.ruc_proveedor.length == 0) {
        this.validaMensaje.push("Debe ingresar el numero de RUC del proveedor.");
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
          this.validaMensaje.push("BONIFICACION no puede ser un valor negativo.");
        }
        if (L.pvm == 0 || L.pvm.length == 0) {
          this.validaMensaje.push("PVM no puede ser un valor vacio.");
        }
        // if (L.pvp == 0 || L.pvp.length == 0) {
        //   this.validaMensaje.push("PVP no puede ser un valor vacio.");
        // }
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
      if (this.validar_guardar()) return;
      
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };

      //Código para guardar
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;
      let fecha = new Date(this.fechaFactura+' 05:00:00')
      let fechaI = new Date(this.fechaIngresoBodega+' 05:00:00')
      axios
        .post("compras/add", {
            claveAcceso: this.claveAcceso,
            numComprobante: this.numComprobante,
            fechaFactura: fecha.toISOString(),
            fechaIngresoBodega: fechaI.toISOString(),
            subTotal: this.subtotal,
            total: this.total,
            totalImpuesto: this.totalimpuesto,
            totalDescuento: this.totaldescuento,
            detalles: this.detalles,
            formaPago: this.detallesFP,
            descripcion: this.descripcion,
            codigoProveedor: this._idProveedor,
            codigoBodega: this.codigoBodega,
            codigoDistribuidor: codigoDistribuidor,
            codigoUsuario: codigoUsuario,
          },
          configuracion
        )
        .then(function (response) {
          if (response.status == 200) {
            me.detallesFP.forEach((element) => {
              if (element.plazo != 0) {
                me.generarCuentaPorPagar(
                  element.total,
                  element.unidadTiempo,
                  element.plazo,
                  response.data._id,
                  me._idProveedor,
                  codigoDistribuidor,
                  codigoUsuario,
                  me.total,
                  me.numComprobante,
                  me.fechaFactura,
                  me.descripcion
                );
              }
            });
            Swal.fire("Noticias!", "Se guardo correctamente la compra.", "success");
          } else {
            Swal.fire("Ops!", "Hubo problemas al intentar guardar la compra", "error");
          }
          me.limpiar();
          me.ocultarNuevo();
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
          Swal.fire("Ops!", error.response.data.message, "error");
        });
    },
    async obtenerConteoCTaPC() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let code = this.$store.state.usuario.codigoDistribuidor;

      const response = await axios.get("cuentasporpagar/contar", configuracion);
      return response.data;
    },
    generarCuentaPorPagar(
      totalFP,
      unidadTiempo,
      plazo,
      codigoCompra,
      codigoProveedor,
      codigoDistribuidor,
      codigoUsuario,
      totalF,
      numComprobante,
      fechaFactura,
      descripcion
    ) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      const contador = this.obtenerConteoCTaPC();
      let cuentaCuentas = "";
      contador
        .then((result) => {
          cuentaCuentas = result;

          axios
            .post(
              "cuentasporpagar/add",
              {
                numComprobante: cuentaCuentas,
                plazo: plazo,
                totalFormaPago: totalFP,
                totalPagado:0,
                unidadTiempo: unidadTiempo,
                codigoCompra:codigoCompra,
                codigoProveedor: codigoProveedor,
                codigoDistribuidor: codigoDistribuidor,
                codigoUsuario: codigoUsuario,
                totalFactura: totalF,
                numComprobanteFactura: numComprobante,
                fechaFactura: fechaFactura,
                descripcion: descripcion,
              },
              configuracion
            )
            .then(function (response) {})
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
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
          codigoLote:data.codigoLote,
          codigoBarra:data.codigoBarra,
          producto: data.nombreComercial,
          cantidad: 0,
          fracciones: 0,
          bonificacion: 0,
          fxcaja: data.codigoProducto.fraccionCaja,
          fraccionesTotales: data.fraccionesTotales,
          costoNeto: 0,
          pcompra:0,
          pvp: data.pvp,
          pvm: data.pvm,
          punit: data.punit,
          descuento: 0,
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

      axios.get("inventario/buscaCodigo?data=" + code + "&codigoBodega=" + me.codigoBodega,
          configuracion).then(function (response) {
          console.log( response.data );
          if (response.status == 206) {
            Swal.fire("Aviso", response.data.message, "error");
          } else {
            if (response.data.length > 1) {
              Swal.fire("Aviso","Se estan mostrando mas de un resultado \n deberia buscar en pantalla.",
                "error");
            } else {
              me.agregarDetalle(response.data);
            }
          }
        }).catch(function (error) {
          console.log(error);
        });
    },
    activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.numComprobante;
      this.adId = item._id;
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
        .put("compras/activate", { _id: this.adId }, configuracion)
        .then(function (response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    desactivar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("compras/deactivate", { _id: this.adId }, configuracion)
        .then(function (response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created() {
    this.listar();
    this.obtenerBodega();
  },
};
</script>

<style>
.centrar-textt > div > div > div input {
  text-align: center;
  font-size: 17px;
  /* font-weight: 600; */
  /* color: rgb(64 27 153 / 87%) !important; */
}
</style>
