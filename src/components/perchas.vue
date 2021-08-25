<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Perchas</v-toolbar-title>
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
        <v-dialog v-model="dialog" max-width="700px">
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
                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="descripcion" label="Percha"></v-text-field>
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
                      Nuevo nivel
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
                                <v-text-field v-model="props.item.nivel"></v-text-field>
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
        v-if="!verNuevo"
        :headers="cabecera"
        :items="perchas"
        class="elevation-1"
        :items-per-page="5"
        :search="search"
      >
        <template v-slot:items="props">
          <td>
            <v-icon small class="mr-2" @click="verDetalle(props.item)">tab</v-icon>
          </td>
          <td class="blue--text">
            {{ props.item.descripcion }}
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
  created() {
    this.listar();
  },
  methods: {
    validar() {
      this.valida = 0;
      this.validaMensaje = [];

      if (this.descripcion.length == 0) {
        this.validaMensaje.push("*Descripcion no puede estar vacío.");
      }

      this.detalles.forEach((element) => {
        if (element.nivel.length == 0) {
          this.validaMensaje.push("*Nivel no puede estar vacío.");
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
          .put("perchas/actualizar", {
            _id: this._id,
            descripcion: this.descripcion,
            niveles: this.detalles,
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
          .post("perchas/add", {
            descripcion: this.descripcion,
            niveles: this.detalles,
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

    verDetalle(item) {
      let me = this;
      this.dialog = true;
      this.editedIndex = 1;
      this._id = item._id;
      this.descripcion = item.descripcion;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("perchas/query?_id=" + item._id, configuracion)
        .then(function (response) {
          me.detalles = response.data.niveles;
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
      me.detalles.push({
        nivel: "",
      });
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
          .get("perchas/list", configuracion)
          .then(function (response) {
            if (response.status == 200) {
              me.perchas = response.data;
            } else {
              console.log(response);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    limpiar() {
      this.descripcion = "";
      this.detalles = [];
      this.editedIndex = -1;
    },
    close() {
      this.dialog = false;
      this.limpiar();
    },
  },

  props: {},
  watch: {},
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo registro" : "Editar registro";
    },
  },
  data() {
    return {
      descripcion: "",
      cabeceraDetalles: [
        { text: "Borrar", value: "borrar", sortable: false },
        { text: "Nivel", value: "nivel", sortable: false },
      ],
      detalles: [],
      search: "",
      cabecera: [
        { text: "Niveles", value: "niveles", sortable: false },
        { text: "Descripcion", value: "descripcion", sortable: false },
      ],
      perchas: [],
      verNuevo: 0,
      editedIndex: -1,
      dialog: false,
      valida: 0,
      validaMensaje: [],
    };
  },
};
</script>

<style></style>
