<template>
  <div>
    <v-form ref="form" @submit.prevent="editar">
      <v-card>
        <v-card-title class="headline grey lighten-2 justify-center" primary-title>
          Editar Temperatura y Humedad
        </v-card-title>

        <v-layout row wrap style="justify-content: space-evenly;">
          <v-flex xs12 md4>
            <v-card-text xs6 class="pb-0">
              <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false"
              :nudge-right="40" lazy transition="scale-transition" offset-y
              full-width max-width="290px" min-width="290px">
              <template v-slot:activator="{ on }">
                <v-text-field v-model="dateFormatted" persistent-hint prepend-icon="event" 
                @blur="date = parseDate(dateFormatted)" v-on="on" label="Fecha">
                </v-text-field>
              </template>
              <v-date-picker v-model="date" no-title @input="menu1 = false">
              </v-date-picker>
            </v-menu>
            </v-card-text>
          </v-flex>

          <v-flex xs12 md4>
            <v-card-text xs6 class="pb-0">
              <v-select v-model="formEditTempHum.noTermohigrometro" :items="noTermohigrometro" label="No. Termohigométro"></v-select>
            </v-card-text>
          </v-flex>

        </v-layout>

        <v-layout row wrap style="justify-content: space-evenly;">

          <v-flex xs12 md12>
            <h3 class="text-xs-center pt-3">MAÑANA</h3>
          </v-flex>

          <v-flex xs12 md4>
            <v-card-text xs6 class="py-0">
              <v-text-field v-model="formEditTempHum.temperatura_morning" class="centrar-text pt-1"
                type="number" label="TEMP. AMBIENTE (°C)" required>
              </v-text-field>
            </v-card-text>
          </v-flex>

          <v-flex xs12 md4>
            <v-card-text xs6 class="py-0">
              <v-text-field v-model="formEditTempHum.humedad_morning"
                type="number" class="centrar-text pt-1" required
                style="text-align: center;" label="HUM. RELATIVA (%)">
              </v-text-field>
            </v-card-text>
          </v-flex>

          <v-flex xs12 md12>
            <h3 class="text-xs-center pt-3">TARDE</h3>
          </v-flex>

          <v-flex xs12 md4>
            <v-card-text xs6 class="py-0">
              <v-text-field v-model="formEditTempHum.temperatura_tarde" class="centrar-text pt-1"
                type="number" label="TEMP. AMBIENTE (°C)" required>
              </v-text-field>
            </v-card-text>
          </v-flex>

          <v-flex xs12 md4>
            <v-card-text xs6 class="py-0">
              <v-text-field v-model="formEditTempHum.humedad_tarde"
                type="number" class="centrar-text pt-1" required
                style="text-align: center;" label="HUM. RELATIVA (%)">
              </v-text-field>
            </v-card-text>
          </v-flex>

        </v-layout>

        <v-divider></v-divider>

        <v-card-actions style="justify-content: space-evenly;">
          <v-btn color="success" :loading="loading"
            type="submit" class="px-5 mb-3">
            Editar
          </v-btn>
        </v-card-actions>
        
      </v-card>
    </v-form>
  </div>
</template>

<script>
  import axios from "axios";
  import Swal from "sweetalert2";
  export default {
    props: ['dataTempHum'],
    name: 'EditarTH',
    data: vm => ({
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      menu1: false,
      formEditTempHum: {
        fecha: '',
        temperatura_morning: '',
        humedad_morning: '',
        temperatura_tarde: '',
        humedad_tarde: '',
        noTermohigrometro: ''
      },
      noTermohigrometro: ['General', '#1', '#2', '#3', '#4', '#5', '#6', '#7', '#8', '#9', '#10', '#11', '#12', 'Refri #1', 'Refri #2', 'Refri #3', 'Refri #4'],
      loading: false
    }),
    computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
      }
    },
    watch: {
      date (val) {
        this.dateFormatted = this.formatDate(this.date)
      },
      dataTempHum(){
        this.formEditTempHum.temperatura_morning  = this.dataTempHum.temperatura_morning;
        this.formEditTempHum.temperatura_tarde    = this.dataTempHum.temperatura_tarde;
        this.formEditTempHum.humedad_morning      = this.dataTempHum.humedad_morning;
        this.formEditTempHum.humedad_tarde        = this.dataTempHum.humedad_tarde;
        this.formEditTempHum.noTermohigrometro    = this.dataTempHum.noTermohigrometro;
        this.date = this.dataTempHum.fecha.split('T')[0]
        this.formEditTempHum.distribuidor         = this.dataTempHum.distribuidor
        this.formEditTempHum.usuario              = this.dataTempHum.usuario
        this.formEditTempHum._id                  = this.dataTempHum._id
      }
    },
    methods: {
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      mostrarAlerta(message, type){
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: type,
          title: message
        })
      },
      async editar(){
        
        if (this.formEditTempHum.temperatura_morning.length == '') 
          return this.mostrarAlerta('Debes ingresar la temperatura', 'warning');
        if (this.formEditTempHum.humedad_morning.length == '') 
          return this.mostrarAlerta('Debes ingresar la humedad', 'warning');
        if (this.formEditTempHum.noTermohigrometro.length == '') 
          return this.mostrarAlerta('Debes elegir el numero de termohigometro', 'warning');

        try {
          this.formEditTempHum.fecha = this.date
  
          this.loading = true;
  
          await axios.put('/temp_humedad', this.formEditTempHum)

          this.loading = false;
          this.mostrarAlerta('Editado exitosamente', 'success');
          this.$emit('cerrarModal')
        } catch (error) {
          this.mostrarAlerta('Ocurrio un error al intentar guardar', 'error');
          this.loading = false;
        }          
      }
    }
  }
</script>

<style>
.centrar-text > div > div > div input {
  text-align: center;
  font-size: 19px;
  font-weight: 600;
  color: rgb(64 27 153 / 87%) !important;
}
</style>