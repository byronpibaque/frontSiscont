<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Facturas</v-toolbar-title>
      </v-toolbar>
      <v-container grid-list-sm class="pa-4 white">
        <v-layout wrap>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-text-field
              v-model="numComprobante"
              label="Número Comprobante"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-text-field v-model="ptoemision" label="Punto emisión"></v-text-field>
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
              <v-text-field
                v-model="ruc_comprador"
                label="Cédula/RUC"
                type="number"
                v-on:keyup.enter="buscarCliente(ruc_comprador)"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4 lg4 xl4>
              <v-text-field
                v-model="razonsocial_comprador"
                label="Razon Social/Apellidos y Nombres"
                v-on:keyup.enter="buscarCliente(razonsocial_comprador)"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4 lg4 xl4>
              <v-text-field
                v-model="direccion_comprador"
                label="Dirección Comprador"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4 lg4 xl4>
              <v-text-field
                v-model="email_comprador"
                label="Email"
                type="email"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4 lg4 xl4>
              <v-text-field v-model="telefono_comprador" label="Telefono"></v-text-field>
            </v-flex>
          </v-layout>
        </div>
        <span>Detalles de la factura</span>
        <v-flex xs12 sm12 md12 lg12 xl12>
          <v-btn color="white" small flat class="primary" @click="AgregarDetalle()">
            <v-icon>add</v-icon>
            Nuevo detalle
          </v-btn>
        </v-flex>
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
                    <td>
                      <v-icon
                        small
                        class="mr-2"
                        @click="eliminarDetalle(detalles, props.item)"
                        >delete</v-icon
                      >
                    </td>
                    <td>
                      <v-text-field v-model="props.item.codigoBarra"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="props.item.codigoAuxiliar"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="props.item.descripcion"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="props.item.nombreComercial"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="props.item.registroSanitario"></v-text-field>
                    </td>

                    <td>
                      <v-text-field v-model="props.item.fechas"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="props.item.cantidad"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="props.item.precioUni"></v-text-field>
                    </td>
                    <td>
                      <v-checkbox v-model="props.item.iva"></v-checkbox>
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
                      {{ (props.item.cantidad * props.item.precioUni).toFixed(6) }}
                    </td>
                  </template>
                  <template slot="no-data">
                    <h3>No hay artículos agregados al detalle.</h3>
                  </template>
                </v-data-table>
              </template>
            </v-flex>

            <v-flex xs12 sm12 md12 v-show="valida">
              <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
            </v-flex>
          </v-layout>
        </div>
        <span>Forma de pago</span>
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
                <v-data-table
                  :headers="cabeceraFormapago"
                  :items="detallesFP"
                  hide-actions
                  class="elevation-1"
                >
                  <template slot="items" slot-scope="props">
                    <td>
                      <v-icon
                        small
                        class="mr-2"
                        @click="eliminarDetalle(detallesFP, props.item)"
                        >delete</v-icon
                      >
                    </td>
                    <td>
                      <v-autocomplete
                        v-model="props.item.formaPago"
                        :items="formaspagos"
                        label="Forma pago"
                      ></v-autocomplete>
                    </td>
                    <td>
                      <v-text-field v-model="props.item.total"></v-text-field>
                    </td>
                    <td>
                      <v-autocomplete
                        v-model="props.item.unidadTiempo"
                        :items="tiempos"
                        label="Tiempo"
                      ></v-autocomplete>
                    </td>
                    <td v-if="props.item.unidadTiempo == 'NINGUNO'">
                      <v-text-field v-model="props.item.plazo" disabled></v-text-field>
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
        <v-flex xs12 sm12 md12 lg12 xl12>
          <v-btn color="success" @click.native="guardar()">
            <v-icon>save</v-icon>
            Guardar</v-btn
          >
        </v-flex>
      </v-container>
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
  data() {
    return {
      //datos totales
      totalParcial: 0.0,
      totaldescuento: 0.0,
      totalImpuesto: 0.0,
      total: 0.0,
      //DATOS COMPRADOR
      tipoIdentificacion: "",
      direccion_comprador: "",
      telefono_comprador: "NN",
      email_comprador: "",
      razonsocial_comprador: "CONSUMIDOR FINAL",
      ruc_comprador: "9999999999999",
      //datos para la emision
      numComprobante: "",
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

        { text: "Cantidad", value: "cantidad", sortable: false },
        { text: "Pecio Unitario", value: "precioUni", sortable: false },
        { text: "Iva", value: "iva", sortable: false },
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
      //XML
      detalleXml: [],
      datosDistribuidores: [],
    };
  },
  watch: {},
  computed: {
    calcularTotal: function () {
      let resultado =
        parseFloat(this.calcularSubtotal) +
        parseFloat(this.calcularIva) -
        parseFloat(this.calcularDescuento);

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
        cant = parseInt(element.cantidad);
        pu = parseFloat(element.precioUni);
        val = cant * pu;
        if (element.iva != 0) {
          resultado = resultado + val * 0.12;
        }
      }

      return resultado.toFixed(2);
    },
    calcularDescuento: function () {
      let resultado = 0.0;
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
        cant = parseInt(element.cantidad);
        pu = parseFloat(element.precioUni);
        val = cant * pu;
        resultado = resultado + val;
      }

      return resultado.toFixed(2);
    },
  },

  methods: {
    buscarCliente(data) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;

      axios
        .get("cliente/consulta?data=" + data, configuracion)
        .then(function (response) {
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
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    async datosDistribuidor() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let code = this.$store.state.usuario.codigoDistribuidor;

      const response = await axios.get("distribuidor/query?_id=" + code, configuracion);
      return response.data;
    },
    guardar() {
      let me = this;
      this.generardetalle_xml();
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
      datos
        .then((result) => {
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
            me.numComprobante,
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
            me.detallesFP,
            me.email_comprador,
            me.direccion_comprador,
            me.telefono_comprador
          );
        })
        .catch((err) => {
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
      detallepag,
      //Datos adicionales del cliente
      emailCli,
      dirCli,
      telfCli
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
          "http://localhost:5000/api/xml/xml",
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
                pago: detallepag,
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
            me.actualizarConteo();
          } else {
            Swal.fire("Error", "Ocurrio un error al tratar de guardar la venta.");
          }
        })
        .catch((e) => {
          console.log(e);
        });
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
          { "@nombre": "regSanitario", "@valor": this.detalles[index].registroSanitario },
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
        total: 0.0,
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
        .post("http://localhost:5000/api/pdf/pdf", {
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
        .then(function (response) {})
        .catch(function (error) {
          console.log(error);
        });
    },
    formatearFecha(value) {
      if (value) {
        return moment(String(value)).format("MM/DD/YYYY hh:mm");
      }
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
        .then(function (response) {
          me.numComprobante = response.data.secuencial;
          me.ptoemision = response.data.ptoEmision;
          me.idDatos = response.data._id;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    actualizarConteo() {
      let me = this;
      axios
        .put("data/actualizarSecuencial", {
          _id: this.idDatos,
          documento: "FACTURA",
        })
        .then(function (response) {
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
        .catch(function (error) {
          console.log(error);
        });
    },
    limpiar() {
      this.detallesFP = [];
      this.detalles = [];
      this.detalleXml = [];
      this.totalParcial = 0.0;
      this.totaldescuento = 0.0;
      this.totalImpuesto = 0.0;
      this.total = 0.0;

      this.tipoIdentificacion = "";
      this.direccion_comprador = "";
      this.telefono_comprador = "NN";
      this.email_comprador = "tuahorrocomprobantes@gmail.com";
      this.razonsocial_comprador = "CONSUMIDOR FINAL";
      this.ruc_comprador = "9999999999999";
    },
  },
  props: {},
  created() {
    this.obtenerDatos();
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
</style>
