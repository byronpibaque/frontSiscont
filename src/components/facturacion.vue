<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Facturas</v-toolbar-title>
        <v-flex xs12 sm4 md4 lg4 xl4>
          <v-btn v-if="btn_nuevo == 0" color="white" small flat class="primary"
            @click="(modoActualizar = 0), (modoVer = 0), (btn_nuevo = 1), obtenerDatos()">
            <v-icon>add</v-icon>
            Nuevo
          </v-btn>
        </v-flex>
        <v-spacer></v-spacer>
        <v-text-field class="text-xs-center" v-model="search" append-icon="search"
          label="Búsqueda" single-line hide-details>
        </v-text-field>
      </v-toolbar>
      <!-- Ventana para crear una factura -->
      <v-container v-if="btn_nuevo" grid-list-sm class="pa-4 white">
        <v-layout wrap>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-text-field v-model="numComprobante" label="Número Comprobante">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-text-field v-model="ptoemision" label="Punto emisión">
            </v-text-field>
          </v-flex>
        </v-layout>
        <span>Datos Comprador</span>
        <div id="comprador">
          <v-layout wrap>
            <v-flex xs12 sm2 md2 lg2 xl2>
              <v-radio-group v-model="tipoIdentificacion" row>
                <v-radio label="Cedula" value="05"></v-radio>
                <v-radio label="RUC" value="04"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs12 sm2 md2 lg2 xl2>
              <v-text-field v-model="ruc_comprador" label="Cédula/RUC" type="number"
                v-on:keyup.enter="buscarCliente(ruc_comprador)">
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4 lg4 xl4>
              <v-text-field v-model="razonsocial_comprador" label="Razon Social/Apellidos y Nombres"
                v-on:keyup.enter="buscarCliente(razonsocial_comprador)"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4 lg4 xl4>
              <v-text-field v-model="direccion_comprador" label="Dirección Comprador">
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4 lg4 xl4>
              <v-text-field v-model="email_comprador" label="Email" type="email">
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4 lg4 xl4>
              <v-text-field v-model="telefono_comprador" label="Telefono">
              </v-text-field>
            </v-flex>
          </v-layout>
        </div>
        <span>Detalles de la factura</span>
        <v-flex xs12 sm12 md12 lg12 xl12>
          <v-btn v-if="!modoVer" color="white" small flat class="primary" @click="AgregarDetalle()">
            <v-icon>add</v-icon>
            Nuevo detalle
          </v-btn>
        </v-flex>
        <v-layout wrap>
          <v-flex xs12 sm6 md6 lg6 x6>
            <v-text-field v-model="codigo" label="Código" @keyup.enter="buscarCodigo(codigo)">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-btn small fab dark color="teal" @click="dialog = 1">
              <v-icon dark>list</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm3 md3 lg3 xl3>
            <v-checkbox v-model="isActaEntrega" label="ES ACTA DE ENTREGA"></v-checkbox>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2 v-show="errorArticulo">
            <div class="red--text" v-text="errorArticulo"></div>
          </v-flex>
        </v-layout>

        <!--DETALLE FACTURA-->
        <div id="comprador">
          <v-layout wrap>
            <v-flex xs12 sm12 md12 lg12 xl12>
              <template>
                <!-- DETALLE DE LOS PRODUCTOS -->
                <v-data-table :headers="cabeceraDetalles" :items="detalles" hide-actions class="elevation-1">
                  <template slot="items" slot-scope="props">
                    <td>
                      <v-icon small class="mr-2" @click="eliminarDetalle(detalles, props.item)">
                        delete
                      </v-icon>
                    </td>
                    <td>
                      <v-text-field v-model="props.item.codigoBarra" style="width: 150px">
                      </v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="props.item.codigoAuxiliar" style="width: 100px"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="props.item.descripcion" style="width: 220px"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="props.item.nombreComercial" style="width: 200px"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="props.item.registroSanitario"></v-text-field>
                    </td>

                    <td>
                      <v-text-field v-model="props.item.fechas" style="width: 240px"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="props.item.fraccionesTotales" 
                        disabled class="centrar-text-stock">
                      </v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="props.item.cantidad" class="centrar-text">
                      </v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="props.item.precioUni"></v-text-field>
                    </td>
                    <td>
                      <v-checkbox v-model="props.item.iva"></v-checkbox>
                    </td>
                    <td>
                      <v-text-field v-model="props.item.descuento"></v-text-field>
                    </td>
                    <td class="text-xs-right" v-if="props.item.iva">
                      {{
                        (
                          props.item.cantidad * props.item.precioUni +
                          props.item.cantidad * props.item.precioUni * 0.12
                        ).toFixed(6)
                      }}
                    </td>
                    <td class="text-xs-right" v-else>
                      {{
                        (props.item.cantidad * props.item.precioUni).toFixed(6)
                      }}
                    </td>
                  </template>
                  <template slot="no-data">
                    <h3>No hay artículos agregados al detalle.</h3>
                  </template>
                </v-data-table>
                <!-- FIN DE LOS DETALLE DE LOS PRODUCTOS -->
              </template>
            </v-flex>
          </v-layout>
        </div>
        <!--FIN DEL DETALLE FACTURA-->

        <span>Forma de pago</span>
        <v-flex xs12 sm4 md4 lg4 xl4>
          <v-btn v-if="!modoVer" color="white" small flat class="primary" @click="Agregarformapago()">
            <v-icon>add</v-icon>
            Nuevo detalle
          </v-btn>
        </v-flex>
        <v-layout wrap>
          <div id="formapago">
            <v-flex xs12 sm12 md12 lg12 xl12>
              <template>
                <v-data-table :headers="cabeceraFormapago" :items="detallesFP" hide-actions
                  class="elevation-1">
                  <template slot="items" slot-scope="props">
                    <td>
                      <v-icon small class="mr-2" @click="eliminarDetalle(detallesFP, props.item)">
                        delete
                      </v-icon>
                    </td>
                    <td>
                      <v-autocomplete v-model="props.item.formaPago" :items="formaspagos" label="Forma pago">
                      </v-autocomplete>
                    </td>
                    <td>
                      <v-text-field v-model="props.item.total"></v-text-field>
                    </td>
                    <td>
                      <v-autocomplete v-model="props.item.unidadTiempo" :items="tiempos" label="Tiempo">
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
              <strong>Subtotal:</strong>
              $
              {{ (totalParcial = calcularSubtotal) }}
            </v-flex>
            <v-flex class="text-xs-right">
              <strong>Total descuento:</strong>
              $
              {{ (totaldescuento = calcularDescuento) }}
            </v-flex>
            <v-flex class="text-xs-right">
              <strong>Total Impuesto:</strong>
              $ {{ (totalImpuesto = calcularIva) }}
            </v-flex>
            <v-flex class="text-xs-right">
              <strong>Total:</strong>
              $ {{ (total = calcularTotal) }}
            </v-flex>
          </div>
        </v-layout>
        <v-flex xs12 sm12 md12 v-show="valida">
          <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
          </div>
        </v-flex>
        <v-layout wrap>
          <v-flex xs2 sm2 md2 lg2 xl2>
            <v-btn color="primary" v-if="modoActualizar" @click.native="guardar()">
              <v-icon>send</v-icon>
              Guardar y Enviar
            </v-btn>
          </v-flex>
          <v-flex xs2 sm2 md2 lg2 xl2>
            <div v-if="modoActualizar">
              <v-btn color="green" v-if="!modoVer" @click.native="actualizarlaFactura()">
                <v-icon>forward_to_inbox</v-icon>
                Actualizar Borrador
              </v-btn>
            </div>
            <div v-else>
              <v-btn color="orange" v-if="!modoVer" @click.native="guardarFactura()">
                <v-icon>forward_to_inbox</v-icon>
                Guardar Borrador
              </v-btn>
            </div>
          </v-flex>
          <v-flex></v-flex>
          <v-flex xs2 sm2 md2 lg2 xl2>
            <v-btn color="red" @click.native="(btn_nuevo = 0), limpiar()">
              <v-icon>arrow_back</v-icon>
              Atras</v-btn
            >
          </v-flex>
        </v-layout>
      </v-container>
      <!-- Tabla de Facturas creadas -->
      <v-container v-if="btn_nuevo == 0" grid-list-sm class="pa-4 white">
        <v-data-table :headers="CabeceraFacturas" :items="Facturas" class="elevation-1" :search="search">
          <template v-slot:items="props">
            <td>
              <v-icon small class="mr-2" v-if="props.item.estado!=1" @click="actualizarFactura(props.item)"
                >edit</v-icon
              >
              <v-icon small class="mr-2" @click="verDetalleFactura(props.item)"
                >tab</v-icon
              >
              <template v-if="props.item.estado">
                <v-icon small @click="activarDesactivarMostrar(2, props.item)">
                  block
                </v-icon>
              </template>
          
            </td>
            <td class="blue--text">
              {{ props.item.numComprobante }}
            </td>
              <td v-if="props.item.claveAcceso" class="blue--text">
              {{ props.item.claveAcceso }}
            </td>
            <td v-else class="red--text">
              No autorizado.
            </td>
            <td>
              {{ props.item.codigoUsuario.nombres }}
            </td>

            <td>${{ props.item.total }}</td>

            <td>
              {{ formatearFecha(props.item.createdAt) }}
            </td>
            <td>
              <div v-if="props.item.estado">
                <span class="green--text">Aceptado</span>
              </div>
              <div v-else>
                <span class="orange--text">Pendiente a envio</span>
              </div>
            </td>
          </template>
          <template slot="no-data">
            <h3>No hay artículos agregados al detalle.</h3>
          </template>
        </v-data-table>
      </v-container>
    </v-flex>
    <!-- Ventana modal de Articulos -->
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
                        <v-icon small class="mr-2" @click="AddDeta(props.item)">
                          add
                        </v-icon>
                      </td>
                      <td class="blue--text">{{ props.item.codigoBarra }}</td>
                      <td class="blue--text">{{ props.item.codigoLote }}</td>
                      <td class="">{{ props.item.nombreComercial }}</td>
                      <td class="purple--text">{{ props.item.codigoProducto.fraccionCaja }}</td>
                      <td class="blue--text">{{ props.item.fraccionesTotales }}</td>
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
    <!-- Activar desactivar MOdal -->
       <v-dialog v-model="adModal" max-width="350">
          <v-card>
            <v-card-title class="headline" v-if="adAccion==1">Enviar para autorizar factura</v-card-title>
            <v-card-title class="headline" v-if="adAccion==2">Actualizar Item</v-card-title>
            <v-card-text>
              Estás a punto de
              <span v-if="adAccion==1">Enviar </span>
              <span v-if="adAccion==2">actualizar</span>
              la factura {{adNombre}} a autorizar.
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="activarDesactivarCerrar()" color="green darken-1" flat="flat">Cancelar</v-btn>
              <v-btn v-if="adAccion==1" @click="activar()"
                color="blue darken-4" flat="flat">
                Enviar
              </v-btn>
              <v-btn v-if="adAccion==2" @click="desactivar()" color="red darken-4" flat="flat">
                Anular
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </v-layout>
</template>

<script>
import moment from "moment";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      //Activar/Desactivar
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
      //Actualizar Factura
      IdActualizar: "",
      modoActualizar: 0,
      modoVer: 0,
      isActaEntrega: false,
      //Tabla Facturas
      CabeceraFacturas: [
        { text: "Seleccionar", value: "seleccionar", sortable: false },
        { text: "#comprobante", value: "numComprobante", sortable: false },
        { text: "Clave de Acceso", value: "claveAcceso", sortable: false },
        { text: "Usuario", value: "codigoUsuario", sortable: false },
        { text: "Total", value: "total", sortable: false },
        { text: "Fecha", value: "createdAt", sortable: true },
        { text: "Estado", value: "estado", sortable: false },
      ],
      Facturas: [],
      facturascontadas:0,
      //ETC
      search: "",
      btn_nuevo: 0,
      codigo: "",
      errorArticulo: "",
      //datos totales
      totalParcial: 0.0,
      totaldescuento: 0.0,
      totalImpuesto: 0.0,
      total: 0.0,
      //DATOS COMPRADOR
      _idCliente: "",
      tipoIdentificacion: "",
      direccion_comprador: "",
      telefono_comprador: "NN",
      email_comprador: "",
      razonsocial_comprador: "CONSUMIDOR FINAL",
      ruc_comprador: "9999999999999",
      //datos para la emision
      numComprobante: 0,
      ptoemision: "",
      idDatos: "",
      //DATOS DETALLES FACTURA
      cabeceraDetalles: [
        { text: "Borrar", value: "borrar", sortable: false },
        { text: "Codigo barras", value: "codigoBarra", sortable: false },
        { text: "Codigo de lote", value: "codigoAuxiliar", sortable: false },
        {
          text: "Descripcion de producto",
          value: "descripcion",
          sortable: false,
        },
        { text: "Nombre Comercial", value: "nombreComercial", sortable: false },
        {
          text: "Registro Sanitario",
          value: "registroSanitario",
          sortable: false,
        },
        { text: "Fechas de elaboracion", value: "fecha", sortable: false },

        { text: "Stock Actual", value: "stock", sortable: false },
        { text: "Cantidad", value: "cantidad", sortable: false },
        { text: "Pecio Unitario", value: "precioUni", sortable: false },
        { text: "Iva", value: "iva", sortable: false },
        { text: "Dcto.", value: "descuento", sortable: false },
        { text: "Subtotal", value: "subtotal", sortable: false },
      ],
      detalles: [],
      //FORMA PAGO
      cabeceraFormapago: [
        { text: "Borrar", value: "borrar", sortable: false },
        { text: "Forma de pago", value: "formapago", sortable: false },
        { text: "Total", value: "total", sortable: false },
        { text: "Plazo", value: "plazo", sortable: false },
        { text: "Tiempo", value: "unidadTiempo", sortable: false },
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
      //DATOS VALIDACION
      validaMensaje: [],
      valida: 0,
      dialog: 0,

      //XML
      detalleXml: [],
      detalleXmlFP:[],
      datosDistribuidores: [],
      //ARTICULOS
      texto: "",
      articulos: [],
      cabeceraArticulos: [
        { text: "Seleccionar", value: "seleccionar", sortable: false },
        { text: "Codigo Barras", value: "codigoBarras", sortable: false },
        { text: "Codigo Lote", value: "codigoLote", sortable: false },
        { text: "Nombre Comercial", value: "nombreComercial", sortable: true },
        {text:"F*Caja",value:"codigoProducto",sortable:false},
        {text:"Stock",value:"fraccionesTotales",sortable:true}
      ],
    };
  },
  watch: {},
  computed: {
    calcularTotal: function() {
      let resultado =
        parseFloat(this.calcularSubtotal) +
        parseFloat(this.calcularIva) -
        parseFloat(this.calcularDescuento);

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
        cant = parseInt(element.cantidad);
        pu = parseFloat(element.precioUni);
        val = cant * pu;
        if (element.iva != 0) {
          resultado = resultado + val * 0.12;
        }
      }

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
        cant = parseInt(element.cantidad);
        pu = parseFloat(element.precioUni);
        descto = parseInt(element.descuento);

        val = (cant * pu * descto) / 100;
        resultado = resultado + val;
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
        cant = parseInt(element.cantidad);
        pu = parseFloat(element.precioUni);
        val = cant * pu;
        resultado = resultado + val;
      }

      return resultado.toFixed(2);
    },
  },
  methods: {
    actualizarClave(id,clave,num){
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };


      axios
        .put("factura/actualizarC", {
          _id: id,
          claveAcceso:clave,
          numero:num
        })
        .then(function(response) {
          if(response.status==200){          
            me.limpiar();
            me.btn_nuevo=0
            me.listarFacturas();          
          }       
        }).catch(function(error) {
          console.log(error);
        });
    },
    actualizarlaFactura() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };

      axios
        .put("factura/actualizar", {
          _id: this.IdActualizar,
          detalles: this.detalles,
          formaPago: this.detallesFP,
          subTotal: this.totalParcial,
          total: this.total,
          totalImpuesto: this.totalImpuesto,
          totalDescuento: this.totaldescuento,
          codigoCliente: this._idCliente,
        })
        .then(function(response) {
          if(response.status==200){
                Swal.fire(
              "Noticias!",
              "Se actualizo el borrador de la factura.",
              "success"
            );
          me.limpiar();
          me.btn_nuevo=0
          me.listarFacturas();
          }else{
              Swal.fire(
              "Noticias!",
              "Hubo algun error al actualizar el borrador de la factura.",
              "error"
            );
          }
       
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    actualizarFactura(data) {
      this.IdActualizar = data._id;
      this._idCliente = data.codigoCliente._id;
      this.modoActualizar = 1;
      this.btn_nuevo = 1;
      this.tipoIdentificacion = data.codigoCliente.tipoDocumento;
      this.isActaEntrega = data.isActaEntrega;
      this.direccion_comprador = data.codigoCliente.direccion;
      this.telefono_comprador = data.codigoCliente.telefono;
      this.email_comprador = data.codigoCliente.email;
      this.razonsocial_comprador = data.codigoCliente.nombres;
      this.ruc_comprador = data.codigoCliente.numDocumento;
      this.numComprobante = data.numComprobante;
      this.ptoemision = data.ptoEmision;
      this.contarFacturasAut();
      this.listarDetalles(data._id);
    },
    verDetalleFactura(data) {
      this.modoVer = 1;
      this.btn_nuevo = 1;

      this.tipoIdentificacion = data.codigoCliente.tipoDocumento;
      this.direccion_comprador = data.codigoCliente.direccion;
      this.telefono_comprador = data.codigoCliente.telefono;
      this.email_comprador = data.codigoCliente.email;
      this.razonsocial_comprador = data.codigoCliente.nombres;
      this.ruc_comprador = data.codigoCliente.numDocumento;
      this.numComprobante = data.numComprobante;
      this.ptoemision = data.ptoEmision;
      this.isActaEntrega = data.isActaEntrega
      this.listarDetalles(data._id);
    },
    listarDetalles(id) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("factura/query?_id=" + id, configuracion)
        .then(function(response) {
          me.detalles = response.data.detalles;

          me.detallesFP = response.data.formaPago;
        }).catch(function(error) {
          console.log(error);
        });
    },
    listarFacturas() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;

      axios
        .get(
          "factura/list?codigoDistribuidor=" +
            codigoDistribuidor +
            "&codigoUsuario=" +
            codigoUsuario,
          configuracion
        )
        .then(function(response) {
          if (response.status == 206) Swal.fire("Aviso", response.data.message, "error");
          else me.Facturas = response.data;          
        }).catch(function(error) {
          console.log(error);
        });
    },
    listarArticulosnombres(code) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;

      axios.get(
          "inventario/busca?data=" + code + "&codigoBodega=" + me.codigoBodega,
          configuracion
        )
        .then(function(response) {
          if (response.status == 206) Swal.fire("Aviso", response.data.message, "error");
          else me.articulos = response.data;
        }).catch(function(error) {
          console.log(error);
        });
    },
    validar_guardar() {
      this.valida = 0;
      this.validaMensaje = [];

      if (this.numComprobante.length == 0) {
        this.validaMensaje.push("Debe ingresar el numero de comprobante.");
      }
      if (this.ptoemision.length == 0) {
        this.validaMensaje.push("Debe ingresar el punto de emision.");
      }

      if (this.ruc_comprador.length == 0) {
        this.validaMensaje.push("Debe ingresar el numero de RUC del cliente.");
      }
      if (this.razonsocial_comprador.length == 0) {
        this.validaMensaje.push("Falta razon social del proveedor.");
      }
      if (this.direccion_comprador.length == 0) {
        this.validaMensaje.push("Falta direccion del cliente.");
      }
      if (this.email_comprador.length == 0) {
        this.validaMensaje.push("Falta el email del cliente.");
      }
      if (this.telefono_comprador.length == 0) {
        this.validaMensaje.push("Falta el telefono del cliente.");
      }

      if (this.detalles.length == 0) {
        this.validaMensaje.push(
          "Debe ingresar al menos un detalle a la factura."
        );
      }
      if (this.detallesFP.length == 0) {
        this.validaMensaje.push(
          "Debe ingresar al menos un detalle a la forma de pago."
        );
      }
      for (let i = 0; i < this.detalles.length; i++) {
        const L = this.detalles[i];
        if (L.cantidad == 0 || L.cantidad.length == 0) {
          this.validaMensaje.push("Cantidad no puede ser un valor vacio.");
        }
        if (parseInt(L.cantidad) < 0) {
          this.validaMensaje.push("Cantidad no puede ser un valor negativo.");
        }

        if (L.precioUni == 0 || L.precioUni.length == 0) {
          this.validaMensaje.push("P. unitario no puede ser un valor vacio.");
        }
        if (parseInt(L.precioUni) < 0) {
          this.validaMensaje.push(
            "P. unitario no puede ser un valor negativo."
          );
        }
        if ( L.descuento.length == 0) {
          this.validaMensaje.push("Descuento no puede ser un valor vacio.");
        }
        if (parseInt(L.descuento) < 0) {
          this.validaMensaje.push("Descuento no puede ser un valor negativo.");
        }
        if (L.codigoBarra.length == 0) {
          this.validaMensaje.push("Debe ingresar el codigo de barras.");
        }
        if (L.codigoAuxiliar.length == 0) {
          this.validaMensaje.push("Debe ingresar el codigo auxiliar.");
        }
        if (L.descripcion.length == 0) {
          this.validaMensaje.push("Debe ingresar la descripcion del producto.");
        }
        if (L.nombreComercial.length == 0) {
          this.validaMensaje.push("Debe ingresar el nombre comercial.");
        }
        if (L.registroSanitario.length == 0) {
          this.validaMensaje.push("Debe ingresar el registro sanitario.");
        }
        if (L.fechas.length == 0) {
          this.validaMensaje.push("Debe ingresar las fechas.");
        }
      }

      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    guardarFactura() {
      if (this.validar_guardar()) { return; }

      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };

      //Código para guardar una factura
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;

      axios
        .post(
          "factura/add",
          {
            numComprobante: 0,
            ptoEmision: this.ptoemision,
            subTotal: this.totalParcial,
            total: this.total,
            totalImpuesto: this.totalImpuesto,
            totalDescuento: this.totaldescuento,
            detalles: this.detalles,
            formaPago: this.detallesFP,
            codigoCliente: this._idCliente,
            codigoBodega: this.codigoBodega,
            codigoDistribuidor: codigoDistribuidor,
            codigoUsuario: codigoUsuario,
            isActaEntrega: this.isActaEntrega
          },
          configuracion
        )
        .then(function(response) {
          if (response.status == 200) {
            Swal.fire(
              "Noticias!",
              "Se guardo un borrador de la factura.",
              "success"
            );
            me.listarFacturas()
            me.btn_nuevo=0
            me.limpiar()
          } else {
            Swal.fire(
              "Ops!",
              "Hubo problemas al intentar guardar la compra",
              "err"
            );
          }
         
        })
        .catch(function(error) {
          console.log(error);
        });
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
    buscarCodigo(code) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;

      axios.get(
          "inventario/buscaCodigo?data=" +
            code +
            "&codigoBodega=" +
            me.codigoBodega,
          configuracion
        ).then(function(response) {
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
              // console.log( response.data );
              me.AddDeta(response.data);
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
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
    AddDeta(data) {
      console.log(data);
      this.errorArticulo = null;
      if (this.encuentra(data._id) == true) {
        this.errorArticulo = "El artículo ya ha sido agregado.";
      } else {
        if(data.fraccionesTotales <= 0){
          Swal.fire("Fallo!", "No hay stock para "+data.nombreComercial, "error");
        }else{
           this.detalles.unshift({
          _id: data._id,
          codigoBarra: data.codigoBarra,
          codigoAuxiliar: data.codigoLote,
          descripcion: data.codigoProducto.descripcion+" ",
          nombreComercial: data.nombreComercial,
          registroSanitario: data.registroSanitario,
          fechas: `FE: ${ data.fechaElaboracion.split('T')[0] } FC: ${data.fechaCaducidad.split('T')[0]}`,
          cantidad: 0,
          precioUni: data.punit,
          iva: data.iva,
          descuento: data.descuento,
          fraccionesTotales: data.fraccionesTotales
        });
        }
        this.texto="";
        this.codigo = "";
      }
    },
    buscarCliente(data) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;

      axios
        .get("cliente/consulta?data=" + data, configuracion)
        .then(function(response) {
          if (response.data.length == 0) {
            Swal.fire("Aviso", `No hay datos para:${data}`, "error");
            me.tipoIdentificacion = "";
            me.direccion_comprador = "NN";
            me.telefono_comprador = "NN";
            me.email_comprador = "tuahorrocomprobantes@gmail.com";
            me.razonsocial_comprador = "CONSUMIDOR FINAL";
            me.ruc_comprador = "9999999999999";
          } else {
            me.tipoIdentificacion = response.data.tipoDocumento;
            me.direccion_comprador = response.data.direccion;
            me.telefono_comprador = response.data.telefono;
            me.email_comprador = response.data.email;
            me.razonsocial_comprador = response.data.nombres;
            me.ruc_comprador = response.data.numDocumento;
            me._idCliente = response.data._id;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    async datosDistribuidor() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let code = this.$store.state.usuario.codigoDistribuidor;

      const response = await axios.get(
        "distribuidor/query?_id=" + code,
        configuracion
      );
      return response.data;
    },
    guardar() {  
      let me = this;
      // return console.log( me.facturascontadas );
      this.generardetalle_xml();
      this.generardetallePago_xml()
      const datos = this.datosDistribuidor();
      let dirMatriz = "";
      let establecimiento = "";
      let porciento = "";
      let tarifa = "";
      if (parseFloat(this.totalImpuesto) != 0) {
        porciento = "2";
        tarifa = "12";
      } else {
        porciento = "0";
        tarifa = 0;
      }
     
      datos.then((result) => {
        result.establecimientos.forEach((element) => {
          if (element.tipoEstablecimiento == "MATRIZ") {
            dirMatriz = element.direccionEstablecimiento;
            establecimiento = element.numEstablecimiento;
          }
        });
        me.guardarXml(
          result.razonSocial,
          result.nombreComercial,
          result.ruc,
          dirMatriz,
          establecimiento,
          me.ptoemision,
          me.facturascontadas,
          dirMatriz,
          me.tipoIdentificacion,
          me.razonsocial_comprador,
          me.ruc_comprador,
          me.direccion_comprador,
          me.totalParcial,
          me.totaldescuento,
          "2",
          porciento,
          me.totalParcial,
          tarifa,
          me.totalImpuesto,
          me.total,
          me.email_comprador,
          me.direccion_comprador,
          me.telefono_comprador,
          me.isActaEntrega
        );
      }).catch((err) => {
        console.log(err);
      });
    },
    guardarXml(
      //InfoTributaria
      razonSocial,
      nombreComercial,
      ruc,
      dirMatriz,
      estab, //lugar donde se hizo la venta
      ptoemision,
      secuencial,
      //InfoFactura
      dirEstablecimiento,
      tipoIdentificacionComprador,
      razonSocialComprador,
      identificacionComprador,
      direccionComprador,
      totalSinImpuestos,
      totalDescuento,
      //Total con impuestos
      codigo,
      codigoPorcentaje,
      baseImponible,
      tarifa,
      valor,
      //Total de la factura
      importeTotal,
      //Datos adicionales del cliente
      emailCli,
      dirCli,
      telfCli,
      isACtaEntrega
    ) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let descuento = totalDescuento;
      let iva = valor;
      let deta = [];
      let totality = importeTotal;
      for (let index = 0; index < this.detalles.length; index++) {
        const element = this.detalles[index];
        let cant = 0;
        let pu = 0;
        let totalsinimpuesto = 0;
        let codigoPorcent = 0;
        let calculoporcentual = 0;
        let descto = 0;
        let tarifa = 0;
        let val = 0;
        cant = parseInt(element.cantidad);
        pu = parseFloat(element.precioUni);
        val = cant * pu;
        totalsinimpuesto = val.toFixed(2);
        if (this.detalles[index].iva != 0) {
          codigoPorcent = 2;
          calculoporcentual = (totalsinimpuesto * 0.12).toFixed(2);
          tarifa = 12;
        } else {
          codigoPorcent = 0;
          calculoporcentual = 0;
          tarifa = 0;
        }
        let det = [];
        det = [
          {
            codigoBarras: this.detalles[index].codigoBarra,
            codigoLote: this.detalles[index].codigoAuxiliar,
            producto: this.detalles[index].descripcion,
            nombreComercial: this.detalles[index].nombreComercial,
            fechas: this.detalles[index].fechas,
            registroSanitario: this.detalles[index].registroSanitario,
            cantidad: cant,
            precio: pu,
            descuento: descto,
            total: totalsinimpuesto,
          },
        ];

        deta.push(det);
      }

      axios
        .post(
          "http://localhost:10000/api/xml/xml",
          {
            infoTributaria: {
              razonSocial: razonSocial,
              nombreComercial: nombreComercial,
              ruc: ruc,
              dirMatriz: dirMatriz,
              estab: estab, //lugar donde se hizo la venta
              ptoEmi: ptoemision,
              secuencial: secuencial,
            },
            infoFactura: {
              dirEstablecimiento: dirEstablecimiento,
              tipoIdentificacionComprador: tipoIdentificacionComprador,
              razonSocialComprador: razonSocialComprador,
              identificacionComprador: identificacionComprador,
              direccionComprador: direccionComprador,
              totalSinImpuestos: totalSinImpuestos,
              totalDescuento: totalDescuento,
              totalConImpuestos: {
                totalImpuesto: {
                  codigo: codigo,
                  codigoPorcentaje: codigoPorcentaje,
                  baseImponible: baseImponible,
                  tarifa: tarifa,
                  valor: valor,
                },
              },
              propina: "0.00",
              importeTotal: importeTotal,
              pagos: {
                pago: this.detalleXmlFP,
              },
            },
            detalles: {
              detalle: this.detalleXml,
            },
            emailCli: emailCli,
            dirCli: dirCli,
            telfCli: telfCli,
          },
          configuracion
        )
        .then((response) => {
          if (response.status == 200) {
            let fecha = me.formatearFecha(moment().format());
            let key = response.data[0];
            let num = response.data[1];
            me.crearPDF_SLocal(
              key,
              num,
              fecha,
              nombreComercial,
              dirMatriz,
              dirEstablecimiento,
              direccionComprador,
              identificacionComprador,
              razonSocialComprador,
              deta,
              emailCli,
              telfCli,
              totality,
              descuento,
              iva,
              importeTotal,
              razonSocial,
              ruc
            );
            me.actualizarClave(me.IdActualizar,key,num);

            //Disminuye el stock del inventario              
            // if ( !isActaEntrega ) me.activar(me.IdActualizar);             
            me.activar(me.IdActualizar)
            me.actualizarConteo(me.facturascontadas);
            
          }else{
            Swal.fire(
              "Error",
              "Ocurrio un error al tratar de guardar la venta."
            );
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    generardetallePago_xml(){
      let me = this;
      for (let index = 0; index < this.detallesFP.length; index++) {
        this.detalleXmlFP[index] = [
          [
            {
              formaPago: this.detallesFP[index].formaPago,
              total: this.detallesFP[index].total,
              plazo: this.detallesFP[index].plazo,
              unidadTiempo: this.detallesFP[index].unidadTiempo,
            },
          ],
        ];
      }
    },
    generardetalle_xml() {
      let me = this;
      for (let index = 0; index < this.detalles.length; index++) {
        const element = this.detalles[index];
        let cant = 0;
        let pu = 0;
        let totalsinimpuesto = 0;
        let codigoPorcent = 0;
        let calculoporcentual = 0;
        let descto = 0;
        let tarifa = 0;
        let val = 0;
        cant = parseInt(element.cantidad);
        pu = parseFloat(element.precioUni);
        val = cant * pu;
        totalsinimpuesto = val.toFixed(2);
        if (this.detalles[index].iva != 0) {
          codigoPorcent = 2;
          calculoporcentual = (totalsinimpuesto * 0.12).toFixed(2);
          tarifa = 12;
        } else {
          codigoPorcent = 0;
          calculoporcentual = 0;
          tarifa = 0;
        }

        var detAdicional = [
          {
            "@nombre": "nombreComercial",
            "@valor": this.detalles[index].nombreComercial,
          },
          { "@nombre": "fechas", "@valor": this.detalles[index].fechas },
          {
            "@nombre": "regSanitario",
            "@valor": this.detalles[index].registroSanitario,
          },
        ];

        this.detalleXml[index] = [
          [
            {
              codigoPrincipal: this.detalles[index].codigoBarra,
              codigoAuxiliar: this.detalles[index].codigoAuxiliar,
              descripcion: this.detalles[index].descripcion,
              cantidad: cant,
              precioUnitario: pu,
              descuento: descto,
              precioTotalSinImpuesto: totalsinimpuesto,
              detallesAdicionales: [
                {
                  detAdicional,
                },
              ],
              impuestos: {
                impuesto: [
                  {
                    codigo: "2",
                    codigoPorcentaje: codigoPorcent,
                    tarifa: tarifa,
                    baseImponible: totalsinimpuesto,
                    valor: calculoporcentual,
                  },
                ],
              },
            },
          ],
        ];
      }
    },
    Agregarformapago() {
      let me = this;
      me.detallesFP.unshift({
        formaPago: "01",
        total: me.total,
        plazo: 0,
        unidadTiempo: "NINGUNO",
      });
    },
    eliminarDetalle(arr, item) {
      let i = arr.indexOf(item);
      if (i !== -1) {
        arr.splice(i, 1);
      }
    },
    AgregarDetalle() {
      let me = this;
      me.detalles.unshift({
        codigoBarra: "",
        codigoAuxiliar: "",
        descripcion: "",
        nombreComercial: "",
        registroSanitario: "",
        fechas: "",
        cantidad: 0,
        precioUni: 0.0,
        iva: 0,
        descuento: 0,
      });
    },
    crearPDF_SLocal(
      claveAcceso,
      numComprobante,
      fecha,
      farmacia,
      dirMatriz,
      dirFarmacia,
      clienteDireccion,
      clienteDocumento,
      clienteNombre,
      detalles,
      clienteEmail,
      clienteTelefono,
      subtotal,
      descuento,
      iva,
      total,
      propietario,
      rucpropietario
    ) {
      let me = this;
      let email = clienteEmail;

      let claveAccc = claveAcceso;

      axios
        .post("http://localhost:10000/api/pdf/pdf", {
          claveAcceso: claveAcceso,
          numComprobante: numComprobante,
          fecha: fecha,
          nombreComercial: farmacia,
          dirMatriz: dirMatriz,
          dirFarmacia: dirFarmacia,
          clienteDireccion: clienteDireccion,
          clienteDocumento: clienteDocumento,
          clienteNombre: clienteNombre,
          detalles: {
            detalle: detalles,
          },
          clienteEmail: clienteEmail,
          clienteTelefono: clienteTelefono,
          subtotal: subtotal,
          descuento: descuento,
          iva: iva,
          total: total,
          razonSocial: propietario,
          ruc: rucpropietario,
        })
        .then(function(response) {})
        .catch(function(error) {
          console.log(error);
        });
    },
    formatearFecha(value) {
      if (value) {
        return moment(String(value)).format("MM/DD/YYYY hh:mm");
      }
    },
    contarFacturasAut() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;

      axios
        .get(
          "data/contar?codigoUsuario=" +
            codigoUsuario +
            "&codigoDistribuidor=" +
            codigoDistribuidor,
          configuracion
        )
        .then(function(response) {
       
          me.facturascontadas = response.data;
          
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    obtenerDatos() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;

      axios
        .get(
          "data/query?codigoUsuario=" +
            codigoUsuario +
            "&codigoDistribuidor=" +
            codigoDistribuidor +
            "&documento=FACTURA",
          configuracion
        )
        .then(function(response) {
          // console.log(response.data);
         // me.numComprobante = response.data.secuencial;
          me.ptoemision = response.data.ptoEmision;
          me.idDatos = response.data._id;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    actualizarConteo(numero) {
      let me = this;
      axios
        .put("data/actualizarSecuencial", {
          _id: this.idDatos,
          documento: "FACTURA",
          numero:numero,
        })
        .then(function(response) {
          if (response.status == 200) {
            me.obtenerDatos();
            me.limpiar();
            Swal.fire("Noticias", "Se guardó correctamente.", "success");
          } else {
            Swal.fire(
              "Error",
              "Hubo algun error al momento de guardar la venta.",
              "error"
            );
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    limpiar() {
      this.modoVer = 0;
      this.detallesFP = [];
      this.detalles = [];
      this.detalleXml = [];
      this.totalParcial = 0.0;
      this.totaldescuento = 0.0;
      this.totalImpuesto = 0.0;
      this.total = 0.0;
      this.numComprobante=0
      this.tipoIdentificacion = "";
      this.direccion_comprador = "";
      this.telefono_comprador = "NN";
      this.email_comprador = "--@gmail.com";
      this.razonsocial_comprador = "CONSUMIDOR FINAL";
      this.ruc_comprador = "9999999999999";
    },
    limpiarbusqueda() {
      this.texto = "";
      this.articulos = [];
    },
    close() {
      this.dialog = 0;
      this.limpiarbusqueda();
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
    activar(id) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("factura/activate", { _id: id}, configuracion)
        .then(function(response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
         me.listarFacturas()
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
        .put("factura/deactivate", { _id: this.adId}, configuracion)
        .then(function(response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
       me.listarFacturas()
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  props: {},
  created() {
    this.obtenerDatos();
    this.obtenerBodega();
    this.listarFacturas();
  },
};
</script>

<style>
#comprador {
  padding: 1rem;
  text-align: center;
  margin-left: 5px;
  border-color: #aaaaaa;
  border-width: 1px;
  border-style: solid;
}

#formapago {
  width: 600px;
  padding: 1rem;
  text-align: center;
  margin-left: 5px;
  border-color: #aaaaaa;
  border-width: 1px;
  border-style: solid;
}
#totales {
  width: 400px;
  padding: 1rem;
  text-align: center;
  margin-left: 5px;
  border-color: #aaaaaa;
  border-width: 1px;
  border-style: solid;
}
.centrar-text-stock > div > div > div input {
  text-align: center;
  font-size: 16px;
  /* font-weight: 600; */
}
.centrar-text-stock > div > div > div input {
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  color: rgba(44, 32, 73, 0.87) !important;
}
</style>
