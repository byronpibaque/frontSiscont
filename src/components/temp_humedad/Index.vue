<template>
  <v-layout row wrap>
      <v-flex md6 class="titleModuloTH">
        Registro de Temperatura Y Humedad Relativa Ambiental
      </v-flex>
      <v-flex md6 class="btnModuloTH">
        <v-btn v-if="esGuardaAlmacen"
          color="success" @click="agregarTempHumd = true">
          Agregar
        </v-btn>
      </v-flex>

      <v-flex md9 class="mt-2 mb-4 ml-3" style="display: inline-flex; align-items: center;">
        <span class="mr-4" style="width: 20%;">
          Filtrar por Mes:
        </span>
        
        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" 
        style="width: 26%; position: relative; right: 50px;"
            :nudge-right="40" :return-value.sync="date" lazy 
            transition="scale-transition" offset-y full-width
            max-width="290px" min-width="290px">
          <template v-slot:activator="{ on }">
            <v-text-field v-model="date" 
              prepend-icon="event" readonly v-on="on">
            </v-text-field>
          </template>
          <v-date-picker v-model="date" type="month" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
          </v-date-picker>
        </v-menu> 

        <v-select v-model="termohigrometroSelected" :items="noTermohigrometro" style="position: relative;right: 140px; width: 26%;"
          label="No. Termohigométro" class="centrarTextSelect">
        </v-select>

        <v-btn color="success" style="position: relative; right: 110px;" @click="filtrar">
          Filtrar
        </v-btn>

        <v-btn color="error" style="position: relative; right: 100px;" :loading="loadingPDF"
          @click="getReporte">
          Reporte
        </v-btn>
      </v-flex>

      <v-flex md12 class="mt-07" style="margin-bottom: 33px;">
        <v-data-table :items="rows" class="elevation-1" :loading="loading">
          <template v-slot:headers>
            <tr class="border-table">
              <th rowspan="2" class="border-table">ACCIONES</th>      
              <th rowspan="2" class="border-table">FECHA</th>      
              <th colspan="2" class="border-table">TEMPERATURA AMBIENTE(°C)</th>      
              <th colspan="2" class="border-table">HUMEDAD RELATIVA(%)</th>
              <th rowspan="2" class="border-table">NO. TERMOHIGROMÉTRO</th> 
            </tr>
            <tr class="border-table">      
              <th>MAÑANA</th>
              <th class="border-table">TARDE</th>      
              <th>MAÑANA</th>
              <th class="border-table">TARDE</th>
            </tr>
          </template>
          <template v-slot:items="props">
            <td class="text-xs-center">
              <v-icon small class="mr-3" @click="editarTempAndHumedad( props.item )">edit</v-icon>
              <v-icon small class="mr-3" @click="eliminarTempAndHumedad( props.item._id )">delete</v-icon>
            </td>
            <td class="text-xs-center">
              {{ formatearFecha(props.item.fecha) }}
            </td>
            <td class="text-xs-center">
              {{ props.item.temperatura_morning }}°C
            </td>
            <td class="text-xs-center">
              {{ (props.item.temperatura_tarde != '') ? props.item.temperatura_tarde +'°C' :  '-----' }}
            </td>
            <td class="text-xs-center">
              {{ props.item.humedad_morning }}%
            </td>
            <td class="text-xs-center">
              {{ (props.item.humedad_tarde != '') ? props.item.humedad_tarde + '°C' : '-----' }}
            </td>
            <td class="text-xs-center">
              {{ props.item.noTermohigrometro }}
            </td>
          </template>

          <template v-slot:no-data>
            <tr>      
              <td colspan="7" class="text-xs-center">
                <h4>No se encontro ningun registro</h4>
              </td>
            </tr>
          </template>

        </v-data-table>
      </v-flex>   

    <!-- Dialog Temperatura y Humedad Add -->
    <v-dialog v-model="agregarTempHumd" width="700">
      <ComponentAdd @cerrarModal="closeModal" />
    </v-dialog>

    <!-- Dialog Temperatura y Humedad Edit -->
    <v-dialog v-model="editarTempHumd" width="700">
      <ComponentEdit :dataTempHum="dataTempHum" @cerrarModal="closeModal" />
    </v-dialog>
  </v-layout>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import ComponentAdd from "./Add"
import ComponentEdit from "./Edit"
export default {
  name: 'IndexTH',
  components: { ComponentAdd, ComponentEdit },
  computed: {
    esGuardaAlmacen() {
      return (this.$store.state.usuario.rol == "609ed47286d0416b4a050c58");
    }
  },
  data() {
    return {
      agregarTempHumd: false,
      editarTempHumd: false,
      dataTempHum: {},
      rows: [],
      loading: false,
      loadingPDF: false,
      date: new Date().toISOString().substr(0, 7),
      menu: false,
      modal: false,
      noTermohigrometro: ['General', '#1', '#2', '#3', '#4', '#5', '#6', '#7', '#8', '#9', '#10', '#11', '#12', 'Refri #1', 'Refri #2', 'Refri #3', 'Refri #4'],
      termohigrometroSelected: 'General'
    };
  },
  methods: {
    editarTempAndHumedad(data){
      this.editarTempHumd = true;
      this.dataTempHum = data
    },
    eliminarTempAndHumedad( id ){
      Swal.fire({
        title: 'Estas seguro de eliminar este registro?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        denyButtonText: `Cancelar`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.delete(`temp_humedad/${ id }`)

            this.getTempHumedad(this.date, this.termohigrometroSelected);
          } catch (error) {
            alert("Ocurrio un error al tratar de eliminar")
          }
        }
      })
    },
    async getTempHumedad(date, termo){
      this.loading = true;
      const { data } = await axios.get('/temp_humedad', { params: { date, termo } })
      this.rows = data.list;
      this.loading = false;
    },
    closeModal(){
      this.agregarTempHumd = false;
      this.editarTempHumd = false;
      this.getTempHumedad( this.date, this.termohigrometroSelected );
    },
    formatearFecha( fecha ){
      const arrayDate = fecha.split('T')[0].split('-');
      return `${ arrayDate[2] }/${ arrayDate[1] }/${ arrayDate[0] }`;
    },
    filtrar(){
      this.getTempHumedad( this.date, this.termohigrometroSelected );
    },
    async getReporte(){
      try {
        this.loadingPDF = true;
        const { data } = await axios.post('/temp_humedad/pdf', { rows: this.rows }, {responseType: 'blob'})
        var oMyBlob = new Blob([data], {type : 'application/pdf'});
        var url = URL.createObjectURL( oMyBlob );
        window.open(url, "_blank");
        this.loadingPDF = false;
      } catch (error) {
        this.loadingPDF = false;  
      }
    }
  },
  mounted(){
    this.getTempHumedad( this.date, 'General' )
  }
};
</script>

<style>
.titleModuloTH{
  text-align: center;
  font-size: 22px;
  /* height: 10px; */
}
.btnModuloTH{
  text-align: right;
  /* height: 10px; */
}
.border-table{
  border-color: rgb(191 176 176 / 54%);
  border-width: 1px;
  border-style: solid;
}
</style>








