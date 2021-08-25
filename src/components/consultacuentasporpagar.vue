<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Consulta cuentas por pagar</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <template>
          <v-btn color="success" dark class="mb-2" @click="abrirFiltroModal()"
            >Filtro</v-btn
          >
        </template>
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
      </v-toolbar>
      <v-data-table
        :headers="cabeceraDatos"
        :items="datos"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:items="props">
          <td>
            <v-icon small class="mr-2" @click="verDetalle(props.item)"
              >tab</v-icon
            >
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
          <td>{{ props.item.numComprobante }}</td>
          <td>{{ props.item.numComprobanteFactura }}</td>
          <td>{{ props.item.codigoProveedor.razonsocial }}</td>
          <td>{{ props.item.descripcion }}</td>
          <td class="blue--text">{{ props.item.plazo + props.item.unidadTiempo}}</td>
          <td>${{ props.item.totalFactura }}</td>
          <td>${{ props.item.totalFormaPago  }}</td>
          <td>${{props.item.totalPagado}}</td>
          <td>{{props.item.fechaFactura}}</td>
          <td class="blue--text">{{agregarDias(props.item.unidadTiempo,props.item.plazo,props.item.fechaFactura)}}</td>
          <td class="red--text">{{diasVencidos(props.item.unidadTiempo, props.item.plazo,props.item.fechaFactura)}}</td>
          <td>
          <div class="green--text" v-if="props.item.estado">PAGADO</div>
          <div v-else class="red--text">POR PAGAR</div>
          </td>
        </template>
        <template slot="no-data">
          <h3>No hay artículos agregados al detalle.</h3>
        </template>
      </v-data-table>
      <v-dialog v-model="detalleModal" max-width="1000px">
        <v-card>
          <v-card-title>
            <span class="headline"
              >Detalle de la cuenta por pagar #{{ numComprobante }}</span
            >
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12 lg12 xl12>
                  <template>
                    <TABLE cellspacing="25" align="center">
                      <tr>
                        <td colspan="3" class="headline green--text">
                          Información de proveedor
                        </td>
                      </tr>
                      <TR>
                        <TD
                          ><span class="blue--text headline">Proveedor:</span>
                          <h2>{{ proveedor.razonsocial }}</h2></TD
                        >
                        <TD
                          ><span class="blue--text headline">RUC:</span>
                          <h2>{{ proveedor.ruc }}</h2></TD
                        >
                        <TD
                          ><span class="blue--text headline">Direccion:</span>
                          <h2>{{ proveedor.direccion }}</h2></TD
                        >
                      </TR>
                      <tr>
                        <td colspan="3" class="headline green--text">
                          Información de la factura
                        </td>
                      </tr>
                      <TR>
                        <TD
                          ><span class="blue--text headline"># C. Fct.:</span>
                          <h2>{{ numComprobanteFactura }}</h2></TD
                        >
                        <TD
                          ><span class="blue--text headline"
                            >Total factura:</span
                          ><span class="headline">${{ totalFactura }}</span></TD
                        >
                         <TD
                          ><span class="blue--text headline"
                            >Total retenido:</span
                          ><span class="headline">${{ totalRetenido }}</span></TD
                        >
                        <TD
                          ><span class="blue--text headline"
                            >Fecha factura:</span
                          ><span class="headline">{{ fechaFactura }}</span></TD
                        >
                      </TR>
                      <tr>
                        <td colspan="3" class="headline green--text">
                          Información de la cuenta por pagar
                        </td>
                      </tr>
                      <TR>
                        <TD
                          ><span class="blue--text headline">Plazo:</span>
                          <h2>{{ plazo + unidadTiempo }}</h2></TD
                        >

                        <TD colspan="2"
                          ><span class="blue--text headline"
                            >Total por pagar:</span
                          ><span class="headline"
                            >${{ totalFormaPago }}</span
                          ></TD
                        >
                        <TD colspan="2"
                          ><span class="blue--text headline"
                            >Total pagado:</span
                          ><span class="headline"
                            >${{ totalPagado }}</span
                          ></TD
                        >
                      </TR>
                    </TABLE>
                  </template>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close()">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="filtroModal" max-width="700px">
        <v-card>
          <v-card-title>
            <span class="headline">Filtre sus busquedas:</span>
          </v-card-title>
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
                      <v-btn text color="primary" @click="modal5 = false"
                        >Cancelar</v-btn
                      >
                      <v-btn
                        text
                        color="success"
                        @click="$refs.dialog2.save(finicio)"
                        >Aceptar</v-btn
                      >
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
                      <v-btn text color="primary" @click="modal2 = false"
                        >Cancelar</v-btn
                      >
                      <v-btn
                        text
                        color="success"
                        @click="$refs.dialog3.save(ffin)"
                        >Aceptar</v-btn
                      >
                    </v-date-picker>
                  </v-dialog>
                </v-flex>
                <v-flex xs12 sm12 md12 lg12 xl12 l12>
                  <div v-if="proveedor.length == 0">
                    <v-text-field
                      v-model="comprobanteBusqueda"
                      label="# comprobante"
                    ></v-text-field>
                  </div>
                  <div v-else>
                    <v-text-field
                      v-model="comprobanteBusqueda"
                      disabled
                      label="# comprobante"
                    ></v-text-field>
                  </div>
                </v-flex>
                <v-flex xs12 sm12 md12 lg12 xl12 l12>
                  <div v-if="comprobanteBusqueda.length == 0">
                    <v-autocomplete
                      v-model="proveedor"
                      :items="proveedores"
                      label="Proveedores"
                    ></v-autocomplete>
                  </div>
                  <div v-else>
                    <v-autocomplete
                      v-model="proveedor"
                      :items="proveedores"
                      disabled
                      label="Proveedores"
                    ></v-autocomplete>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
             <v-btn @click="buscarF(proveedor,comprobanteBusqueda,finicio,ffin)" class="primary">Buscar</v-btn>
            <v-btn color="blue darken-1" flat @click="cerrarModalFiltro()"
              >Cancelar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
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
  watch: {},
  props: {},
  data() {
    return {
      
      totalRetenido:0,
      totalPagado:0,
      comprobanteBusqueda: "",
      proveedores: [],
      proveedor: "",
      finicio: "",
      ffin: "",
      modal5: false,
      modal2: false,
      filtroModal: 0,
      fechaFactura: "",
      unidadTiempo: "",
      plazo: "",
      totalFormaPago: 0,
      totalFactura: 0,
      proveedor: [],
      numComprobante: "",
      numComprobanteFactura: "",
      detalleModal: 0,
      datos: [],
      cabeceraDatos: [
        { text: "Opciones", value: "opciones", sorteable: false },
        { text: "Num. cxp", value: "numComprobante", sorteable: false },
        {
          text: "Num. Factura",
          value: "numComprobanteFactura",
          sorteable: false,
        },
        {
          text: "Proveedor",
          value: "codigoProveedor.razonsocial",
          sorteable: false,
        },
        { text: "Desc. Compra", value: "descripcion", sorteable: false },
        { text: "Plazo de pago", value: "plazo", sorteable: false },
        { text: "Total factura", value: "totalFactura", sorteable: false },
        { text: "Total por pagar", value: "totalFormaPago", sorteable: false },
        { text: 'Abono', value: 'totalPagado', sorteable: false },
        { text: 'Fecha fact.', value: 'fechaFactura', sorteable: false },
        { text: 'Fecha de vencimiento', value: 'fecha', sorteable: false },
        { text: 'Dias vencidos', value: 'diasVencidos', sorteable: false },
        { text: 'Estado', value: 'estado', sorteable: false },
      ],
      search: "",
      verFiltro: 0,
    };
  },
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
            "cuentasporpagar/buscar?finicio=" +
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
              me.datos = response.data;
              me.cerrarModalFiltro()
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
        .then(function(response) {
          ArrayT = response.data;
          ArrayT.map(function(x) {
            me.proveedores.push({ text: x.razonsocial, value: x._id });
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    abrirFiltroModal() {
      this.filtroModal = 1;
    },
    cerrarModalFiltro() {
      this.filtroModal = 0;
    },
    close() {
      this.detalleModal = 0;
    },
    verDetalle(data) {
      this.detalleModal = 1;

      this.plazo = data.plazo;
      this.unidadTiempo = data.unidadTiempo;
      this.totalFormaPago = data.totalFormaPago-data.totalRetenido;
      this.totalPagado = data.totalPagado

      this.numComprobante = data.numComprobante;
      this.numComprobanteFactura = data.numComprobanteFactura;
      this.fechaFactura = data.fechaFactura;
      this.totalFactura = data.totalFactura;
      this.totalRetenido = data.totalRetenido

      this.proveedor = data.codigoProveedor;
    },
    diasVencidos(tiempo,plazo,fecha){
      let aaryf = fecha.split('/')
      let valF=aaryf[1]+'/'+aaryf[0]+'/'+aaryf[2]
 
      let fechaa = moment(valF).add(plazo,'d').format('MM/DD/YYYY')
    
      let arr = fechaa.split('/')
      let newArr=[]
       newArr.push(parseInt(arr[2]),parseInt(arr[0]),parseInt(arr[1]))
       console.log(newArr);
     let fechaACtual = moment().format('MM/DD/YYYY')
     let arrr = fechaACtual.split('/')
     let arr2 = []

    arr2.push(parseInt(arrr[2]),parseInt(arrr[0]),parseInt(arrr[1]))
 
    var a = moment(arr2);
    var b = moment(newArr);
    var resultado = a.diff(b, 'days')
    if(resultado>0){
      return resultado
    }else{
      return 0
    }
    
    },
    agregarDias(tiempo,plazo,fecha){
      let aaryf = fecha.split('/')
      let valF=aaryf[1]+'/'+aaryf[0]+'/'+aaryf[2]
      if(tiempo && plazo){
        if(tiempo=='dias'){
          return moment(valF).add(plazo,'d').format("DD/MM/YYYY")
        }
      }
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
            "cuentasporpagar/list?codigoDistribuidor=" + codigoDistribuidor,
            configuracion
          )
          .then(function(response) {
            if (response.status == 200) {
              me.datos = response.data;
            } else {
              console.log(response);
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
  },
  created() {
    this.listar();
    this.obetenerProveedores();
  },
};
</script>

<style lang="css" scoped></style>
