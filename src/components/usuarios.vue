<template>
     <v-layout align-start>
        <v-flex>
             <v-toolbar flat color="white">
                <v-toolbar-title>Usuarios</v-toolbar-title>
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
                         
                            <v-flex xs12 sm5 md5>
                                <v-text-field v-model="numDocumento" label="Cedula"></v-text-field>
                            </v-flex>
                               <v-flex xs12 sm12 md12></v-flex>
                             <v-flex xs12 sm5 md5>
                                <v-text-field v-model="nombres" label="Nombres"></v-text-field>
                            </v-flex>
                             <v-flex xs12 sm5 md5>
                                <v-autocomplete
                                                        v-model="codigoRol"
                                                        :items="roles"
                                                        label="Rol"
                                                      ></v-autocomplete>
                            </v-flex>
                             <v-flex xs12 sm4 md4>
                                <v-text-field v-model="telefono" label="Telefono"></v-text-field>
                            </v-flex>
                              <v-flex xs12 sm7 md7>
                                <v-text-field v-model="direccion" label="Direccion"></v-text-field>
                            </v-flex>
                             <v-flex xs12 sm7 md7>
                                <v-text-field v-model="correo" label="Correo"></v-text-field>
                            </v-flex>
                             <v-flex xs12 sm4 md4>
                                <v-text-field v-model="fechaNacimiento" label="Fecha de nacimiento"></v-text-field>
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
                                                        v-model="props.item.usuario"
                                                    ></v-text-field>
                                                    </td>
                                                         <td>
                                                    <v-text-field
                                                        v-model="props.item.clave"
                                                    ></v-text-field>
                                                    </td>
                                                    <td v-if="editedIndex!=-1">
                                                         {{props.item.codigoDistribuidor.razonSocial}}
                                                    </td>
                                                    <td v-else>
                                                        <v-autocomplete
                                                        v-model="props.item.codigoDistribuidor"
                                                        :items="distribuidores"
                                                        label="Distribuidor"
                                                      ></v-autocomplete>
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
        <v-data-table :headers="headers" :items="usuarioes" :search="search" class="elevation-1">
                <template v-slot:items="props">
                <td class="justify-center layout px-0">
                    <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                    <v-icon small class="mr-2" @click="eliminar(props.item)">delete</v-icon>
                </td>
                <td>{{ props.item.numDocumento }}</td>
                <td>{{ props.item.nombres }}</td>
                <td v-if="props.item.codigoRol">{{ props.item.codigoRol.descripcion }}</td>
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment";
import Swal from "sweetalert2";
export default { 
  data () {
    return {
        fechaNacimiento:"",
      usuarioes:[],
      correo: "",
      direccion: "",
      codigoRol: "",
      numDocumento: "",
      nombres: "",
      telefono: "",
        roles:[],
      distribuidores: [],
      obligadoContabilidad: 0,
        cabeceraDetalles: [
            { text: "Borrar", value: "borrar", sortable: false },
            { text: "Usuario", value: "usuario", sortable: false },
            { text: "Clave", value: "clave", sortable: false },
            {
            text: "Distribuidor",
            value: "codigoDistribuidor.razonSocial",
            sortable: false,
            }
      
      ],
      detalles: [],
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Cedula", value: "numDocumento", sortable: true },
        { text: "Nombres", value: "nombres", sortable: true },
        { text: "Rol", value: "codigoRol", sortable: true },
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
       obtenerRoles () { 
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("rol/list", configuracion)
        .then(function(response) {
          ArrayT = response.data;
          ArrayT.map(function(x) {
            me.roles.push({ text: x.descripcion, value: x._id });
          });
        })
        .catch(function(error) {
          console.log(error);
        }); 
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
    eliminarEstablecimiento (item) { 
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .delete("usuario/removeEstablecimiento?_id="+this._id+"&codigoEstablecimiento="+item._id, configuracion)
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
        usuario: "",
        clave: "",
        codigoDistribuidor: "",       
      });
    },
      eliminar (item) { 
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .delete("usuario/remove?_id="+item._id, configuracion)
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

      if (this.numDocumento.length==0) {
        this.validaMensaje.push("*Cedula no puede estar vacío.")
      }

      if (this.nombres.length==0) {
        this.validaMensaje.push("*Nombres no puede estar vacío.")
      }
      if (this.codigoRol.length==0) {
        this.validaMensaje.push("*Rol no puede estar vacío.")
      }
      if (this.telefono.length==0) {
        this.validaMensaje.push("*Telefono no puede estar vacío.")
      }

      if (this.direccion.length==0) {
        this.validaMensaje.push("*Direccion no puede estar vacío.")
      }
      if (this.correo.length==0) {
        this.validaMensaje.push("*Correo no puede estar vacío.")
      }
       if (this.fechaNacimiento.length==0) {
        this.validaMensaje.push("*Fecha nacimiento no puede estar vacío.")
      }

        this.detalles.forEach(element => {
            if(element.usuario.length==0){
                this.validaMensaje.push("*Usuario no puede estar vacío.")
            }
            if(element.clave.length==0){
                this.validaMensaje.push("*Clave no puede estar vacío.")
            }
            if(element.codigoDistribuidor.length==0){
                this.validaMensaje.push("*Distribuidor no puede estar vacío.")
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
          .put("usuario/actualizar", {
                "_id": this._id,
            "numDocumento": this.numDocumento,
            "nombres":this.nombres,
            "direccion": this.direccion,
            "telefono":this.telefono,
            "correo":this.correo,
             "codigoRol":this.codigoRol,
            "fechaNacimiento": this.fechaNacimiento,
            "login":this.detalles
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
          .post("usuario/add", {
                 "numDocumento": this.numDocumento,
                "nombres":this.nombres,
                "direccion": this.direccion,
                "telefono":this.telefono,
                "correo":this.correo,
                "fechaNacimiento": this.fechaNacimiento,
                "codigoRol":this.codigoRol,
                "login":this.detalles   
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
            .get("usuario/list", configuracion)
            .then(function(response) {
                me.usuarioes = response.data;
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
       this.numDocumento=""
       this.nombres=""
       this.correo=""
       this.telefono=""
       this.fechaNacimiento=""
       this.direccion=""
        this.codigoRol=""
        this.detalles=[]
        this.valida = 0;
        this.validaMensaje = [];
        this.editedIndex = -1;
    },
    editItem(item) {
        this._id=item._id
        this.numDocumento=item.numDocumento
        this.nombres=item.nombres
        this.razonSocial=item.razonSocial
        this.correo=item.correo
        this.direccion=item.direccion
        this.telefono=item.telefono
        this.codigoRol=item.codigoRol._id
        this.fechaNacimiento=this.formatearFecha(item.fechaNacimiento)
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
        .get("usuario/query?_id=" + id, configuracion)
        .then(function (response) {
          me.detalles = response.data.login;
          
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
  created () {
      this.listar()
      this.obtenerDistribuidores()
      this.obtenerRoles()
  },

}
</script>

<style>

</style>