<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Secuenciales</v-toolbar-title>
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
        <v-dialog v-model="dialog" max-width="900px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm3 md3>
                    <v-text-field
                      v-model="ptoEmision"
                      label="Punto de emision"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12></v-flex>

                  <v-flex xs12 sm5 md5>
                    <v-autocomplete
                      v-model="codigoUsuario"
                      :items="usuarios"
                      label="Usuario"
                    ></v-autocomplete>
                  </v-flex>

                  <v-flex xs12 sm5 md5>
                    <v-autocomplete
                      v-model="codigoDistribuidor"
                      :items="distribuidores"
                      label="Distribuidor"
                    ></v-autocomplete>
                  </v-flex>

                  <v-flex xs12 sm12 md12>
                    <v-btn
                      color="white"
                      small
                      flat
                      class="primary"
                      @click="AgregarDetalle()"
                    >
                      <v-icon>add</v-icon>
                      Nuevo establecimiento
                    </v-btn>
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
                                 <v-text-field
                                    v-model="props.item.secuencial"
                                  ></v-text-field>
                              </td>
                               <td>
                                 <v-text-field
                                    v-model="props.item.documento"
                                  ></v-text-field>
                              </td>
                             
                            </template>
                            <template slot="no-data">
                              <h3>No hay artículos agregados al detalle.</h3>
                            </template>
                          </v-data-table>
                        </template>
                      </v-flex>
                    </v-layout>
                  </v-flex>

                  <v-flex xs12 sm12 md12 v-show="valida">
                    <div
                      class="red--text"
                      v-for="v in validaMensaje"
                      :key="v"
                      v-text="v"
                    ></div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" flat @click="guardar">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="data"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="editItem(props.item)"
              >edit</v-icon
            >
            <v-icon small class="mr-2" @click="eliminar(props.item)"
              >delete</v-icon
            >
          </td>
          <td>{{ props.item.codigoUsuario.nombres }}</td>
          <td>{{ props.item.codigoDistribuidor.razonSocial }}</td>

          <td>00{{ props.item.ptoEmision }}</td>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()">RECARGAR</v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      
      data: [],
      ptoEmision:0,
      codigoDistribuidor:"",
      codigoUsuario:"",
      usuarios:[],
      distribuidores: [],
      obligadoContabilidad: 0,
      cabeceraDetalles: [
        { text: "Borrar", value: "borrar", sortable: false },
        { text: "Secuencial", value: "secuencial", sortable: false },
        { text: "Documento", value: "documento", sortable: false }
      ],
      detalles: [],
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Usuario", value: "codigoUsuario", sortable: true },
        { text: "Distribuidor", value: "codigoDistribuidor", sortable: true },
        { text: "Pto. Emision", value: "ptoEmision", sortable: true },
      ],

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
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo registro" : "Editar registro";
    },
  },

  watch: {},
  props: {},
  methods: {
    obtenerUsuarios() {
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("usuario/list", configuracion)
        .then(function (response) {
          ArrayT = response.data;
          ArrayT.map(function (x) {
            me.usuarios.push({ text: x.nombres, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    obtenerDistribuidores() {
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("distribuidor/list", configuracion)
        .then(function (response) {
          ArrayT = response.data;
          ArrayT.map(function (x) {
            me.distribuidores.push({ text: x.nombreComercial, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
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
        secuencial: "",
        documento: "",
       
      });
    },
    eliminar(item) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .delete("DATA/remove?_id=" + item._id, configuracion)
        .then(function (response) {
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];

      if (this.ptoEmision.length == 0) {
        this.validaMensaje.push("*Pto Emision no puede estar vacío.");
      }

      if (this.codigoDistribuidor.length == 0) {
        this.validaMensaje.push("*Distribuidor no puede estar vacío.");
      }
      if (this.codigoUsuario.length == 0) {
        this.validaMensaje.push("*Usuario no puede estar vacío.");
      }
      

      this.detalles.forEach((element) => {
        if (element.secuencial.length == 0) {
          this.validaMensaje.push("*Secuencial no puede estar vacío.");
        }
        if (element.documento.length == 0) {
          this.validaMensaje.push("*Documento no puede estar vacío.");
        }
       
      });

      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    guardar() {
      let me = this;
      if (this.validar()) {
        return;
      }

      if (this.editedIndex > -1) {
        //Código para editar
        axios
          .put("data/actualizar", {
            _id: this._id,
            ptoEmision: this.ptoEmision,
            codigoUsuario: this.codigoUsuario,
            codigoDistribuidor: this.codigoDistribuidor,
            secuenciales: this.detalles,
          })
          .then(function (response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        //Código para guardar
        axios
          .post("data/add", {
            ptoEmision: this.ptoEmision,
            codigoUsuario: this.codigoUsuario,
            codigoDistribuidor: this.codigoDistribuidor,
            secuenciales: this.detalles,
          })
          .then(function (response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },

    listar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("data/list", configuracion)
        .then(function (response) {
          me.data = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    close() {
      this.dialog = false;
      this.limpiar();
    },
    limpiar() {
     
      this.codigoDistribuidor= "";
      this.codigoUsuario=""
      this.ptoEmision=""
      this.detalles = [];
      this.valida = 0;
      this.validaMensaje = [];
      this.editedIndex = -1;
    },
    editItem(item) {
      this._id = item._id;
      this.ptoEmision = item.ptoEmision;
      this.codigoUsuario = item.codigoUsuario._id;
      this.codigoDistribuidor= item.codigoDistribuidor._id;
      this.listarDetalle(item._id);
     
      this.dialog = true;
      this.editedIndex = 1;
    },
    listarDetalle(_id) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("data/queryId?_id=" + _id, configuracion)
        .then(function (response) {
         
          me.detalles = response.data.secuenciales;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    formatearFecha(value) {
      if (value) {
        return moment(String(value)).format("MM/DD/YYYY");
      }
    },
  },
  created() {
    this.listar();
    this.obtenerDistribuidores();
    this.obtenerUsuarios();
  },
};
</script>

<style>
</style>