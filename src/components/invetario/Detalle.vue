<template>
  <div>
    <v-form ref="form">
      <v-card>
        <v-card-title class="headline grey lighten-2 justify-center" primary-title>
          DETALLES DE COMPRAS
        </v-card-title>
        <v-layout row wrap style="justify-content: space-evenly;">
          <v-flex xs12 md12>
            <v-data-table :headers="headers" :items="rows" class="elevation-1">
              <template v-slot:items="props">
                <td>{{ props.item.fecha }}</td>
                <td class="text-xs-center">{{ props.item.numComprobante }}</td>
                <!-- <td class="text-xs-center">{{ props.item.cajas }}</td>
                <td class="text-xs-center">{{ props.item.fracciones }}</td> -->
                <td class="text-xs-center">{{ props.item.totalFracciones }}</td>
                <td class="text-xs-center">{{ props.item.percha }}</td>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>

        <v-layout row wrap style="justify-content: space-evenly;">

        </v-layout>
      </v-card>
    </v-form>
  </div>
</template>

<script>
  export default {
    props: ['product'],
    name: 'DetalleInventario',
    data: vm => ({
      headers: [
        { text: 'FECHA', align: 'center', value: 'fecha', sortable: false },
        { text: '# COMPROBANTE', value: 'comprobante', align: 'center', sortable: false },
        // { text: 'CAJA', value: 'caja', align: 'center', sortable: false },
        // { text: 'FRACCIONES', value: 'fracciones', align: 'center', sortable: false },
        { text: 'UNIDADES TOTALES', value: 'total', align: 'center', sortable: false },
        { text: 'PERCHA', value: 'percha', align: 'center', sortable: false }
      ],
      loading: false,
      rows: []
    }),
    methods: {
    },
    watch: {
      product(){        
        this.product.detalle.forEach(element => {
          let cajas = element.cantidad / this.product.codigoProducto.fraccionCaja;
          let fracciones = element.cantidad % this.product.codigoProducto.fraccionCaja;
          let arrayFecha = element.createdAt.split('T')[0].split('-')

          this.rows.push({
            fecha: `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`,
            numComprobante: element.numComprobante,
            cajas: parseInt(cajas),
            fracciones: fracciones,
            totalFracciones: element.cantidad,
            percha: element.percha,
          })
        });
        this.rows = this.rows.reverse();
      }
    }
  }
</script>