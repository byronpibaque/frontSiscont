<template>
     <v-layout align-start>
        <v-flex>
             <v-toolbar flat color="white">
                <v-toolbar-title>Distribuidores</v-toolbar-title>
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

                            <v-flex xs12 sm12 md12>
                                 <v-checkbox
                                        v-model="obligadoContabilidad"
                                        label="Obligado a llevar contabilidad?"
                                        ></v-checkbox>
                            </v-flex>
                         
                            <v-flex xs12 sm5 md5>
                                <v-text-field v-model="ruc" label="RUC"></v-text-field>
                            </v-flex>
                               <v-flex xs12 sm12 md12></v-flex>
                             <v-flex xs12 sm5 md5>
                                <v-text-field v-model="razonSocial" label="Razon Social"></v-text-field>
                            </v-flex>
                             <v-flex xs12 sm5 md5>
                                <v-text-field v-model="nombreComercial" label="Nombre Comercial"></v-text-field>
                            </v-flex>
                             <v-flex xs12 sm4 md4>
                                <v-text-field v-model="fechaInicioAct" label="Fecha de inicio de actividades"></v-text-field>
                            </v-flex>
                              <v-flex xs12 sm7 md7>
                                <v-text-field v-model="direccion" label="Direccion"></v-text-field>
                            </v-flex>
                             <v-flex xs12 sm7 md7>
                                <v-text-field v-model="correo" label="Correo"></v-text-field>
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
                                                    <v-icon v-if="editedIndex!=-1"
                                                        small
                                                        class="mr-2"
                                                        @click="eliminarEstablecimiento(props.item)"
                                                        >delete</v-icon
                                                    >
                                                    <v-icon v-else
                                                        small
                                                        class="mr-2"
                                                        @click="eliminarDetalle(detalles,props.item)"
                                                        >delete</v-icon
                                                    >
                                                    </td>
                                                    <td>
                                                    <v-text-field
                                                        v-model="props.item.numEstablecimiento"
                                                    ></v-text-field>
                                                    </td>
                                                    <td>
                                                        <v-autocomplete
                                                        v-model="props.item.tipoEstablecimiento"
                                                        :items="tiposestablecimientos"
                                                        label="Tipo local"
                                                      ></v-autocomplete>
                                                    </td>
                                                    <td>
                                                    <v-text-field
                                                        v-model="props.item.nombreComercialEstablecimiento"
                                                    ></v-text-field>
                                                    </td>
                                                    <td>
                                                     <v-text-field
                                                        v-model="props.item.direccionEstablecimiento"
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
        <v-data-table :headers="headers" :items="distribuidores" :search="search" class="elevation-1">
                <template v-slot:items="props">
                <td class="justify-center layout px-0">
                    <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                    <v-icon small class="mr-2" @click="eliminar(props.item)">delete</v-icon>
                </td>
                <td>{{ props.item.ruc }}</td>
                <td>{{ props.item.razonSocial }}</td>
                <td>{{ props.item.nombreComercial }}</td>
                <td>{{ props.item.correo }}</td>
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
      distribuidores:[],
      correo: "",
      direccion: "",
      fechaInicioAct: "",
      nombreComercial: "",
      razonSocial: "",
      ruc: "",
      tiposestablecimientos: ["MATRIZ","LOCAL","LOCAL COMERCIAL"],
      obligadoContabilidad: 0,
    cabeceraDetalles: [
        { text: "Borrar", value: "borrar", sortable: false },
        { text: "Núm. establecimiento", value: "numEstablecimiento", sortable: false },
        { text: "Tipo local", value: "tipoEstablecimiento", sortable: false },
        {
          text: "Nombre comercial estab.",
          value: "nombreComercialEstablecimiento",
          sortable: false,
        },
        { text: "Dir. estab.", value: "direccionEstablecimiento", sortable: false },
      
      ],
      detalles: [],
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "RUC", value: "ruc", sortable: true },
        { text: "RAZON SOCIAL", value: "razonSocial", sortable: true },
        { text: "NOMBRE COMERCIAL", value: "nombreComercial", sortable: true },
        { text: "Correo", value: "correo", sortable: true },
        { text: "Estado", value: "estado", sortable: true },
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
      search: ""
    }  
  }
,
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
    eliminarEstablecimiento (item) { 
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .delete("distribuidor/removeEstablecimiento?_id="+this._id+"&codigoEstablecimiento="+item._id, configuracion)
        .then(function(response) {
          me.listarDetalle(me._id)
        })
        .catch(function(error) {
          console.log(error);
        }); 
    },
       eliminarDetalle(arr, item) {
      let i = arr.indexOf(item);
      if (i !== -1) {
        arr.splice(i, 1);
      }
    },
    AgregarDetalle () { 
       let me = this;
      me.detalles.unshift({
        numEstablecimiento: "",
        tipoEstablecimiento: "",
        nombreComercialEstablecimiento: "",
        direccionEstablecimiento: "",
       
      });
    },
      eliminar (item) { 
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .delete("distribuidor/remove?_id="+item._id, configuracion)
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

      if (this.ruc.length==0) {
        this.validaMensaje.push("*RUC no puede estar vacío.")
      }

      if (this.nombreComercial.length==0) {
        this.validaMensaje.push("*Nombre Comercial no puede estar vacío.")
      }
      if (this.razonSocial.length==0) {
        this.validaMensaje.push("*Razon social no puede estar vacío.")
      }
      if (this.fechaInicioAct.length==0) {
        this.validaMensaje.push("*Fecha no puede estar vacío.")
      }

      if (this.direccion.length==0) {
        this.validaMensaje.push("*Direccion no puede estar vacío.")
      }
      if (this.correo.length==0) {
        this.validaMensaje.push("*Correo no puede estar vacío.")
      }
        this.detalles.forEach(element => {
            if(element.numEstablecimiento.length==0){
                this.validaMensaje.push("*Numero de establecimiento no puede estar vacío.")
            }
            if(element.tipoEstablecimiento.length==0){
                this.validaMensaje.push("*Tipo local no puede estar vacío.")
            }
            if(element.nombreComercialEstablecimiento.length==0){
                this.validaMensaje.push("*Nombre comercial estab. no puede estar vacío.")
            }
            if(element.direccionEstablecimiento.length==0){
                this.validaMensaje.push("*Direccion establecimiento no puede estar vacío.")
            }
        });
     
     


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
          .put("distribuidor/actualizar", {
                "_id": this._id,
               "obligadoContabilidad": this.obligadoContabilidad,
                "ruc": this.ruc,
                "razonSocial": this.razonSocial,
                "nombreComercial": this.nombreComercial,
                "fechaInicioAct": this.fechaInicioAct,
                "direccion": this.direccion,
                "correo":this.correo, 
                "establecimientos":this.detalles 
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
          .post("distribuidor/add", {
                "obligadoContabilidad": this.obligadoContabilidad,
                "ruc": this.ruc,
                "razonSocial": this.razonSocial,
                "nombreComercial": this.nombreComercial,
                "fechaInicioAct": this.fechaInicioAct,
                "direccion": this.direccion,
                "correo":this.correo, 
                "establecimientos":this.detalles     
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

    listar(){
        let me = this;
        let header = { Token: this.$store.state.token };
        let configuracion = { headers: header };
        axios
            .get("distribuidor/list", configuracion)
            .then(function(response) {
                me.distribuidores = response.data;
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
        this.ruc=""
        this.nombreComercial=""
        this.razonSocial=""
        this.obligadoContabilidad=0
        this.direccion=""
        this.correo=""
        this.fechaInicioAct=""
        this.detalles=[]
        this.valida = 0;
        this.validaMensaje = [];
        this.editedIndex = -1;
    },
    editItem(item) {
        this._id=item._id
        this.ruc=item.ruc
        this.nombreComercial=item.nombreComercial
        this.razonSocial=item.razonSocial
        this.correo=item.correo
        this.direccion=item.direccion
        this.fechaInicioAct=item.fechaInicioAct
        this.obligadoContabilidad=item.obligadoContabilidad
        this.listarDetalle(item._id)
        this._id=item._id                  
        this.dialog = true;
        this.editedIndex = 1;
    },
    listarDetalle(id){
         let me = this;
        let header = { Token: this.$store.state.token };
         let configuracion = { headers: header };
      axios
        .get("distribuidor/query?_id=" + id, configuracion)
        .then(function (response) {
          me.detalles = response.data.establecimientos;
        })
        .catch(function (error) {
          console.log(error);
        });
    }
 
  },
  created () {
      this.listar()
  },

}
</script>

<style>

</style>