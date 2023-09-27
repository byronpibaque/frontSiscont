<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Egresos</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field class="text-xs-center" v-model="search" append-icon="search"
          label="Búsqueda" single-line hide-details>
        </v-text-field>
        <v-spacer></v-spacer>
        <template>
          <v-btn v-show="esGuardaAlmacen" color="primary" 
            dark class="mb-2" @click="verNuevo = 1" v-if="!verNuevo">
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
         
            <v-flex xs12 sm3 md3>
                <v-dialog ref="dialog2" v-model="modal5" :return-value.sync="fechaFactura"
                  persistent width="290px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="fechaFactura" label="Fecha de factura" prepend-icon="event" readonly v-bind="attrs" v-on="on">
                    </v-text-field>
                    </template>
                    <v-date-picker v-model="fechaFactura" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modal5 = false">Cancelar</v-btn>
                      <v-btn text color="success" @click="$refs.dialog2.save(fechaFactura)">
                        Aceptar
                      </v-btn>
                    </v-date-picker>
                </v-dialog>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12 xl12>
              <v-textarea v-model="descripcion" label="Descripcion del egreso">
              </v-textarea>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12 xl12></v-flex>
            <span>Datos de cliente</span>
            <v-flex xs12 sm12 md12 lg12 xl12></v-flex>

            <v-flex xs12 sm5 md5 lg5 xl5>
              <v-autocomplete v-model="clienteSelected" :disabled="isUpdating" :items="listClientes"                chips color="blue-grey lighten-2" label="Seleccionar Cliente" 
                item-text="[nombres]" item-value="[nombres]" dense>
                <template v-slot:selection="data">
                  <v-chip :selected="data.selected" close @input="clienteSelected = []">
                    {{ data.item.nombres }}
                  </v-chip>
                </template>
                <template v-slot:item="data">
                  <template>
                    <v-list-tile-content>
                      <v-list-tile-title v-html="data.item.nombres"></v-list-tile-title>
                    </v-list-tile-content>
                  </template>
                </template>
              </v-autocomplete>
            </v-flex>

            <v-flex xs12 sm2 md2 lg2 xl2 style="margin-top: 11px">
              <v-text-field v-model="doc_cliente" label="Num documento"
                @keyup.enter="buscarCliente(doc_cliente)">
              </v-text-field>
            </v-flex>

            <v-flex xs12 sm5 md5 lg5 xl5 style="margin-top: 11px">
              <v-text-field v-model="direccion_Cliente" label="Direccion" disabled>
              </v-text-field>
            </v-flex>
           
            <v-flex xs12 sm12 md12 lg12 xl12></v-flex>
            <span>Datos de productos</span>
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
                    <td class="text-xs-center blue--text">
                      {{ props.item.producto }}
                    </td>
                    <td class="text-xs-center">
                      <v-text-field v-model="props.item.cantidad"></v-text-field>
                    </td>
                    <td class="text-xs-center">
                      <v-text-field v-model="props.item.fracciones"></v-text-field>
                    </td>           
                    <td class="text-xs-center green--text">
                      {{ props.item.fxcaja }}
                    </td>
                    <td class="text-xs-center green--text">
                      {{
                        (props.item.fraccionesTotales =
                          parseInt(props.item.cantidad) *
                            parseInt(props.item.fxcaja) +
                          parseInt(props.item.fracciones))
                      }}
                    </td>
                    <td  class="text-xs-center blue--text"> {{ props.item.stock }} </td>
                    <td class="text-xs-center green--text">{{ props.item.codigoLote }}</td>                    
                    <td class="text-xs-center green--text">{{ props.item.registroSanitario }}</td>
                    <td class="text-xs-center green--text">
                      <v-text-field prefix="$" v-model="props.item.pvp"></v-text-field>
                    </td>
                    <td class="text-xs-center green--text">
                      <v-text-field prefix="$" v-model="props.item.punit"></v-text-field>
                    </td>

                    <td class="text-xs-center green--text" v-if="props.item.iva">
                      <span>SI</span>
                    </td>

                    <td class="text-xs-center green--text" v-else>
                      <span>NO</span>
                    </td>
                    <td class="text-xs-center green--text">
                      <v-text-field
                        suffix="%"
                        v-model="props.item.descuento"
                      ></v-text-field>
                    </td>
                    <td class="text-xs-center green--text">
                      ${{
                        (
                          (parseInt(props.item.cantidad) *
                            parseInt(props.item.fxcaja) +
                            parseInt(props.item.fracciones)) *
                          parseFloat(props.item.punit)
                        ).toFixed(2)
                      }}
                    </td>
                  </template>
                  <template slot="no-data">
                    <h3>No hay artículos agregados al detalle.</h3>
                  </template>
                </v-data-table>
                <v-flex xs12 sm12 md12 lg12 xl12></v-flex>
            <span>Forma de pago</span>
             <v-flex xs12 sm12 md12 lg12 xl12></v-flex>
                <v-flex xs12 sm4 md4 lg4 xl4>
                  <v-btn color="white" small flat class="primary" @click="Agregarformapago()">
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
                              <v-icon small class="mr-2"
                                @click="eliminarDetalle(detallesFP, props.item)">
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
                              <v-autocomplete v-model="props.item.unidadTiempo"
                                :items="tiempos" label="Tiempo">
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

      <v-dialog v-model="adModal" max-width="290">
        <v-card>
          <v-card-title class="headline" v-if="adAccion == 1">Activar Item</v-card-title>
          <v-card-title class="headline" v-if="adAccion == 2">
            Desactivar Item
          </v-card-title>
          <v-card-text>
            Estás a punto de
            <span v-if="adAccion == 1">activar</span>
            <span v-if="adAccion == 2">desactivar</span>
            el item {{ adNombre }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="activarDesactivarCerrar()" color="green darken-1" flat="flat">
              Cancelar
            </v-btn>
            <v-btn v-if="adAccion == 1" @click="activar()" color="orange darken-4"
              flat="flat">
              Activar
            </v-btn>
            <v-btn v-if="adAccion == 2" @click="desactivar()" color="orange darken-4" flat="flat">
              Desactivar
            </v-btn>
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

      <v-data-table v-if="!verNuevo" :headers="cabeceraCompras" :items="compras"
        class="elevation-1" :search="search">
        <template v-slot:items="props">
          <td>
            <v-icon small class="mr-2" @click="verDetalleC(props.item)">tab</v-icon>
            <template v-if="esGuardaAlmacen">
              <template v-if="props.item.estado">
                <v-icon small class="mr-2" @click="GenerarPDF(props.item)">
                  picture_as_pdf
                </v-icon>
                <v-icon small @click="activarDesactivarMostrar(2, props.item)">
                  block
                </v-icon>
              </template>
              <template v-else>
                <v-icon small @click="eliminarEgreso(props.item._id)">
                  delete
                </v-icon>
                <v-icon small @click="activarDesactivarMostrar(1, props.item)">
                  check
                </v-icon>
              </template>
            </template>

          </td>
          <td class="blue--text">
            {{ props.item.descripcion }}
          </td>
          <td>
            {{ props.item.numComprobante }}
          </td>
    
          <td>${{ props.item.subTotal }}</td>
          <td>${{ props.item.total }}</td> 
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
              <span class="orange--text">Pendiente</span>
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
    esGuardaAlmacen() {
      return (this.$store.state.usuario.rol == "609ed47286d0416b4a050c58");
    }
  },
  watch:{
    clienteSelected(newValue, _){
      if ( newValue.length == 0 ) {
        this.doc_cliente        = ""
        this.nombres_Cliente    = ""
        this.direccion_Cliente  = ""
        this._idCliente         = ""
      }else{
        const cliente = this.listClientes.find( cliente => cliente.nombres == newValue )
        this.doc_cliente        = cliente.numDocumento
        this.nombres_Cliente    = cliente.nombres
        this.direccion_Cliente  = cliente.direccion
        this._idCliente         = cliente._id
      }
    },
    verNuevo(newValue, _) {
      if ( newValue == 1 && !this.editando ) {
        this.getClientes();
      }
    }
  },
  data() {
    return { 
      editando: false,
      autoUpdate: true,
      clienteSelected: [],
      isUpdating: false,
      listClientes: [],      modal5:false,
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
        { text: "# COMPROBANTE", value: "numComprobante", sortable: false },
       
        { text: "Sub Total", value: "subTotal", sortable: false },
        { text: "Total", value: "total", sortable: false },
      
        { text: "Impuestos", value: "totalimpuesto", sortable: false },
        { text: "Descuentos", value: "totaldescuento", sortable: false },
        { text: "Fecha de emision", value: "fechaFactura", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
      ],
      compras: [],
      claveAcceso: "",
      _idCliente: "",
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
        { text: "Borrar", value: "borrar", sortable: false },
        { text: "Producto", value: "producto", sortable: false },
        { text: "Cantidad", value: "cantidad", sortable: false },
        { text: "Fracciones", value: "fracciones", sortable: false },
       
        { text: "F * Caja", value: "fxcaja", sortable: false },
        { text: "F Totales", value: "fraccionesTotales", sortable: false },
        { text: "Stock", value: "fraccionesTotales", sortable: false },

        { text: "Codigo Lote", value: "codigoLote", sortable: false },
        { text: "Reg. San", value: "registroSanitario", sortable: false },

        { text: "PVP", value: "pvP", sortable: false },
        { text: "P. UNIT.", value: "punit", sortable: false },
        { text: "IVA?", value: "iva", sortable: false },
        { text: "Descuento", value: "descuento", sortable: false },
        { text: "Sub Total", value: "subtotal", sortable: false },
      ],
      detalles: [],
      codigo: "",
      errorArticulo: "",
      numComprobante: "",
      fechaFactura: "",
      descripcion: "",
      direccion_Cliente: "",
      nombres_Cliente: "",
      doc_cliente: "",
      codigoBodega: "",
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: ""      
    };
  },
  methods: {
    getClientes(edit = false, cliente = null) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios.get("cliente/list", configuracion).then(function(response) {
        me.listClientes = response.data;       
        if ( edit ) me.clienteSelected = cliente;
      }).catch(function(error) {
        console.log(error);
      });
    },
    GenerarPDF(data){  
      let codigoPorcent; 
      let calculoporcentual; 
      let tarifa; 
      let deta = [];
      for (let index = 0; index < data.detalles.length; index++) {
        const element = data.detalles[index];
        let cant = 0;
        let pu = 0;
        let totalsinimpuesto = 0;
        let val = 0;
        cant = parseInt(element.fraccionesTotales);
        pu = parseFloat(element.punit);
        val = cant * pu;
        totalsinimpuesto = val.toFixed(2);
        if (data.detalles[index].iva != 0) {
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
            codigoBarras: data.detalles[index].codigoBarra,
            codigoLote: data.detalles[index].codigoLote,
            producto: data.detalles[index].producto,
            nombreComercial: data.detalles[index].nombreComercial,
            fechas: data.detalles[index].fechaCaducidad,
            registroSanitario: data.detalles[index].registroSanitario,
            cantidad: cant,
            precio: pu,
            descuento:  data.detalles[index].descuento,
            total: totalsinimpuesto,
          },
        ];

        deta.push(det);
      }

       axios
        .post("http://localhost:10000/api/pdf/pdfE", {        
          numComprobante: data.numComprobante,
          fecha: this.formatearFecha(data.fechaFactura),         
          clienteDireccion: data.codigoCliente.direccion,
          clienteDocumento: data.codigoCliente.numDocumento,
          clienteNombre: data.codigoCliente.nombres,
          detalles: { detalle: deta },
          clienteEmail: data.codigoCliente.email,
          clienteTelefono: data.codigoCliente.telefono,
          subtotal: data.subTotal,
          descuento: data.totalDescuento,
          iva: data.totalImpuesto,
          total: data.total,
          razonSocial: data.codigoDistribuidor.razonSocial,
          ruc: data.codigoDistribuidor.ruc,
        }, {responseType: 'blob'})
        .then(function (response) {
          if (response.status==200) {
            var oMyBlob = new Blob([response.data], {type : 'application/pdf'});
            var url = URL.createObjectURL( oMyBlob );
            window.open(url, "_blank");       
          }else{
            console.log(response.data.message);
          }
        }).catch(function (error) {
          console.log(error);
        });
    },
    ObtenerConteo(){
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
       let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      axios
        .get("egresos/obtenerconteo?codigoDistribuidor=" + codigoDistribuidor, configuracion)
        .then(function (response) {
         me.numComprobante=response.data
        })
        .catch(function (error) {
          console.log(error);
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
      axios
        .get("egresos/query?_id=" + id, configuracion)
        .then(function (response) {
          me.detalles = response.data.detalles;
          me.detallesFP = response.data.formaPago;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    async verDetalleC(data) { 
      this.totalRet = data.totalRetenido;
      this.verNuevo = 1;
      this.editando = true;
      this.numComprobante = data.numComprobante;
      this.descripcion = data.descripcion;
      this.fechaFactura = this.formatearFecha(data.fechaFactura);

      this.listarDetalles(data._id);
      await this.getClientes(true, data.codigoCliente.nombres);
    },
    formatearFecha(value) {
      if (value) {
        return moment(String(value)).format("YYYY-MM-DD");
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
          .get("egresos/list?codigoDistribuidor=" + codigoDistribuidor, configuracion)
          .then(function (response) {
            if (response.status == 200) {
              // console.log(response.data);
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
      this.clienteSelected = '';
      this.verNuevo = 0;
      this.limpiar();
    },
    limpiar() {
      this.detallesFP = [];
      this.claveAcceso = "";
      this.direccion_Cliente = "";
      this.nombres_Cliente = "";
      this.doc_cliente = "";
      this.numComprobante = "";
      this.fechaFactura = "";
      this.descripcion = "";
      this.errorArticulo = "";
      this.total = 0;
      this.totalimpuesto = 0;
      this.totaldescuento = 0;
      this.subtotal = 0;
      this._idCliente = "";
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
      if (this.doc_cliente.length == 0) {
        this.validaMensaje.push("Debe ingresar el numero de RUC del proveedor.");
      }
      if (this.nombres_Cliente.length == 0) {
        this.validaMensaje.push("Falta razon social del proveedor.");
      }
      if (this.direccion_Cliente.length == 0) {
        this.validaMensaje.push("Falta direccion de proveedor.");
      }

      if (this.detalles.length == 0) {
        this.validaMensaje.push(
          "Debe ingresar al menos un detalle a la factura de compra."
        );
      }
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
        if(parseInt(L.fraccionesTotales)>parseInt(L.stock)){
          this.validaMensaje.push("Fracciones totales no puede superar el Stock de inventario."); 
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
      let fecha = new Date(this.fechaFactura+' 05:00:00')
      let nc = this.numComprobante
      let des = this.descripcion
      axios
        .post(
          "egresos/add",
          {
         
            numComprobante:nc.toUpperCase(),
            fechaFactura: fecha.toISOString(),
            subTotal: this.subtotal,
            total: this.total,
            totalImpuesto: this.totalimpuesto,
            totalDescuento: this.totaldescuento,
            detalles: this.detalles,
            formaPago: this.detallesFP,
            descripcion: des.toUpperCase(),
            codigoCliente: this._idCliente,
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
                me.generarCuentaPorCobrar(
                  element.total,
                  element.unidadTiempo,
                  element.plazo,
                  response.data._id,
                  me._idCliente,
                  codigoDistribuidor,
                  codigoUsuario,
                  me.total,
                  me.numComprobante,
                  me.fechaFactura,
                  me.descripcion
                );
              }
            });
            Swal.fire("Noticias!", "Se guardo correctamente el egreso.", "success");
          } else {
            Swal.fire("Ops!", "Hubo problemas al intentar guardar el egreso", "err");
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

      const response = await axios.get("cuentasporcobrar/contar", configuracion);
      return response.data;
    },
    generarCuentaPorCobrar(
      totalFP,
      unidadTiempo,
      plazo,
      codigoCompra,
      codigoCliente,
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
              "cuentasporcobrar/add",
              {
                numComprobante: cuentaCuentas,
                plazo: plazo,
                totalFormaPago: totalFP,
                totalPagado:0,
                unidadTiempo: unidadTiempo,
                codigoCompra:codigoCompra,
                codigoCliente: codigoCliente,
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
     console.log(data);
      this.errorArticulo = null;
      if (this.encuentra(data._id) == true) {
        this.errorArticulo = "El artículo ya ha sido agregado.";
      } else {
        this.detalles.unshift({
          _id: data._id,
          producto: data.nombreComercial,
          cantidad: 0,
          fracciones: 0,
          fxcaja: data.codigoProducto.fraccionCaja,
          fraccionesTotales: data.fraccionesTotales,
          stock: data.fraccionesTotales,
          pvp: data.pvp,
          punit: data.punit,
          descuento: data.descuento,
          iva: data.iva,
          codigoLote:data.codigoLote,
          registroSanitario:data.registroSanitario,
          fechaCaducidad:data.fechaCaducidad
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
        .put("egresos/activate", { _id: this.adId }, configuracion)
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
        .put("egresos/deactivate", { _id: this.adId }, configuracion)
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
    eliminarEgreso(egreso_id){
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };

      Swal.fire({
        title: 'Estas seguro de eliminar este egreso pendiente?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`egresos/eliminarEgreso/${egreso_id}`, configuracion).then(function(response){
            me.listar();
          }).catch(function (error) {
            console.log(error);
          });
        }
      })

    }
  },
  created() {
    this.listar();
    this.obtenerBodega();
    this.ObtenerConteo()
  },
};
</script>

<style></style>
