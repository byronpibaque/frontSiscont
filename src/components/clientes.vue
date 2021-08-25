<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Clientes</v-toolbar-title>
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
                <v-flex xs4 sm4 md4 >
                  <v-autocomplete
                    v-model="tipoDocumento"
                    :items="tipoDocumentos"
                    label="Tipo documento"
                  ></v-autocomplete>
                </v-flex>
                  <v-flex xs8 sm8 md8>
                    <v-text-field v-model="ruc" label="# documento"></v-text-field>
                  </v-flex>
                   <v-flex xs12 sm12 md12>
                    <v-text-field v-model="razonsocial" label="Nombres/Razon Social"></v-text-field>
                  </v-flex>
                    
                   <v-flex xs12 sm12 md12>
                    <v-text-field v-model="telefono" label="Telefono"></v-text-field>
                  </v-flex>
                   <v-flex xs12 sm12 md12>
                    <v-text-field v-model="correo" label="Correo"></v-text-field>
                  </v-flex>
                   <v-flex xs12 sm12 md12>
                    <v-text-field v-model="direccion" label="Direccion"></v-text-field>
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
        <v-dialog v-model="adModal" max-width="290">
          <v-card>
            <v-card-title class="headline" v-if="adAccion==1">Activar Item</v-card-title>
            <v-card-title class="headline" v-if="adAccion==2">Desactivar Item</v-card-title>
            <v-card-text>
              Estás a punto de
              <span v-if="adAccion==1">activar</span>
              <span v-if="adAccion==2">desactivar</span>
              el item {{adNombre}}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="activarDesactivarCerrar()" color="green darken-1" flat="flat">Cancelar</v-btn>
              <v-btn
                v-if="adAccion==1"
                @click="activar()"
                color="orange darken-4"
                flat="flat"
              >Activar</v-btn>
              <v-btn
                v-if="adAccion==2"
                @click="desactivar()"
                color="orange darken-4"
                flat="flat"
              >Desactivar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table :headers="headers" :items="cliente" :search="search" class="elevation-1">
        <template v-slot:items="props">
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
            <v-icon small class="mr-2" @click="eliminar(props.item)">delete</v-icon>
           
          </td>
          <td>{{ props.item.nombres }}</td>
          <td>{{ props.item.numDocumento }}</td>
          <td>{{ props.item.direccion }}</td>
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
  data() {
    return {
      correo: "",
      telefono: "",
      tipoDocumentos: [
          {text:"CEDULA",value:"05"},
          {text:"RUC",value:"04"}
          ],
      tipoDocumento: "",
      
      search: "",
      cliente: [],
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Razon Social", value: "nombres", sortable: true },
        { text: "# Documento", value: "numDocumento", sortable: true },
        { text: "Direccion", value: "direccion", sortable: true },
           { text: "Estado", value: "estado", sortable: true },
      ],
      editedIndex: -1,
      _id: "",
      dialog: false,

      ruc:"",
      razonsocial:"",
      direccion:"",
     
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: ""
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo registro" : "Editar registro";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
  this.listar()
  },
  methods: {
    eliminar (item) { 
     let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .delete("cliente/remove?_id="+item._id, configuracion)
        .then(function(response) {
          me.listar()
        })
        .catch(function(error) {
          console.log(error);
        });

    },

    listar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("cliente/list", configuracion)
        .then(function(response) {
          me.cliente = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    limpiar() {
      this._id = "";
 
      this.direccion = "";
      this.razonsocial = "";
      this.ruc = "";
        this.telefono=""
        this.correo=""
        this.tipoDocumento=""

     
      this.valida = 0;
      this.validaMensaje = [];
      this.editedIndex = -1;
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];

      if (this.ruc.length==0) {
        this.validaMensaje.push("*RUC no puede estar vacío.")
      }

      if (this.razonsocial.length==0) {
        this.validaMensaje.push("*Razon Social no puede estar vacío.")
      }
      if (this.direccion.length==0) {
        this.validaMensaje.push("*Direccion no puede estar vacío.")
      }
   
     


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
          .put("cliente/actualizar", {
              _id: this._id,
                tipoDocumento:me.tipoDocumento,
                numDocumento:me.ruc,
                nombres:me.razonsocial,
                direccion:me.direccion,
                telefono:me.telefono,
                email:me.correo     
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
          .post("cliente/add", {
            tipoDocumento:me.tipoDocumento,
            numDocumento:me.ruc,
            nombres:me.razonsocial,
            direccion:me.direccion,
            telefono:me.telefono,
            email:me.correo      
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
    editItem(item) {
        this._id=item._id
           this.ruc=item.numDocumento
           this.razonsocial=item.nombres
           this.direccion=item.direccion
           this.telefono=item.telefono
           this.correo=item.email
           this.tipoDocumento=item.tipoDocumento
        
         
                      
              this.dialog = true;
              this.editedIndex = 1;
    },
    activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.nombres;
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
      axios
        .put("persona/activate", { _id: this.adId })
        .then(function(response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    desactivar() {
      let me = this;
      axios
        .put("persona/deactivate", { _id: this.adId })
        .then(function(response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    close() {
      this.dialog = false;
      this.limpiar()
    }
  }
};
</script>
