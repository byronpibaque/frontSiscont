<template>
  <div>
    <v-form ref="form" @submit.prevent="guardar">
      <v-card>
        <v-card-title class="headline grey lighten-2 justify-center" primary-title>
          Agregar Temperatura y Humedad
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
              <v-select v-model="formAddTempHum.noTermohigrometro" :items="noTermohigrometro" label="No. Termohigométro" class="centrarTextSelect"></v-select>
            </v-card-text>
          </v-flex>

        </v-layout>

        <v-layout row wrap style="justify-content: space-evenly;">

          <v-flex xs12 md12>
            <h3 class="text-xs-center pt-3">MAÑANA</h3>
          </v-flex>

          <v-flex xs12 md4>
            <v-card-text xs6 class="py-0">
              <v-text-field v-model="formAddTempHum.temperatura_morning" class="centrar-text pt-1"
                type="number" label="TEMP. AMBIENTE (°C)" required>
              </v-text-field>
            </v-card-text>
          </v-flex>

          <v-flex xs12 md4>
            <v-card-text xs6 class="py-0">
              <v-text-field v-model="formAddTempHum.humedad_morning"
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
              <v-text-field v-model="formAddTempHum.temperatura_tarde" class="centrar-text pt-1"
                type="number" label="TEMP. AMBIENTE (°C)" required>
              </v-text-field>
            </v-card-text>
          </v-flex>

          <v-flex xs12 md4>
            <v-card-text xs6 class="py-0">
              <v-text-field v-model="formAddTempHum.humedad_tarde"
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
            Guardar
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
    data: vm => ({
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      menu1: false,
      formAddTempHum: {
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
      }
    },
    methods: {
      limpiarCampos(){
        this.formAddTempHum.fecha = '';
        this.formAddTempHum.temperatura_morning = '';
        this.formAddTempHum.humedad_morning = '';
        this.formAddTempHum.temperatura_tarde = '';
        this.formAddTempHum.humedad_tarde = '';
        this.formAddTempHum.noTermohigrometr = '';
      },
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
      mostrarAlerta(message, type, timer = 3000){
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer,
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
      async guardar(){
        
        if (this.formAddTempHum.temperatura_morning.length == '') 
          return this.mostrarAlerta('Debes ingresar la temperatura', 'warning');
        if (this.formAddTempHum.humedad_morning.length == '') 
          return this.mostrarAlerta('Debes ingresar la humedad', 'warning');
        if (this.formAddTempHum.noTermohigrometro.length == '') 
          return this.mostrarAlerta('Debes elegir el numero de termohigometro', 'warning');

        try {
          this.formAddTempHum.distribuidor = this.$store.state.usuario.codigoDistribuidor
          this.formAddTempHum.usuario      = this.$store.state.usuario._id
          this.formAddTempHum.fecha        = this.date
  
          this.loading = true;
  
          const { data } = await axios.post('/temp_humedad', this.formAddTempHum)

          if ( data.status == 500 ) {
            this.mostrarAlerta(data.msg, 'error', 6000);
          }else{
            this.limpiarCampos();
            this.mostrarAlerta(data.msg, 'success');
            this.$emit('cerrarModal')
          }
          this.loading = false;

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