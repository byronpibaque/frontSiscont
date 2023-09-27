<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Retenciones</v-toolbar-title>
      </v-toolbar>
      <v-container grid-list-sm class="pa-4 white">
        <v-layout wrap>
          <v-flex xs1 sm1 md1 lg1 xl1>
            <v-text-field
              v-model="numComprobante"
              label="Número Comprobante"
            ></v-text-field>
          </v-flex>
          <v-flex xs1 sm1 md1 lg1 xl1>
            <v-text-field v-model="ptoemision" label="Punto emisión"></v-text-field>
          </v-flex>
          <v-flex xs1 sm1 md1 lg1 xl1>
            <v-text-field
              v-model="pfMes"
              label="Periodo fiscal/Mes"
              disabled
            ></v-text-field>
          </v-flex>
          <v-flex xs1 sm1 md1 lg1 xl1>
            <v-text-field
              v-model="pfAnio"
              label="Periodo fiscal/Año"
              disabled
            ></v-text-field>
          </v-flex>
        </v-layout>

        <v-layout wrap>
          <v-flex xs1 sm1 md1 lg1 xl1>
            <v-autocomplete
              v-model="documento"
              :items="documentos"
              label="Tipo de documento"
            ></v-autocomplete>
          </v-flex>
          <v-flex xs1 sm1 md1 lg1 xl1>
            <v-btn
              small
              fab
              dark
              color="teal"
              @click="mostrarModalcomprobantes()"
              v-if="documento == '01'"
            >
              <v-icon dark>list</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs1 sm1 md1 lg1 xl1 v-if="documento">
            <v-text-field
              v-model="documento"
              label="cod. tipo doc."
              disabled
            ></v-text-field>
          </v-flex>
          <v-flex xs1 sm1 md1 lg1 xl1 v-else>
            <v-text-field v-model="otrotipodoc" label="cod. tipo doc."></v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-text-field
              v-model="claveAccesodig"
              label="Numero de comprobante"
            ></v-text-field>
          </v-flex>
          <v-flex xs1 sm1 md1 lg1 xl1>
            <v-text-field
              v-model="subtotalComprobante"
              label="SubTotal comprobante"
            ></v-text-field>
          </v-flex>
          <v-flex xs1 sm1 md1 lg1 xl1>
            <v-text-field v-model="totaliva" label="Total I.V.A."></v-text-field>
          </v-flex>
          <v-flex xs1 sm1 md1 lg1 xl1>
            <v-text-field
              v-model="totalComprobante"
              label="Total comprobante"
              disabled
            ></v-text-field>
          </v-flex>
          <v-flex xs1 sm1 md1 lg1 xl1>
            <v-text-field
              v-model="fechaEmisionComprobante"
              label="Fecha emision"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <span>Datos del sujeto retenido</span>
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
                v-model="ruc_sretenido"
                label="Cédula/RUC"
                type="number"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4 lg4 xl4>
              <v-text-field
                v-model="razonsocial_sretenido"
                label="Razon Social/Apellidos y Nombres"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4 lg4 xl4>
              <v-text-field
                v-model="direccion_sretenido"
                label="Dirección sretenido"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4 lg4 xl4>
              <v-text-field
                v-model="email_sretenido"
                label="Email"
                type="email"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4 lg4 xl4>
              <v-text-field v-model="telefono_sretenido" label="Telefono"></v-text-field>
            </v-flex>
          </v-layout>
        </div>
        <span>Impuestos</span>
        <div id="comprador">
          <v-layout wrap>
            <v-flex xs3 sm3 md3 lg3 xl3>
              <v-autocomplete
                v-model="impuesto"
                :items="impuestos"
                label="Tipo de documento"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs3 sm3 md3 lg3 xl3>
              <v-autocomplete
                v-if="impuesto == 2"
                v-model="codigoRetencion"
                :items="ivaDetalle"
                label="I.V.A"
                @change="calcularvaloraretener()"
              ></v-autocomplete>
              <v-autocomplete
                v-else-if="impuesto == 1"
                v-model="codigoRetencion"
                :items="irDetalle"
                @change="calcularvaloraretener()"
                label="Impuesto a la renta"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm2 md2 lg2 xl2>
              <v-text-field
                v-model="porcentajeRetencion"
                label="% de retencion"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm2 md2 lg2 xl2>
              <v-text-field
                v-model="valorRetenido"
                label="Valor retenido"
                disabled
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12 v-show="valida">
              <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12 xl12>
              <v-btn color="white" small flat class="primary" @click="AgregarDetalle()">
                <v-icon>add</v-icon>
                Agregar a detalle
              </v-btn>
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
                    <td>
                      <v-icon
                        small
                        class="mr-2"
                        @click="eliminarDetalle(detalles, props.item)"
                        >delete</v-icon
                      >
                    </td>
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

        <v-flex xs12 sm12 md12 lg12 xl12>
          <v-btn color="success" @click.native="guardar()">
            <v-icon>save</v-icon>
            Guardar</v-btn
          >
        </v-flex>
      </v-container>
      <v-dialog v-model="modalComprobantes" max-width="1000px">
        <v-card>
          <v-card-title>
            <span class="headline">Seleccione un comprobante</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12 lg12 xl12>
                  <v-text-field
                    v-model="texto"
                    class="text-xs-center"
                    append-icon="search"
                    label="Búsqueda"
                  ></v-text-field>
                  <template>
                    <v-data-table
                      :headers="cabeceraComprobantes"
                      :items="comprobantes"
                      class="elevation-1"
                      :search="texto"
                    >
                      <template v-slot:items="props">
                        <td class="justify-center layout px-0">
                          <v-icon
                            small
                            class="mr-2"
                            @click="cargarInformacion(props.item)"
                            >add</v-icon
                          >
                        </td>
                        <td>{{ props.item.numComprobante }}</td>
                        <td>{{ props.item.descripcion }}</td>
                        <td>${{ props.item.subTotal }}</td>
                        <td>${{ props.item.total }}</td>
                        <td>{{ formatearFecha(props.item.fechaFactura) }}</td>
                      </template>
                    </v-data-table>
                  </template>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="cerrarModalcomprobantes"
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
  created() {
    this.periodoFiscal();
    this.obtenerDatos();
  },
  methods: {
    limpiar() {
      this._idProveedor = "";
      this._idCompra = "";
      this.totaliva = 0;
      this.fechaEmisionComprobante = "";
      this.otrotipodoc = 0;
      this.porcentajeRetencion = 0;
      this.valorRetenido = 0;
      this.codigoRetencion = "";

      this.impuesto = "";
      this.totalComprobante = 0;
      this.subtotalComprobante = 0;
      this.claveAccesodig = "";

      this.buscar = "";
      this.texto = "";
      this.tipoBusqueda = "";

      this.tipoIdentificacion = "";
      this.direccion_sretenido = "";
      this.telefono_sretenido = "";
      this.email_sretenido = "";
      this.razonsocial_sretenido = "";
      this.ruc_sretenido = "";
      this.detalles = [];

      this.documento = "";
    },
    guardarRegistro(
      secuencial,
      ptoEmi,
      totaliva,
      subtotalComprobante,
      totalComprobante,
      impuesto,
      periodoFiscal,
      key
    ) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };

      //Código para guardar
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;

      axios
        .post(
          "retenciones/add",
          {
            secuencial: secuencial,
            ptoEmi: ptoEmi,
            totalImpuesto: totaliva,
            subtotal: subtotalComprobante,
            total: totalComprobante,
            impuestos: impuesto,
            periodoFiscal: periodoFiscal,
            claveAcceso: key,
            codigoCompra: me._idCompra,
            codigoUsuario: codigoUsuario,
            codigoProveedor: me._idProveedor,
            codigoDistribuidor: codigoDistribuidor,
          },
          configuracion
        )
        .then(function (response) {
          if (response.status == 200) {
          } else {
            Swal.fire("Error", response.data, "error");
          }
        })
        .catch(function (error) {
          console.log(error);
          Swal.fire("Error", error, "error");
        });
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (this.numComprobante.length == 0) {
        this.validaMensaje.push("*Debe ingresar el numero de comprobante.");
      }
      if (this.ptoemision.length == 0) {
        this.validaMensaje.push("*Debe ingresar el punto de emision.");
      }
      if (this.claveAccesodig.length == 0) {
        this.validaMensaje.push(
          "*Debe ingresar la clave de acceso del comprobante a retener."
        );
      }
      if (this.fechaEmisionComprobante.length == 0) {
        this.validaMensaje.push("*Debe ingresar la fecha de emision del comprobante.");
      }
      if (this.ruc_sretenido.length == 0) {
        this.validaMensaje.push("*Debe ingresar el ruc del sujeto a retener.");
      }
      if (this.razonsocial_sretenido.length == 0) {
        this.validaMensaje.push("*Debe ingresar la razón social del sujeto a retener.");
      }
      if (this.direccion_sretenido.length == 0) {
        this.validaMensaje.push("*Debe ingresar la dirección del sujeto a retener.");
      }
      if (this.email_sretenido.length == 0) {
        this.validaMensaje.push("*Debe ingresar el email del sujeto a retener.");
      }
      if (this.telefono_sretenido.length == 0) {
        this.validaMensaje.push("*Debe ingresar el telefono del sujeto a retener.");
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    eliminarDetalle(arr, item) {
      let i = arr.indexOf(item);
      if (i !== -1) {
        arr.splice(i, 1);
      }
    },
    crearXML(
      razonsocialDistribuidor,
      nombreComercialDistribuidor,
      rucDistribuidor,
      estab,
      ptoEmi,
      secuencial,
      dirMatriz,
      dirEstablecimiento,
      tipoIdentificacionSR,
      razonSocialSR,
      identificacionSR,
      periodoFiscal,
      impuesto,
      emailSR,
      direccionSR,
      telefonoSR
    ) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .post(
          "http://localhost:10000/api/xml/xml_retencion",
          {
            infoTributaria: {
              razonSocial: razonsocialDistribuidor,
              nombreComercial: nombreComercialDistribuidor,
              ruc: rucDistribuidor,
              dirMatriz: dirMatriz,
              estab: estab, //lugar donde se hizo la venta
              ptoEmi: ptoEmi,
              secuencial: secuencial,
            },
            infoCompRetencion: {
              dirEstablecimiento: dirEstablecimiento,
              tipoIdentificacionSujetoRetenido: tipoIdentificacionSR,
              razonSocialSujetoRetenido: razonSocialSR,
              identificacionSujetoRetenido: identificacionSR,
              periodoFiscal: periodoFiscal,
            },
            impuestos: {
              impuesto: impuesto,
            },
            emailSujetoRetenido: emailSR,
            dirSujetoRetenido: direccionSR,
            telfSujetoRetenido: telefonoSR,
          },
          configuracion
        )
        .then((response) => {
          if (response.status == 200) {
            Swal.fire(
              "Notificación",
              "Se generó correctamente la transacción.",
              "success"
            );
            let fecha = me.formatearFecha(moment().format());
            let key = response.data[0];
            let num = response.data[1];
            me.crearPDF_SLocal(
              key,
              num,
              fecha,
              nombreComercialDistribuidor,
              dirMatriz,
              dirEstablecimiento,
              direccionSR,
              identificacionSR,
              razonSocialSR,
              impuesto,
              emailSR,
              telefonoSR,
              razonsocialDistribuidor,
              rucDistribuidor,
              periodoFiscal
            );
            me.guardarRegistro(
              secuencial,
              ptoEmi,
              this.totaliva,
              this.subtotalComprobante,
              this.totalComprobante,
              impuesto,
              periodoFiscal,
              key
            );
            me.actualizarConteo();
            me.limpiar();
          } else {
            Swal.fire("Error", response.data, "error");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    guardar() {
      let me = this;
      const datos = this.datosDistribuidor();

      let dirMatriz = "";
      let establecimiento = "";
      let periodo = this.pfMes + "/" + this.pfAnio;
      datos
        .then((result) => {
          result.establecimientos.forEach((element) => {
            if (element.tipoEstablecimiento == "MATRIZ") {
              dirMatriz = element.direccionEstablecimiento;
              establecimiento = element.numEstablecimiento;
            }
          });
          me.crearXML(
            result.razonSocial,
            result.nombreComercial,
            result.ruc,
            establecimiento,
            me.ptoemision,
            me.numComprobante,
            dirMatriz,
            dirMatriz,
            me.tipoIdentificacion,
            me.razonsocial_sretenido,
            me.ruc_sretenido,
            periodo,
            me.detalles,
            me.email_sretenido,
            me.direccion_sretenido,
            me.telefono_sretenido
          );
        })
        .catch((err) => {
          console.log(err);
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
            "&documento=RETENCION",
          configuracion
        )
        .then(function (response) {
          me.numComprobante = response.data.secuencial;
          me.ptoemision = response.data.ptoEmision;
          me.idDatos = response.data._id;
          // console.log(me.idDatos);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    AgregarDetalle() {
      if (this.validar()) {
        return;
      }
      let me = this;
      let codigo = "";
      if (this.documento == 0) {
        codigo = this.otrotipodoc;
      } else {
        codigo = this.documento;
      }
      me.detalles.unshift({
        codigo: this.impuesto, //iva o imp
        codigoRetencion: this.codigoRetencion[0], //303A - 1-10
        baseImponible: this.subtotalComprobante, //150.00
        porcentajeRetener: this.porcentajeRetencion, //8
        valorRetenido: this.valorRetenido, //10.00
        codDocSustento: codigo, //FACTURA ETC
        numDocSustento: this.claveAccesodig, //13546549879879
        fechaEmisionDocSustento: this.fechaEmisionComprobante, //20/02/2021
      });
    },
    calcularvaloraretener() {
      this.porcentajeRetencion = this.codigoRetencion[1];

      if (this.impuesto == 2) {
        if (this.totaliva.length == 0 || parseFloat(this.totaliva) == 0) {
          Swal.fire("Error", "El valor en total iva no puede ser 0 o vacio.", "error");
        } else {
          this.valorRetenido = (
            (parseFloat(this.totaliva) * parseFloat(this.porcentajeRetencion)) /
            100
          ).toFixed(2);
        }
      } else {
        if (
          this.subtotalComprobante.length == 0 ||
          parseFloat(this.subtotalComprobante) == 0
        ) {
          Swal.fire(
            "Error",
            "El valor de subtotal de comprobante no puede ser 0 o vacio.",
            "error"
          );
        } else {
          this.valorRetenido = (
            (parseFloat(this.subtotalComprobante) *
              parseFloat(this.porcentajeRetencion)) /
            100
          ).toFixed(2);
        }
      }
    },
    periodoFiscal() {
      this.pfMes = moment().format("MM");
      this.pfAnio = moment().format("YYYY");
    },
    cargarInformacion(info) {
      let numCaracter = info.codigoProveedor.ruc.length;
      this._idCompra = info._id;
      this._idProveedor = info.codigoProveedor._id;
      if (numCaracter == 10) {
        this.tipoIdentificacion = "05";
      } else if (numCaracter == 13) {
        this.tipoIdentificacion = "04";
      }
      this.totaliva = info.totalImpuesto;
      this.fechaEmisionComprobante = info.fechaFactura;
      this.subtotalComprobante = info.subTotal;
      this.totalComprobante = info.total;
      this.ruc_sretenido = info.codigoProveedor.ruc;
      this.razonsocial_sretenido = info.codigoProveedor.razonsocial;
      this.direccion_sretenido = info.codigoProveedor.direccion;
      let cadena = info.claveAcceso;
      this.claveAccesodig = cadena.substr(-15);
      info.codigoProveedor.contacto.forEach((element) => {
        this.email_sretenido = element.correo;
        this.telefono_sretenido = element.telefono;
      });
      this.cerrarModalcomprobantes();
    },
    listarComprobantes() {
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
              me.comprobantes = response.data;
            } else {
              console.log(response);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    cerrarModalcomprobantes() {
      this.modalComprobantes = 0;
    },
    mostrarModalcomprobantes() {
      this.listarComprobantes();
      this.modalComprobantes = 1;
    },
    formatearFecha(value) {
      if (value) {
        return moment(String(value)).format("DD/MM/YYYY");
      }
    },
    crearPDF_SLocal(
      claveAcceso,
      numComprobante,
      fecha,
      nombreComercial,
      dirMatriz,
      dirSucursal,
      clienteDireccion,
      clienteDocumento,
      clienteNombre,
      detalles,
      clienteEmail,
      clienteTelefono,
      propietario,
      rucpropietario,
      periodoFiscal
    ) {
      axios
        .post("http://localhost:10000/api/pdf/pdfR", {
          claveAcceso: claveAcceso,
          numComprobante: numComprobante,
          fecha: fecha,
          nombreComercial: nombreComercial,
          dirMatriz: dirMatriz,
          dirSucursal: dirSucursal,
          clienteDireccion: clienteDireccion,
          clienteDocumento: clienteDocumento,
          clienteNombre: clienteNombre,
          detalles: {
            detalle: detalles,
          },
          clienteEmail: clienteEmail,
          clienteTelefono: clienteTelefono,
          razonSocial: propietario,
          ruc: rucpropietario,
          periodoFiscal: periodoFiscal,
        })
        .then(function (response) {})
        .catch(function (error) {
          console.log(error);
        });
    },
    actualizarConteo() {
      let me = this;
      console.log(me.idDatos);
      axios
        .put("data/actualizarSecuencial", {
          _id: me.idDatos,
          documento: "RETENCION",
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
  },

  props: {},
  watch: {},
  data() {
    return {
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
        { text: "Opciones", value: "opciones" },
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
    };
  },
};
</script>

<style></style>
