<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Consulta retenciones</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-btn class="info" @click="abrirFiltro()">FILTRAR</v-btn>
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
          <v-btn color="primary" dark class="mb-2" @click="verNuevo = 1" v-if="verNuevo" disabled
            >Nuevo</v-btn
          >
        </template>
      </v-toolbar>
      <v-flex xs12 sm12 md12 lg12 xl12>
        <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
          <v-layout wrap>
            <v-flex xs1 sm1 md1 lg1 xl1>
              <v-text-field
               readonly
                v-model="numComprobante"
                label="Número Comprobante"
              ></v-text-field>
            </v-flex>
            <v-flex xs1 sm1 md1 lg1 xl1>
              <v-text-field v-model="ptoemision"
              readonly
              label="Punto emisión"></v-text-field>
            </v-flex>
            <v-flex xs1 sm1 md1 lg1 xl1>
              <v-text-field
                v-model="pfMes"
                label="Periodo fiscal/Mes"
                readonly
              ></v-text-field>
            </v-flex>
            <v-flex xs1 sm1 md1 lg1 xl1>
              <v-text-field
                v-model="pfAnio"
                label="Periodo fiscal/Año"
                readonly
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout wrap>
            <v-flex xs1 sm1 md1 lg1 xl1>
              <v-autocomplete
              readonly
                v-model="documento"
                :items="documentos"
                label="Tipo de documento"
              ></v-autocomplete>
            </v-flex>

            <v-flex xs1 sm1 md1 lg1 xl1 v-if="documento">
              <v-text-field
                v-model="documento"
                label="cod. tipo doc."
                readonly
              ></v-text-field>
            </v-flex>
            <v-flex xs1 sm1 md1 lg1 xl1 v-else>
              <v-text-field v-model="otrotipodoc" label="cod. tipo doc."></v-text-field>
            </v-flex>
            <v-flex xs12 sm2 md2 lg2 xl2>
              <v-text-field
              readonly
                v-model="claveAccesodig"
                label="Numero de comprobante"
              ></v-text-field>
            </v-flex>
            <v-flex xs1 sm1 md1 lg1 xl1>
              <v-text-field
              readonly
                v-model="subtotalComprobante"
                label="SubTotal comprobante"
              ></v-text-field>
            </v-flex>
            <v-flex xs1 sm1 md1 lg1 xl1>
              <v-text-field v-model="totaliva" readonly label="Total I.V.A."></v-text-field>
            </v-flex>
            <v-flex xs1 sm1 md1 lg1 xl1>
              <v-text-field
                v-model="totalComprobante"
                label="Total comprobante"
                readonly
              ></v-text-field>
            </v-flex>
            <v-flex xs1 sm1 md1 lg1 xl1>
              <v-text-field
              readonly
                v-model="fechaEmisionComprobante"
                label="Fecha emision"
              ></v-text-field>
            </v-flex>
          </v-layout>

          <span>Datos del sujeto retenido</span>
          <div id="comprador">
            <v-layout wrap>
              <v-flex xs12 sm2 md2 lg2 xl2>
                <v-radio-group v-model="tipoIdentificacion" readonly row>
                  <v-radio label="Cedula" value="05"></v-radio>
                  <v-radio label="RUC" value="04"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex xs12 sm2 md2 lg2 xl2>
                <v-text-field
                readonly
                  v-model="ruc_sretenido"
                  label="Cédula/RUC"
                  type="number"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 md4 lg4 xl4>
                <v-text-field
                readonly
                  v-model="razonsocial_sretenido"
                  label="Razon Social/Apellidos y Nombres"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 md4 lg4 xl4>
                <v-text-field
                readonly
                  v-model="direccion_sretenido"
                  label="Dirección sretenido"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 md4 lg4 xl4>
                <v-text-field
                readonly
                  v-model="email_sretenido"
                  label="Email"
                  type="email"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 md4 lg4 xl4>
                <v-text-field v-model="telefono_sretenido" readonly label="Telefono"></v-text-field>
              </v-flex>
            </v-layout>
          </div>

          <span>Detalles del comprobante de retencion</span>

          <div id="comprador">
            <v-layout wrap>
              <v-flex xs12 sm12 md12 lg12 xl12>
                <template>
                  <v-data-table
                    :headers="cabeceraDetalles"
                    :items="detalles"
                    hide-actions
                    class="elevation-1"
                  >
                    <template slot="items" slot-scope="props">

                      <td>{{ props.item.codigo }}</td>
                      <td>{{ props.item.codigoRetencion }}</td>
                      <td>{{ props.item.baseImponible }}</td>
                      <td>{{ props.item.porcentajeRetener }}</td>
                      <td>{{ props.item.valorRetenido }}</td>
                      <td>{{ props.item.codDocSustento }}</td>
                      <td>{{ props.item.numDocSustento }}</td>
                      <td>{{ props.item.fechaEmisionDocSustento }}</td>
                    </template>
                    <template slot="no-data">
                      <h3>No hay artículos agregados al detalle.</h3>
                    </template>
                  </v-data-table>
                </template>
              </v-flex>
            </v-layout>
          </div>

        <v-btn class="primary" @click="verNuevo=0">Atras</v-btn>

        </v-container>
      </v-flex>
      <v-dialog v-model="filtroModal" max-width="700px">
        <v-card>
          <v-card-title>  <span class="headline">Filtre su busqueda </span></v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>

                  <v-flex xs12 sm6 md6>
                        <v-dialog
                          ref="dialog2"
                          v-model="modal5"
                          :return-value.sync="finicio"
                          persistent
                          width="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="finicio"
                                label="Fecha de inicio"
                                prepend-icon="event"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker v-model="finicio" scrollable>
                              <v-spacer></v-spacer>
                              <v-btn text color="primary" @click="modal5 = false">Cancelar</v-btn>
                              <v-btn
                                text
                                color="success"
                                @click="$refs.dialog2.save(finicio)"
                              >Aceptar</v-btn>
                            </v-date-picker>
                          </v-dialog>
                      </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-dialog
                      ref="dialog3"
                      v-model="modal2"
                      :return-value.sync="ffin"
                      persistent
                      width="290px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="ffin"
                            label="Fecha de fin"
                            prepend-icon="event"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="ffin" scrollable>
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="modal2 = false">Cancelar</v-btn>
                          <v-btn
                            text
                            color="success"
                            @click="$refs.dialog3.save(ffin)"
                          >Aceptar</v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg12 xl12 l12>
                     <div v-if="proveedor.length==0">
                         <v-text-field v-model="comprobanteBusqueda" label="# comprobante"></v-text-field>
                     </div>
                     <div v-else>
                          <v-text-field v-model="comprobanteBusqueda" disabled label="# comprobante"></v-text-field>
                     </div>

                    </v-flex>
                  <v-flex xs12 sm12 md12 lg12 xl12 l12>
                    <div v-if="comprobanteBusqueda.length==0">
                          <v-autocomplete v-model="proveedor" :items="proveedores" label="Proveedores" ></v-autocomplete>
                    </div>
                    <div v-else>
                           <v-autocomplete v-model="proveedor" :items="proveedores" disabled label="Proveedores" ></v-autocomplete>
                    </div>

                   </v-flex>

              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="buscarF(proveedor,comprobanteBusqueda,finicio,ffin)" class="primary">Buscar</v-btn>
            <v-btn @click="cerrarFiltro()" color="green darken-1" flat="flat"
              >Cancelar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
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
                          <v-icon small class="mr-2" @click="agregarDetalle(props.item)"
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
        :search="search"
      >
        <template v-slot:items="props">
          <td>
            <v-icon small class="mr-2" @click="verDetalleC(props.item)">tab</v-icon>
            <template v-if="props.item.estado">
              <v-icon small @click="activarDesactivarMostrar(2, props.item)"
                >block</v-icon
              >
            </template>
            <template v-else>
              <v-icon small @click="activarDesactivarMostrar(1, props.item)"
                >check</v-icon
              >
            </template>
          </td>
          <td class="blue--text">
             <div v-if="props.item.codigoCompra">{{props.item.codigoCompra.descripcion}}</div>
            <div v-else class="red--text">NO DEFINIDO</div>
          </td>
          <td>
            <div v-if="props.item.codigoCompra">{{props.item.codigoCompra.numComprobante}}</div>
            <div v-else class="red--text">NO DEFINIDO</div>
          </td>
          <td>
            {{props.item.secuencial}}
          </td>
          <td v-if="props.item.claveAcceso">
            {{ props.item.claveAcceso }}
          </td>
          <td v-else></td>

          <td>${{ props.item.total }}</td>


          <td>
            {{ formatearFecha(props.item.createdAt) }}
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
    calcularTotal: function () {
      let resultado =
        parseFloat(this.calcularSubtotal) +
        parseFloat(this.calcularIva) -
        parseFloat(this.calcularDescuento);
      return resultado.toFixed(2);
    },
    calcularDescuento: function () {
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
    calcularIva: function () {
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
    calcularSubtotal: function () {
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
      comprobanteBusqueda:"",
      proveedores:[],
      proveedor:"",
      finicio: "",
      ffin: "",
      modal5:false,
      modal2:false,

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
        { text: "# COMPROBANTE", value: "codigoCompra.numComprobante", sortable: false },
              { text: "# RETENCION", value: "secuencial", sortable: false },
        { text: "Clave de acceso", value: "claveAcceso", sortable: false },

        { text: "Total", value: "total", sortable: false },


        { text: "Fecha de emision", value: "fechaFactura", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
      ],
      compras: [],
      claveAcceso: "",
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

      codigo: "",
      errorArticulo: "",
      numComprobante: "",
      fechaFactura: "",
      descripcion: "",
      direccion_Proveedor: "",
      razonSocial_Proveedor: "",
      ruc_proveedor: "",
      codigoBodega: "",

      _idProveedor: "",
      _idCompra: "",
      totaliva: 0,
      fechaEmisionComprobante: "",
      otrotipodoc: 0,
      porcentajeRetencion: 0,
      valorRetenido: 0,
      codigoRetencion: "",
      impuestos: [
        { text: "I.V.A.", value: "2" },
        { text: "Impuesto a la renta", value: "1" },
      ],
      irDetalle: [
        {
          text:
            "303 - HONORARIOS PROFESIONALES Y DEMAS PAGOS POR SERVICIOS RELACIONADOS CON EL TITULO PROFESIONAL",
          value: ["303", 10],
        },
        {
          text:
            "304 - SERVICIOS PREDOMINA EL INTELECTO NO RELACIONADOS CON EL TITULO PROFESIONAL",
          value: ["304", 8],
        },
        {
          text:
            "304A - COMISIONES Y DEMAS PAGOS POR SERVICIOS PREDOMINA INTELECTO NO RELACIONADOS CON EL TITULO PROFESIONAL",
          value: ["304A", 8],
        },
        {
          text:
            "304B - PAGOS A NOTARIOS Y REGISTRADORES DE LA PROPIEDAD Y MERCANTIL POR SUS ACTIVIDADES EJERCIDAS COMO TALES",
          value: ["304B", 8],
        },
        {
          text:
            "304C - PAGOS A DEPORTISTAS, ENTRENADORES, ARBITROS, MIEMBROS DEL CUERPO TECNICO POR SUS ACTIVIDADES EJERCIDAD COMO TALES",
          value: ["304C", 8],
        },
        {
          text: "304D - PAGOS A ARTISTAS POR SUS ACTIVIDADES EJERCIDAD COMO TALES",
          value: ["304D", 8],
        },
        {
          text: "304E - HONORARIOS Y DEMAS PAGOS POR SERVICIOS DE DOCENCIA",
          value: ["304E", 8],
        },
        { text: "307 - SERVICIOS PREDOMINA LA MANO DE OBRA", value: ["307", 2] },
        {
          text: "308 - UTILIZACION O APROVECHAMIENTO DE LA IMAGEN O RENOMBRE",
          value: ["308", 10],
        },
        {
          text:
            "309 - SERVICIOS PRESTADOS POR MEDIOS DE COMUNICACION Y AGENCIAS DE PUBLICIDAD",
          value: ["309", 1],
        },
        {
          text:
            "310 - SERVICIOS DE TRANSPORTE PRIVADO DE PASAJEROS O TRANSPORTE PUBLICO O PRIVADO DE CARGA",
          value: ["310", 1],
        },
        {
          text:
            "311 - POR PAGOS A TRAVES DE LIQUIDACION DE COMPRA (NIVEL CULTURAL O RUSTICIDAD)",
          value: ["311", 2],
        },
        {
          text: "312 - TRANSFERENCIA DE BIENES MUEBLES DE NATURALEZA CORPORAL",
          value: ["312", 1],
        },
        {
          text:
            "312A - COMPRA DE BIENES DE ORIGEN AGRICOLA, AVICOLA, PECUARIO, APICOLA, CUNICULA, BIOACUATICO, Y FORESTAL",
          value: ["312A", 1],
        },
        {
          text:
            "314A - REGALIAS OIR CIBCEOTI DE FRANQUICIAS DE ACUERDO A LA LEY DE PROPIEDAD INTELECTUAL - PAGO A PERSONAS NATURALES",
          value: ["314A", 8],
        },
        {
          text:
            "314B - CANONES, DERECHOS DE AUTOR, MARCAS, PATENTES Y SIMILARES DE ACUERDO A LA LEY DE PROPIEDAD INTELECTUAL PAGO A PERSONAS NATURALES",
          value: ["314B", 8],
        },
        {
          text:
            "314C - REGALIAS POR CONCEPTO DE FRANQUICIAS DE ACUERDO A LEY DE PROPIEDAD INTELECTUAL PAGO A SOCIEDADES",
          value: ["314C", 8],
        },
        {
          text:
            "314D - CANONES, DERECHOS DE AUTOR, MARCAS, PATENTES Y SIMILARES DE ACUERDO A LEY DE PROPIEDAD INTELECTUAL PAGO A SOCIEDADES",
          value: ["314D", 8],
        },
        {
          text:
            "319 - CUOTAS DE ARRENDAMIENTO MERCANTIL, INCLUSIVE LA DE OPCION DE COMPRA",
          value: ["319", 1],
        },
        { text: "320 - POR ARRENDAMIENTO BIENES INMUEBLES", value: ["320", 8] },
        { text: "322 - SEGUROS Y REASEGUROS (PRIMAS Y CESIONES)", value: ["322", 1] },
        {
          text:
            "323 - POR RENDIMIENTOS FINANCIEROS PAGADOS A NATURALES Y SOCIEDADES (NO A IFIS)",
          value: ["323", 2],
        },
        { text: "323A - POR RF: DEPOSITOS CTA. CORRIENTE", value: ["323A", 2] },
        {
          text: "323B1 - POR RF: DEPOSITOS CTA. AHORROS SOCIEDADES",
          value: ["323B1", 2],
        },
        { text: "323E - POR RF: DEPOSITO A PLAZO FIJO GRAVADOS", value: ["323E", 2] },
        { text: "323E2 - POR RF: DEPOSITO A PLAZO FIJO EXENTOS", value: ["323E2", 0] },
        {
          text: "323F - POR RENDIMIENTOS FINANCIEROS: OPERACIONES DE REPORTO - REPOS",
          value: ["323F", 2],
        },
        {
          text:
            "323G - POR RF: INVERSIONES (CAPTACIONES) RENDIMIENTOS DISTINTOS DE AQUELLOS PAGADOS A IFIS",
          value: ["323G", 2],
        },
        { text: "323H - POR RF: OBLIGACIONES", value: ["323H", 2] },
        { text: "323I - POR RF: BONOS CONVERTIBLE EN ACCIONES", value: ["323I", 2] },
        {
          text: "323M - POR RF: INVERSIONES EN TITULOS VALORES EN RENTA FIJA GRAVADOS",
          value: ["323M", 2],
        },
        {
          text: "323N - POR RF: INVERSIONES EN TITULOS VALORE EN RENTA FIJA EXENTOS",
          value: ["323N", 0],
        },
        {
          text:
            "323O - POR RF: INTERESES PAGADOS A BANCOS Y OTRAS ENTIDADES SOMETIDAS AL CONTROL DE LA SUPERINTENDENCIA DE BANCOS Y DE LA EPS",
          value: ["323O", 0],
        },
        {
          text:
            "323P - POR RF: INTERESES PAGADOS POR ENTIDADES DEL SECTOR PUBLICO A FAVOR DE SUJETOS PASIVOS",
          value: ["323P", 2],
        },
        {
          text: "323Q - POR RF: OTROS INTERESES Y RENDIMIENTOS FINANCIEROS GRAVADOS",
          value: ["323Q", 2],
        },
        {
          text: "323R - POR RF: OTROS INTERESES Y RENDIMIENTOS FINANCIEROS EXENTOS",
          value: ["323R", 0],
        },
        {
          text:
            "324A - POR RF: INTERESES EN OPERACIONES DE CREDITO ENTRE INSTITUCIONES DEL SISTEMA FINANCIERO Y ENTIDADES ECONOMIA POPULAR Y SOLIDARIA ",
          value: ["324A", 1],
        },
        {
          text:
            "324B - POR RF: POR INVERSIONES ENTRE INSTITUCIONES DEL SISTEMA FINANCIERO Y ENTIDADES ECONOMIA POPULAR Y SOLIDARIA",
          value: ["324B", 1],
        },
        { text: "325 - ANTICIPO DIVIDENDOS", value: ["325", 22] },
        {
          text:
            "325A - DIVIDENDOS ANTICIPADOS PRESTAMOS ACCIONISTAS, BENEFICIARIOS O PARTICIPES",
          value: ["325A", 22],
        },
        {
          text:
            "326 - DIVIDENDOS DISTRIBUIDOS QUE CORRESPONDAN AL IMPUESTO A LA RENTA UNICO ESTABLECIDO EN EL ART. 27 DE LA LRTI",
          value: ["326", 0],
        },
        {
          text: "327 - DIVIDENDOS DISTRIBUIDOS A PERSONAS NATURALES RESIDENTES",
          value: ["327", 0],
        },
        {
          text: "328 - DIVIDENDOS DISTRIBUIDOS A SOCIEDADES RESIDENTES",
          value: ["328", 0],
        },
        {
          text: "329 - DIVIDENDOS DISTRIBUIDOS A FIDEICOMISOS RESIDENTES",
          value: ["329", 0],
        },
        {
          text:
            "330 - DIVIDENTOS GRAVADOS DISTRIBUIDOS EN ACCIONES (REINVERSIONES DE UTILIDADES SIN DERECHO A REDUCCION TARIFA IR)",
          value: ["330", 0],
        },
        {
          text:
            "331 - DIVIDENDOS EXENTOS DISTRIBUIDOS EN ACCIONES (REINVERSION DE UTILIDADES CON DERECHO A REDUCCION TARIFA IR)",
          value: ["331", 0],
        },
        {
          text: "332 - OTRAS COMPRAS DE BIENES Y SERVICIOS NO SUJETAS A RETENCION",
          value: ["332", 0],
        },
        {
          text:
            "332A - POR LA ENAJENACION OCASIONAL DE ACCIONES O PARTICIPACIONES Y TITULOS VALORES",
          value: ["332A", 0],
        },
        { text: "332B - COMPRA DE BIENES INMUEBLES", value: ["332B", 0] },
        { text: "332C - TRANSPORTE PUBLICO DE PASAJEROS", value: ["332C", 0] },
        {
          text:
            "332D - PAGOS EN EL PAIS POR TRANS. DE PASAJ O TRANS. INTERN. DE CARGA, A CIAS NACIONALES O EXTRANJERAS DE AVIACION O MARITIMAS",
          value: ["332D", 0],
        },
        {
          text:
            "332E - VALORES ENTREGADOS POR LAS COOPERATIVAS DE TRASNPORTE A SUS SOCIOS",
          value: ["332E", 0],
        },
        {
          text:
            "332F - COMPRAVENTA DE DIVISAS DISTINTAS AL DOLAR DE LOS ESTADOS UNIDOS DE AMERICA",
          value: ["332F", 0],
        },
        { text: "332G - PAGOS CON TARJETA DE CREDITO", value: ["332G", 0] },
        {
          text:
            "332H - PAGOS AL EXTERIOR TARJETA DE CREDITO REPORTADA POR LA EMISORA DE TARJETA DE CREDITO, SOLO RECAP",
          value: ["332H", 0],
        },
        {
          text: "332I - PAGO A TRAVES DE CONVENIO DE DEBITO (CLIENTES IFIS)",
          value: ["332I", 0],
        },
        {
          text:
            "333 - ENAJENACION DE DERECHOS REPRESENTATIVOS DE CAPITAL Y OTROS DERECHOS COTIZADOS EN BOLSA ECUATORIANA",
          value: ["333", 0.2],
        },
        {
          text:
            "334 - ENAJENACION DE DERECHOS REPRESENTATIVOS DE CAPITAL Y OTROS DERECHOS NO COTIZADOS EN BOLSA ECUATORIANA",
          value: ["334", 1],
        },
        { text: "335 - POR LOTERIAS, RIFAS, APUESTAS Y SIMILARES", value: ["335", 15] },
        {
          text: "336 - POR VENTA DE COMBUSTIBLES A COMERCIALIZADORAS",
          value: ["336", 0.2],
        },
        { text: "337 - POR VENTA DE COMBUSTIBLES A DISTRIBUIDORES", value: ["337", 0.3] },
        { text: "338 - COMPRA LOCAL DE BANANO A PRODUCTOR", value: ["338", 0] },
        {
          text:
            "323G - POR RF: INVERSIONES (CAPTACIONES) RENDIMIENTOS DISTINTOS DE AQUELLOS PAGADOS A IFIS",
          value: ["323G", 2],
        },
        { text: "323H - POR RF: OBLIGACIONES", value: ["323H", 2] },
        { text: "323I - POR RF: BONOS CONVERTIBLE EN ACCIONES", value: ["323I", 2] },
        {
          text: "323M - POR RF: INVERSIONES EN TITULOS VALORES EN RENTA FIJA GRAVADOS",
          value: ["323M", 2],
        },
        {
          text: "323N - POR RF: INVERSIONES EN TITULOS VALORE EN RENTA FIJA EXENTOS",
          value: ["323N", 0],
        },
        {
          text:
            "323O - POR RF: INTERESES PAGADOS A BANCOS Y OTRAS ENTIDADES SOMETIDAS AL CONTROL DE LA SUPERINTENDENCIA DE BANCOS Y DE LA EPS",
          value: ["323O", 0],
        },
        {
          text:
            "323P - POR RF: INTERESES PAGADOS POR ENTIDADES DEL SECTOR PUBLICO A FAVOR DE SUJETOS PASIVOS",
          value: ["323P", 2],
        },
        {
          text: "323N - POR RF: INVERSIONES EN TITULOS VALORE EN RENTA FIJA EXENTOS",
          value: ["323N", 0],
        },
      ],
      ivaDetalle: [
        { text: "1 - 30%", value: ["1", 30] },
        { text: "2 - 70%", value: ["2", 70] },
        { text: "3 - 100%", value: ["3", 100] },
        { text: "5 - 100% VALOR RETENIDO DISTRIBUIDOR", value: ["5", 100] },
        { text: "6 - 100% VALOR RETENIDO VOCEADORES VARIOS", value: ["6", 100] },
        { text: "7 - 0%", value: ["7", 0] },
        { text: "8 - 0% NO PROCEDE RETENCION", value: ["1", 30] },
        { text: "9 - 10%", value: ["9", 10] },
        { text: "10 - 20%", value: ["10", 20] },
      ],
      impuesto: "",
      totalComprobante: 0,
      subtotalComprobante: 0,
      claveAccesodig: "",
      pfAnio: "",
      pfMes: "",
      buscar: "",
      texto: "",
      tipoBusqueda: "",
      comprobantes: [],
      cabeceraComprobantes: [
        { text: "Opciones", value: "opciones" },
        { text: "Num Comprobante", value: "numComprobante" },
        { text: "Descripcion", value: "descripcion" },
        { text: "SubTotal", value: "subTotal" },
        { text: "Total", value: "total" },
        { text: "Fecha de emision", value: "fechaFactura", sorteable: "true" },
      ],
      numComprobante: "",
      ptoemision: "",
      idDatos: "",
      tipoIdentificacion: "",
      direccion_sretenido: "",
      telefono_sretenido: "",
      email_sretenido: "",
      razonsocial_sretenido: "",
      ruc_sretenido: "",
      detalles: [],
      cabeceraDetalles: [

        { text: "Codigo", value: "codigo" },
        { text: "Codigo retencion", value: "codigoRetener" },
        { text: "Base imponible", value: "baseImponible" },
        { text: "Porcentaje a retener", value: "porcentajeReneter" },
        { text: "Valor retenido", value: "valorRetenido" },
        { text: "Codigo doc.sust.", value: "codDocSustento" },
        { text: "Num. doc. sust.", value: "numDocSustento" },
        { text: "F. emis. doc. sust", value: "fechaEmisionDocSustento" },
      ],
      modalComprobantes: 0,
      documentos: [
        { text: "FACTURA", value: "01" },
        { text: "NOTA DEBITO", value: "05" },
        { text: "LIQ. COMPRAS", value: "03" },
        { text: "OTRO", value: 0 },
      ],
      documento: "",
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
      editedIndex: -1,
      _id: "",
      dialog: false,
      search: "",
      filtroModal:0
    };
  },
  props: {},
  methods: {
    buscarF(proveedor,comprobanteBusqueda,finicio,ffin){

      let me = this;
      me.compras=[]
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
        let fechaInicial = finicio;
        let fechaConverI = new Date(fechaInicial + " 00:00:01");
        let fechaFinal = ffin;
        let fechaConverF = new Date(fechaFinal + " 23:59:59");
        axios
          .get(
            "retenciones/buscar?finicio=" +
              fechaConverI.toISOString() +
              "&ffin=" +
              fechaConverF.toISOString()+
              "&numComprobante="+
              comprobanteBusqueda+
              "&codigoProveedor="+proveedor,
            configuracion
          )
          .then(function (response) {

            if(response.status==209){
              Swal.fire("Aviso",response.data.message,"error")
            }else{
              me.compras = response.data;
              me.cerrarFiltro()
            }

          })
          .catch(function (error) {
            console.log(error);
          });
    },
    obetenerProveedores() {
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("proveedor/list", configuracion)
        .then(function (response) {
          ArrayT = response.data;
          ArrayT.map(function (x) {
            me.proveedores.push({ text: x.razonsocial, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    abrirFiltro(){
      this.filtroModal=1
    },
    cerrarFiltro(){
      this.filtroModal=0
      this.limpiarFiltro()
    },
    limpiarFiltro(){
      this.proveedor=""
      this.comprobanteBusqueda=""
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
      axios
        .get("retenciones/query?_id=" + id, configuracion)
        .then(function (response) {
          me.detalles = response.data.impuestos;

          me.detalles.forEach((item, i) => {

              me.documento=item.codDocSustento
              me.claveAccesodig=item.numDocSustento
              me.fechaEmisionComprobante=item.fechaEmisionDocSustento
          });




        })
        .catch(function (error) {
          console.log(error);
        });
    },

    verDetalleC(data) {


      this.verNuevo = 1;
      this.numComprobante = data.secuencial;
      this.ptoemision=data.ptoEmi;
      this.pfMes = moment().format("MM");
      this.pfAnio = moment().format("YYYY");
      this.subtotalComprobante=data.subtotal
      this.totaliva=data.totalImpuesto
      this.totalComprobante=data.total
      let numCaracter = data.codigoProveedor.ruc.length;

      if (numCaracter == 10) {
        this.tipoIdentificacion = "05";
      } else if (numCaracter == 13) {
        this.tipoIdentificacion = "04";
      }
      this.ruc_sretenido = data.codigoProveedor.ruc;
      this.razonsocial_sretenido = data.codigoProveedor.razonsocial;
      this.direccion_sretenido = data.codigoProveedor.direccion;


      data.codigoProveedor.contacto.forEach((element) => {
        this.email_sretenido = element.correo;
        this.telefono_sretenido = element.telefono;
      });
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
          .get("retenciones/list?codigoDistribuidor=" + codigoDistribuidor, configuracion)
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
      if (this.validar_guardar()) {
        return;
      }
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };

      //Código para guardar
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;

      axios
        .post(
          "compras/add",
          {
            claveAcceso: this.claveAcceso,
            numComprobante: this.numComprobante,
            fechaFactura: this.fechaFactura,
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
            Swal.fire("Ops!", "Hubo problemas al intentar guardar la compra", "err");
          }
          me.limpiar();
          me.ocultarNuevo();
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
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
                unidadTiempo: unidadTiempo,
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
          "inventario/buscaCodigo?data=" + code + "&codigoBodega=" + me.codigoBodega,
          configuracion
        )
        .then(function (response) {
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
        .catch(function (error) {
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
        .then(function (response) {
          if (response.status == 206) {
            Swal.fire("Error", response.data.message, "error");
          } else {
            me.direccion_Proveedor = response.data.direccion;
            me.razonSocial_Proveedor = response.data.razonsocial;
            me._idProveedor = response.data._id;
          }
        })
        .catch(function (error) {
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
        .put("retenciones/activate", { _id: this.adId }, configuracion)
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
        .put("retenciones/deactivate", { _id: this.adId }, configuracion)
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
    this.obetenerProveedores()
  },
};
</script>

<style></style>
