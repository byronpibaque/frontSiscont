<template>
  <v-layout row wrap>
      <v-flex md4 class="titleModuloTH" style="height: 30px; display: flex;">
        <v-btn type="submit" color="blue-grey" class="white--text" 
          @click="$router.push({ name: 'acta_entrega' })">
          REgresar
        </v-btn>
      </v-flex>
      <v-flex md8 class="titleModuloTH" style="height: 30px; display: flex;">
        Agregar Acta de Entrega
      </v-flex>

        <template>
          <!-- <v-form> -->
            <v-container>
              <v-layout row wrap>
                <v-flex xs4>
                  <v-text-field v-model="formActaEntrega.lugar"
                    type="text" label="Lugar" required>
                  </v-text-field>
                </v-flex>

                <v-flex xs4>
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

                <v-flex xs4>
                  <v-text-field v-model="formActaEntrega.RPIS"
                    label="Subsistema RPIS">
                  </v-text-field>
                </v-flex>

                <v-flex xs4>
                  <v-text-field v-model="formActaEntrega.nombreEntidadContratante"
                    label="Nombre de la entidad contratante" required>
                  </v-text-field>
                </v-flex>

                <v-flex xs4>
                  <v-text-field v-model="formActaEntrega.rucEntidadContratante"
                    type="number" label="RUC entidad contratante" required>
                  </v-text-field>
                </v-flex>

                <v-flex xs4>
                  <v-text-field v-model="formActaEntrega.direccionContratante"
                    label="Dirección del contratante" required>
                  </v-text-field>
                </v-flex>

                <v-flex xs4>
                  <v-text-field v-model="formActaEntrega.nombreProveedor"
                    label="Nombre del proveedor" required>
                  </v-text-field>
                </v-flex>

                <v-flex xs4>
                  <v-text-field v-model="formActaEntrega.rucProveedor"
                    type="number" label="RUC proveedor" required>
                  </v-text-field>
                </v-flex>

                <v-flex xs4>
                  <v-text-field v-model="formActaEntrega.tipoContrato"
                    type="text" label="Tipo de contrato" required>
                  </v-text-field>
                </v-flex>

                <v-flex xs3 class="py-0"></v-flex>
                <v-flex xs5 class="py-0">
                  <v-text-field v-model="formActaEntrega.numContrato"
                    type="number" label="Numero de contrato (Ej: CE-20170000XXXXXX)" required>
                  </v-text-field>
                </v-flex>

                <v-flex xs5 class="pt-0">
                  <v-text-field v-model="codigo" type="text" label="Código" 
                    @keyup.enter="buscarCodigo" required>
                  </v-text-field>
                </v-flex>

                <v-flex xs12 class="pt-0">
                  <v-data-table :headers="headers" :items="rows" 
                  :rows-per-page-items="[30, 60, 90]" class="elevation-1">
                    <template v-slot:items="props">
                      <td>
                        <v-icon small class="mr-2" @click="quitar(props.index)">
                          delete
                        </v-icon>
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.codigoProducto.descripcion }}
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.nombreComercial }}
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.demasDatos.codigoPresentacion.descripcion }}
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.demasDatos.detalleConcentracion }}
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.registroSanitario }}
                      </td>
                      <td class="text-xs-center px-4">
                        {{ props.item.codigoLote }}
                      </td>
                      <td class="text-xs-center">
                        {{ mostrarDiferenciasMeses( props.item.fechaCaducidad, props.index ) }} MESES
                      </td>
                      <td class="text-xs-center">
                        {{ formatearFecha(props.item.fechaElaboracion) }}
                      </td>
                      <td class="text-xs-center">
                        {{ formatearFecha(props.item.fechaCaducidad) }}
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.fraccionesTotales }}
                      </td>
                      <td class="text-xs-center">
                        <v-text-field v-model="props.item.unidades" class="centrar-text"
                          type="number" required min="1"
                          @change="calcularPrecioTotal( props.item.unidades, props.item.p_unitario, props.index )">
                        </v-text-field>
                      </td>
                      <td class="text-xs-center">
                        <v-text-field v-model="props.item.p_unitario"
                          type="number" required class="centrar-text" min="0"
                          @change="calcularPrecioTotal( props.item.unidades, props.item.p_unitario, props.index )">
                        </v-text-field>
                      </td>
                      <td class="text-xs-center" style="font-size: 17px;">
                        {{ props.item.p_total }}
                      </td>
                    </template>
                  </v-data-table>
                </v-flex>

                <v-flex xs12 class="pt-0" style="text-align: right; padding-top: 10px !important;">
                  <span class="text-vtotal">TOTAL:</span>  
                  <span class="totalActa">
                    ${{ valorTotal }}
                  </span>
                </v-flex>

                <v-flex xs12 xs4 style="text-align: center;">
                  <v-btn type="submit" color="success" class="px-3"
                    @click="submit">
                    Guardar
                  </v-btn>
                </v-flex>

              </v-layout>
            </v-container>
          <!-- </v-form> -->
        </template>
  </v-layout>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
export default {
  name: 'AddActaEntrega',
  computed: {
    esGuardaAlmacen() {
      return (this.$store.state.usuario.rol == "609ed47286d0416b4a050c58");
    },
    computedDateFormatted () {
      return this.formatDate(this.date)
    }, 
    valorTotal(){
      let suma = 0;
      this.rows.forEach( row => { suma += parseFloat(row.p_total) })
      return suma.toFixed(2);
    }
  },
  data: vm => ({
    headers: [
      { text: 'Quitar', align: 'left', value: 'delete' },
      { text: 'Nombre Genérico', value: 'nombre_generico', align:'center' },
      { text: 'Nombre Comercial', value: 'nombre_generico' },
      { text: 'Forma Farmacéutica', value: 'forma_farmaceutica' },
      { text: 'Concentración', value: 'concentracion' },
      { text: 'Num. registro sanitario', value: 'reg_sanitario' },
      { text: 'Lote', value: 'lote' },
      { text: 'Periodo de vida util', value: 'per_vida_util' },
      { text: 'F. elaboración', value: 'f_elaboracion' },
      { text: 'F. de vencimiento', value: 'f_vencimiento' },
      { text: 'Stock Actual', value: 'stock_actual' },
      { text: 'Unidades', value: 'unidades' },
      { text: 'Precio unitario', value: 'p_unit' },
      { text: 'Precio Total', value: 'p_total' }
    ],
    menu1: false,
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    rows: [],
    formActaEntrega: {
      lugar: '',
      RPIS: '',
      nombreEntidadContratante: '',
      rucEntidadContratante: '',
      direccionContratante: '',
      nombreProveedor: '',
      rucProveedor: '',
      tipoContrato: '',
      numContrato: ''
    },
    codigo: '',
    codigoBodega: ''
  }),
  methods: {
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
    async submit(){
      if (this.formActaEntrega.lugar.length == 0) 
        return this.mostrarAlerta("Debes ingresar el lugar", "warning")      
      if (this.formActaEntrega.RPIS.length == 0) 
        return this.mostrarAlerta("Debes ingresar el subsistema RPIS", "warning")      
      if (this.formActaEntrega.nombreEntidadContratante.length == 0) 
        return this.mostrarAlerta("Debes ingresar el nombre de la entidad Contratante", "warning")      
      if (this.formActaEntrega.rucEntidadContratante.length == 0) 
        return this.mostrarAlerta("Debes ingresar el RUC entidad Contratante", "warning")      
      if (this.formActaEntrega.direccionContratante.length == 0) 
        return this.mostrarAlerta("Debes ingresar la dirección del contratante", "warning")      
      if (this.formActaEntrega.nombreProveedor.length == 0) 
        return this.mostrarAlerta("Debes ingresar el nombre del proveedor", "warning")      
      if (this.formActaEntrega.rucProveedor.length == 0) 
        return this.mostrarAlerta("Debes ingresar el RUC del proveedor", "warning")      
      if (this.formActaEntrega.tipoContrato.length == 0) 
        return this.mostrarAlerta("Debes ingresar el tipo de contrato", "warning")      
      if (this.formActaEntrega.numContrato.length == 0) 
        return this.mostrarAlerta("Debes ingresar el numero de contrato", "warning")      
      if (this.rows.length == 0) 
        return this.mostrarAlerta("Debes ingresar al menos un articulo", "warning") 
      
      let error = false;
      this.rows.forEach( (row, index) => {
        if ( row.unidades <= 0 ) {
          error = true;
          this.mostrarAlerta("No pueden haber articulos con cero unidades", "warning") 
        }
        if ( row.p_unitario <= 0 ) {
          error = true;
          this.mostrarAlerta("No puede haber precios unitarios menor o igual a cero", "warning") 
        }
      })
      
      if ( !error ) {
        this.formActaEntrega.detalles         = this.rows
        this.formActaEntrega.fecha            = this.date
        this.formActaEntrega.totalActaEntrega = this.valorTotal
        this.formActaEntrega.distribuidor     = this.$store.state.usuario.codigoDistribuidor
        this.formActaEntrega.usuario          = this.$store.state.usuario._id

        const { data } = await axios.post('/acta_entrega', this.formActaEntrega)
        this.mostrarAlerta(data.msg, "success") 

        this.$router.push({ name: 'acta_entrega' })
      }

    },
    parseDate (date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    obtenerBodega() {
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      if (codigoDistribuidor == undefined) {
      } else {
        axios
          .get("bodega/query?codigoDistribuidor=" + codigoDistribuidor, configuracion)
          .then(function (response) {
            me.codigoBodega = response.data._id;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    buscarCodigo() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;

      axios.get("inventario/buscaCodigo?data=" + this.codigo + "&codigoBodega=" + me.codigoBodega,
          configuracion).then(function (response) {
          if (response.status == 206) {
            Swal.fire("Aviso", response.data.message, "error");
          } else {
            if (response.data.length > 1) {
              Swal.fire("Aviso","Se estan mostrando mas de un resultado \n deberia buscar en pantalla.",
                "error");
            } else {
              
              const some =  me.rows.some( row => row.codigoLote == response.data.codigoLote )
              
              if (!some) {
                response.data.vidaUtil = 0;
                response.data.unidades = 0;
                response.data.p_unitario = 0;
                response.data.p_total = 0;
                
                me.getDetallesProducto( response.data.codigoProducto._id ).then( res =>{
                  response.data.demasDatos = res;
  
                  me.rows.unshift(response.data);
                });
              }else{
                Swal.fire("Aviso","Este articulo ya se encuentra agregado","error");
              }
              me.codigo = '';

            }
          }
        }).catch(function (error) {
          console.log(error);
        });
    },
    async getDetallesProducto( producto_id ){
      const { data } = await axios.get(`/acta_entrega/detalleProducto/details/${producto_id}`)
      return data.producto[0];
    },
    formatearFecha(fecha){
      let arrayFecha = fecha.split('T')[0].split('-');
      return `${ arrayFecha[2] }/${ arrayFecha[1] }/${ arrayFecha[0] }`
    },
    formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
    },
    calcularDiferenciasMeses(d1, d2){
      var months; 
      months = (d2.getFullYear() - d1.getFullYear()) * 12; 
      months -= d1.getMonth(); months += d2.getMonth(); 
      return months <= 0 ? 0 : months; 
    },
    mostrarDiferenciasMeses(txtFechaCaducidad, index){
      let arrayFechaCaducidad = txtFechaCaducidad.split('T');

      let meses = this.calcularDiferenciasMeses(new Date(this.date), new Date(arrayFechaCaducidad[0]));
      
      this.rows[index].vidaUtil = ( meses != 0) ? meses + 2 : meses;

      return meses;      
    },
    calcularPrecioTotal( unidades, p_unidad, index ){
      let precioTotal = unidades * p_unidad;
      this.rows[index].p_total = precioTotal.toFixed(2)
    },
    quitar(index){
      this.rows.splice(index, 1)
    }
  },
  watch: {
    date (val) {
      this.dateFormatted = this.formatDate(this.date)
    },
    'formActaEntrega.tipoContrato'(newValue) {
      this.formActaEntrega.tipoContrato = newValue.toUpperCase();
    },
    'formActaEntrega.direccionContratante'(newValue) {
      this.formActaEntrega.direccionContratante = newValue.toUpperCase();
    },
    'formActaEntrega.nombreProveedor'(newValue) {
      this.formActaEntrega.nombreProveedor = newValue.toUpperCase();
    },
    'formActaEntrega.nombreEntidadContratante'(newValue) {
      this.formActaEntrega.nombreEntidadContratante = newValue.toUpperCase();
    },
    'formActaEntrega.RPIS'(newValue) {
      this.formActaEntrega.RPIS = newValue.toUpperCase();
    },
    'formActaEntrega.lugar'(newValue) {
      this.formActaEntrega.lugar = newValue.toUpperCase();
    }
  },
  mounted(){
    this.obtenerBodega();
  }
};
</script>

<style>
.titleModuloTH{
  text-align: center;
  font-size: 22px;
}
.btnModuloTH{
  text-align: right;
}
.border-table{
  border-color: rgb(191 176 176 / 54%);
  border-width: 1px;
  border-style: solid;
}
.centrar-text > div > div > div input {
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  color: rgba(44, 32, 73, 0.87) !important;
}
.text-vtotal{
  font-weight: 700;
  font-size: 19px;
  color: rgb(16, 56, 28);
}
.totalActa{
  font-size: 19px;
  padding-left: 10px;
}
</style>








