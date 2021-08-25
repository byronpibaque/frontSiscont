<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Bodegas</v-toolbar-title>
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
                                <v-text-field v-model="codigoNumerico" label="Código númerico"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-text-field v-model="descripcion" label="Descripcion"></v-text-field>
                            </v-flex>

                            <v-flex xs12 sm12 md12>
                                     <v-autocomplete
                                            v-model="codigoDistribuidor"
                                            :items="distribuidores"
                                            label="Distribuidor"
                                        ></v-autocomplete>
                            </v-flex>
                       
                            <v-flex xs12 sm12 md12 v-show="valida">
                                <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
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

            <v-data-table :headers="headers" :items="bodegas" :search="search" class="elevation-1">
            <template v-slot:items="props">
            <td class="justify-center layout px-0">
                <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                <v-icon small class="mr-2" @click="eliminar(props.item)">delete</v-icon>
            </td>
            <td>{{ props.item.codigoNumerico }}</td>
            <td>{{ props.item.descripcion }}</td>
            <td>{{ props.item.codigoDistribuidor.razonSocial }}</td>
            <td>{{ props.item.codigoUsuario.nombres }}</td>
            <td>
                <div v-if="props.item.estado">
                <span class="blue--text">Activo</span>
                </div>
                <div v-else>
                <span class="red--text">Inactivo</span>
                </div>
            </td>
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

export default {
  data () {
    return {
      codigoNumerico: "",
      descripcion: "",
      distribuidores: [],
      codigoDistribuidor: "",
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Código númerico", value: "codigoNumerico", sortable: true },
        { text: "Descripcion", value: "descripcion", sortable: true },
        { text: "Distribuidor", value: "codigoDistribuidor.razonSocial", sortable: true },
        { text: "Usuario creador", value: "codigoUsuario.nombres", sortable: true },
        { text: "Estado", value: "estado", sortable: true },
      ],
      bodegas:[],
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
      editedIndex: -1,
      _id: "",
      dialog: false,
      search: ""
    }  
    },
     computed: {
        formTitle() {
        return this.editedIndex === -1 ? "Nuevo registro" : "Editar registro";
        }
  }, 
  watch: {
  },
  props: {
  },
  methods: {
    eliminar (item) { 
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .delete("bodega/remove?_id="+item._id, configuracion)
        .then(function(response) {
          me.listar()
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    validar () { 
      this.valida = 0;
      this.validaMensaje = [];

      if (this.codigoNumerico.length==0) {
        this.validaMensaje.push("*Código númerico no puede estar vacío.")
      }

      if (this.descripcion.length==0) {
        this.validaMensaje.push("*Descripcion no puede estar vacío.")
      }
      if (this.codigoDistribuidor.length==0) {
        this.validaMensaje.push("*Distribuidor no puede estar vacío.")
      }
   
     
     


      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida; 
    },
    guardar () { 
     let me = this;
      if (this.validar()) {
        return;
      }
     
      if (this.editedIndex > -1) {
     
        //Código para editar
        axios
          .put("bodega/actualizar", {
              _id: this._id,
              codigoNumerico:this.codigoNumerico,
              descripcion:this.descripcion,
              codigoDistribuidor:this.codigoDistribuidor,
              codigoUsuario:this.$store.state.usuario._id
          })
          .then(function(response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
              //Código para guardar
        axios
          .post("bodega/add", {
              codigoNumerico:this.codigoNumerico,
              descripcion:this.descripcion,
              codigoDistribuidor:this.codigoDistribuidor,
              codigoUsuario:this.$store.state.usuario._id       
          })
          .then(function(response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
            console.log(error);
          });
      } 
    },
    obtenerDistribuidores () { 
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("distribuidor/list", configuracion)
        .then(function(response) {
          ArrayT = response.data;
          ArrayT.map(function(x) {
            me.distribuidores.push({ text: x.razonSocial, value: x._id });
          });
        })
        .catch(function(error) {
          console.log(error);
        }); 
    },
    listar(){
        let me = this;
        let header = { Token: this.$store.state.token };
        let configuracion = { headers: header };
        axios
            .get("bodega/list", configuracion)
            .then(function(response) {
                me.bodegas = response.data;
            })
            .catch(function(error) {
                console.log(error);
            });
    },
    close() {
    this.dialog = false;
    this.limpiar()
    },
    limpiar(){
        this.descripcion=""
        this.codigoDistribuidor=""
        this.codigoNumerico=""
        this.valida = 0;
        this.validaMensaje = [];
        this.editedIndex = -1;
    },
    editItem(item) {
        this.descripcion=item.descripcion
        this.codigoNumerico=item.codigoNumerico
        this.codigoDistribuidor=item.codigoDistribuidor._id
        this._id=item._id                  
        this.dialog = true;
        this.editedIndex = 1;
    },
  },
  created () {
      this.listar()
      this.obtenerDistribuidores()
  },

}
</script>

<style>

</style>