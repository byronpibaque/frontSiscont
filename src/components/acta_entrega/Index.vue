<template>
  <v-layout row wrap>
      <v-flex md6 class="titleModuloTH">
        <label style="position: relative;left: 175px;">
          Listado de Actas de Entrega
        </label>
      </v-flex>
      <v-flex md6 class="btnModuloTH">
        <v-btn v-if="esGuardaAlmacen" color="success" 
          @click="$router.push({ name: 'add_acta_entrega' })">
          Agregar
        </v-btn>
      </v-flex>
      <v-flex md12 class="btnModuloTH" style="position: relative; bottom: 110px">
        <v-data-table :headers="headers" :items="rows"
          class="elevation-1">
          <template v-slot:items="props">
            <td class="text-xs-center">
              <v-icon small class="mr-3" 
              @click="$router.push({ name: 'detalle_acta_entrega', params: {acta_id: props.item._id} })">
                tab
              </v-icon>
              <v-icon small 
                v-if="props.item.estado"
                @click="inactivarActaEntrega(props.item._id, props.item.detalles)">
                delete
              </v-icon>
            </td>
            <td class="text-xs-left">{{ props.item.nombreEntidadContratante }}</td>
            <td class="text-xs-left">{{ props.item.rucEntidadContratante }}</td>
            <td class="text-xs-left">{{ formatearFecha(props.item.fecha) }}</td>
            <td class="text-xs-left">{{ props.item.lugar }}</td>
            <td class="text-xs-left">{{ props.item.RPIS }}</td>
            <td class="text-xs-left">{{ props.item.numContrato }}</td>
            <td class="text-xs-left" 
              :style="props.item.estado == 1 ? 'color: green' : 'color: red'">
              {{ props.item.estado == 1 ? 'Aceptado' : 'Cancelado' }}
            </td>
          </template>
        </v-data-table>
      </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
export default {
  name: 'IndexActaEntrega',
  computed: {
    esGuardaAlmacen() {
      return (this.$store.state.usuario.rol == "609ed47286d0416b4a050c58");
    }
  },
  data() {
    return {
      headers: [
          { text: 'Acciones', value: 'acciones' },
          { text: 'Contratante', value: 'contratante' },
          { text: 'RUC contratante', value: 'fat' },
          { text: 'Fecha', value: 'fecha' },
          { text: 'Lugar', value: 'lugar' },
          { text: 'Subsistema RPIS', value: 'rpis' },
          { text: 'N° Contrato', value: 'n_contrato' },
          { text: 'Estado', value: 'estado' }
      ],
      rows: [],
    };
  },
  methods: {
    formatearFecha( fecha ){
      const arrayDate = fecha.split('T')[0].split('-');
      return `${ arrayDate[2] }/${ arrayDate[1] }/${ arrayDate[0] }`;
    },
    async getActasEntregas(){
      const { data } = await axios.get('/acta_entrega')
      this.rows = data.list;
    },
    async inactivarActaEntrega( acta_id, detalles ){
      Swal.fire({
        title: 'Estas seguro de Cancelar esta Acta de Entrega?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Cancelar',
        denyButtonText: `Cancelar`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const { data } = await axios.post(`/acta_entrega/delete/${ acta_id }`, { detalles })
            this.mostrarAlerta(data.msg, "success") 
          } catch (error) {
            this.mostrarAlerta("Ocurrio un error, contactar con el Admin", "warning") 
          }
        }
      })
    }
  },
  mounted(){
    this.getActasEntregas()
  }
};
</script>

<style>
.titleModuloTH{
  text-align: left;
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








