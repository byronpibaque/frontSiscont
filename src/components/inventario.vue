<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Inventario</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-flex>
          <v-btn
            color="white"
            small
            flat
            style="background-color: #87d738"
            @click="(modaltipoproducto = 1), listar_tipoproductos()"
          >
            <v-icon>precision_manufacturing</v-icon>
            TIPOS PRODUCTOS
          </v-btn>
          <v-btn
            color="white"
            small
            flat
            style="background-color: #d4850c"
            @click="(modalprincipioactivo = 1), listar_principiosactivos()"
          >
            <v-icon>biotech</v-icon>
            Principio Activo
          </v-btn>
          <v-btn
            color="white"
            flat
            small
            style="background-color: #1aab60"
            @click="(modalpresentacion = 1), listar_presentacion()"
          >
            <v-icon>colorize</v-icon>
            PRESENTACIÓN
          </v-btn>
          <v-btn
            color="white"
            flat
            small
            style="background-color: #628c0e"
            @click="(modalconcentracion = 1), listar_concentracion()"
          >
            <v-icon>science</v-icon>
            CONCENTRACIÓN
          </v-btn>
          <v-btn
            color="white"
            flat
            small
            style="background-color: #d8671e"
            @click="
              (modalproducto = 1),
                ObtenerTipoProductos(),
                ObtenerConcentraciones(),
                ObtenerPrincipios(),
                ObtenerPresentaciones(),
                listar_productos()
            "
          >
            <v-icon>article</v-icon>
            PRODUCTOS
          </v-btn>
        </v-flex>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-flex>
          <v-btn
            color="white"
            small
            flat
            class="primary"
            @click="
              (modalInventario = 1),
                obetenerProveedores(),
                obtenerFabricantes(),
                obtenerProductos(),
                obtenerBodega()
            "
          >
            <v-icon>save</v-icon>
            NUEVO
          </v-btn>
        </v-flex>
      </v-toolbar>
      <!-- MODAL TIPO PRODUCTO -->
      <v-dialog v-model="modaltipoproducto" max-width="600">
        <v-card>
          <v-card-title class="headline">AGREGAR TIPO DE PRODUCTO</v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12 lg12 xl12>
                  <v-text-field
                    v-model="descripcion_tp"
                    class="text-xs-center"
                    append-icon="edit"
                    label="Descripcion"
                  ></v-text-field>

                  <v-flex xs12 sm12 md12 v-show="valida">
                    <div
                      class="red--text"
                      v-for="v in validaMensaje"
                      :key="v"
                      v-text="v"
                    ></div>
                  </v-flex>

                  <v-btn
                    color="white"
                    class="success"
                    flat
                    small
                    @click="guardar_tipoproductos(descripcion_tp)"
                  >
                    <v-icon>save</v-icon>
                    GUARDAR
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
            <v-flex xs12 sm12 md12 lg12 xl12>
              <v-text-field
                v-model="search"
                class="text-xs-center"
                append-icon="search"
                label="Buscar"
              ></v-text-field>
              <template>
                <v-data-table
                  :headers="CAB_tipoproducto"
                  :items="ARR_tipoproducto"
                  :items-per-page="5"
                  :search="search"
                  class="elevation-1"
                >
                  <template slot="items" slot-scope="props">
                    <td>
                      <v-icon
                        small
                        class="mr-2"
                        @click="eliminar_tipoproductos(props.item)"
                        >delete</v-icon
                      >
                      <v-icon
                        small
                        class="mr-2"
                        @click="actualizar_tipoproductos(props.item)"
                        >refresh</v-icon
                      >
                    </td>
                    <td class="text-xs-center blue--text">
                      {{ props.item.descripcion }}
                    </td>
                  </template>
                  <template slot="no-data">
                    <h3>No hay artículos agregados al detalle.</h3>
                  </template>
                </v-data-table>
              </template>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click="(modaltipoproducto = 0), limpiar()"
              color="orange darken-4"
              flat="flat"
              >Cerrar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- MODAL PRINCIPIOS ACTIVOS -->
      <v-dialog v-model="modalprincipioactivo" max-width="600">
        <v-card>
          <v-card-title class="headline">AGREGAR PRINCIPIOS ACTIVOS</v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12 lg12 xl12>
                  <v-text-field
                    v-model="descripcion_pa"
                    class="text-xs-center"
                    append-icon="edit"
                    label="Descripcion"
                  ></v-text-field>

                  <v-flex xs12 sm12 md12 v-show="valida">
                    <div
                      class="red--text"
                      v-for="v in validaMensaje"
                      :key="v"
                      v-text="v"
                    ></div>
                  </v-flex>

                  <v-btn
                    color="white"
                    class="success"
                    flat
                    small
                    @click="guardar_principiosactivos(descripcion_pa)"
                  >
                    <v-icon>save</v-icon>
                    GUARDAR
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
            <v-flex xs12 sm12 md12 lg12 xl12>
              <v-text-field
                v-model="search"
                class="text-xs-center"
                append-icon="search"
                label="Buscar"
              ></v-text-field>
              <template>
                <v-data-table
                  :headers="CAB_principioactivo"
                  :items="ARR_principioactivo"
                  class="elevation-1"
                  :items-per-page="5"
                  :search="search"
                >
                  <template v-slot:items="props">
                    <td>
                      <v-icon
                        small
                        class="mr-2"
                        @click="eliminar_principiosactivos(props.item)"
                        >delete</v-icon
                      >
                      <v-icon
                        small
                        class="mr-2"
                        @click="actualizar_principiosactivos(props.item)"
                        >refresh</v-icon
                      >
                    </td>
                    <td class="text-xs-center blue--text">
                      {{ props.item.descripcion }}
                    </td>
                  </template>
                  <template slot="no-data">
                    <h3>No hay artículos agregados al detalle.</h3>
                  </template>
                </v-data-table>
              </template>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click="(modalprincipioactivo = 0), limpiar()"
              color="orange darken-4"
              flat="flat"
              >Cerrar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- MODAL PRESENTACION -->
      <v-dialog v-model="modalpresentacion" max-width="600">
        <v-card>
          <v-card-title class="headline">AGREGAR PRESENTACIONES</v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12 lg12 xl12>
                  <v-text-field
                    v-model="descripcion_p"
                    class="text-xs-center"
                    append-icon="edit"
                    label="Descripcion"
                  ></v-text-field>

                  <v-flex xs12 sm12 md12 v-show="valida">
                    <div
                      class="red--text"
                      v-for="v in validaMensaje"
                      :key="v"
                      v-text="v"
                    ></div>
                  </v-flex>

                  <v-btn
                    color="white"
                    class="success"
                    flat
                    small
                    @click="guardar_presentacion(descripcion_p)"
                  >
                    <v-icon>save</v-icon>
                    GUARDAR
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
            <v-flex xs12 sm12 md12 lg12 xl12>
              <v-text-field
                v-model="search"
                class="text-xs-center"
                append-icon="search"
                label="Buscar"
              ></v-text-field>
              <template>
                <v-data-table
                  :headers="CAB_presentacion"
                  :items="ARR_presentacion"
                  class="elevation-1"
                  :items-per-page="5"
                  :search="search"
                >
                  <template v-slot:items="props">
                    <td>
                      <v-icon
                        small
                        class="mr-2"
                        @click="eliminar_presentacion(props.item)"
                        >delete</v-icon
                      >
                      <v-icon
                        small
                        class="mr-2"
                        @click="actualizar_presentacion(props.item)"
                        >refresh</v-icon
                      >
                    </td>
                    <td class="text-xs-center blue--text">
                      {{ props.item.descripcion }}
                    </td>
                  </template>
                  <template slot="no-data">
                    <h3>No hay artículos agregados al detalle.</h3>
                  </template>
                </v-data-table>
              </template>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click="(modalpresentacion = 0), limpiar()"
              color="orange darken-4"
              flat="flat"
              >Cerrar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- MODAL CONCENTRACION -->
      <v-dialog v-model="modalconcentracion" max-width="600">
        <v-card>
          <v-card-title class="headline">AGREGAR CONCENTRACIONES</v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12 lg12 xl12>
                  <v-text-field
                    v-model="descripcion_c"
                    class="text-xs-center"
                    append-icon="edit"
                    label="Descripcion"
                  ></v-text-field>

                  <v-flex xs12 sm12 md12 v-show="valida">
                    <div
                      class="red--text"
                      v-for="v in validaMensaje"
                      :key="v"
                      v-text="v"
                    ></div>
                  </v-flex>

                  <v-btn
                    color="white"
                    class="success"
                    flat
                    small
                    @click="guardar_concentracion(descripcion_c)"
                  >
                    <v-icon>save</v-icon>
                    GUARDAR
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
            <v-flex xs12 sm12 md12 lg12 xl12>
              <v-text-field
                v-model="search"
                class="text-xs-center"
                append-icon="search"
                label="Buscar"
              ></v-text-field>
              <template>
                <v-data-table
                  :headers="CAB_concentracion"
                  :items="ARR_concentracion"
                  class="elevation-1"
                  :items-per-page="5"
                  :search="search"
                >
                  <template v-slot:items="props">
                    <td>
                      <v-icon
                        small
                        class="mr-2"
                        @click="eliminar_concentracion(props.item)"
                        >delete</v-icon
                      >
                      <v-icon
                        small
                        class="mr-2"
                        @click="actualizar_concentracion(props.item)"
                        >refresh</v-icon
                      >
                    </td>
                    <td class="text-xs-center blue--text">
                      {{ props.item.descripcion }}
                    </td>
                  </template>
                  <template slot="no-data">
                    <h3>No hay artículos agregados al detalle.</h3>
                  </template>
                </v-data-table>
              </template>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click="(modalconcentracion = 0), limpiar()"
              color="orange darken-4"
              flat="flat"
              >Cerrar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- MODAL PRODUCTOS -->
      <v-dialog v-model="modalproducto" max-width="950">
        <v-card>
          <v-card-title class="headline">AGREGAR PRODUCTOS</v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs3 sm3 md3>
                  <v-autocomplete
                    v-model="codigoTipoproducto"
                    :items="tipoproductos"
                    label="Tipo producto"
                    @change="validarInsumos(codigoTipoproducto)"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs4 sm4 md4 v-if="banderainsumo">
                  <v-autocomplete
                    v-model="codigoPrincipioactivo"
                    :items="principioactivos"
                    label="Principio activo"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs3 sm3 md3>
                  <v-autocomplete
                    v-model="codigoPresentacion"
                    :items="presentaciones"
                    label="Presentacion"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs2 sm2 md2>
                  <v-autocomplete
                    v-model="codigoConcentracion"
                    :items="concentraciones"
                    label="Concentracion"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs4 sm4 md4>
                  <v-text-field
                    v-model="descripcion_p"
                    label="Descripcion"
                  ></v-text-field>
                </v-flex>
                <v-flex xs3 sm3 md3>
                  <v-text-field
                    v-model="detalleConcentracion"
                    label="Detalle concentracion"
                  ></v-text-field>
                </v-flex>
                <v-flex xs3 sm3 md3>
                  <v-text-field v-model="contenidoNeto" label="C. neto"></v-text-field>
                </v-flex>
                <v-flex xs2 sm2 md2>
                  <v-text-field v-model="fraccionCaja" label="F x Caja"></v-text-field>
                </v-flex>
              </v-layout>
              <v-flex xs12 sm12 md12 v-show="valida">
                <div
                  class="red--text"
                  v-for="v in validaMensaje"
                  :key="v"
                  v-text="v"
                ></div>
              </v-flex>
              <v-btn color="white" class="success" flat small @click="guardarProducto()">
                <v-icon>save</v-icon>
                GUARDAR
              </v-btn>
              <v-btn
                color="white"
                class="primary"
                flat
                small
                @click="actualizarProducto()"
              >
                <v-icon>save</v-icon>
                ACTUALIZAR
              </v-btn>
            </v-container>
            <v-flex xs12 sm12 md12 lg12 xl12>
              <v-text-field
                v-model="search"
                class="text-xs-center"
                append-icon="search"
                label="Buscar"
              ></v-text-field>
              <template>
                <v-data-table
                  :headers="CAB_producto"
                  :items="ARR_producto"
                  class="elevation-1"
                  :items-per-page="5"
                  :search="search"
                >
                  <template v-slot:items="props">
                    <td>
                      <v-icon small class="mr-2" @click="eliminar_producto(props.item)"
                        >delete</v-icon
                      >
                      <v-icon
                        small
                        class="mr-2"
                        @click="cargardatosActualizar(props.item)"
                        >edit</v-icon
                      >
                    </td>
                    <td class="text-xs-center blue--text">
                      {{
                        props.item.descripcion 
                      }}
                    </td>
                    <td class="text-xs-center">
                      {{ props.item.fraccionCaja }}
                    </td>
                    <td class="text-xs-center">
                      {{ props.item.contenidoNeto }}
                    </td>
                    <td class="text-xs-center">
                      {{
                        props.item.detalleConcentracion +
                        props.item.codigoConcentracion.descripcion
                      }}
                    </td>
                    <td class="text-xs-center">
                      {{ props.item.codigoPresentacion.descripcion }}
                    </td>
                    <td class="text-xs-center" v-if="props.item.codigoPrincipioactivo">
                      {{ props.item.codigoPrincipioactivo.descripcion }}
                    </td>
                    <td class="text-xs-center red--text" v-else>
                      NO REGISTRA PRINCIPIO ACTIVO
                    </td>
                    <td class="text-xs-center">
                      {{ props.item.codigoTipoproducto.descripcion }}
                    </td>
                  </template>
                  <template slot="no-data">
                    <h3>No hay artículos agregados al detalle.</h3>
                  </template>
                </v-data-table>
              </template>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click="(modalproducto = 0), limpiar()"
              color="orange darken-4"
              flat="flat"
              >Cerrar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--MODAL INVENTARIO-->
      <v-dialog v-model="modalInventario" max-width="950">
        <v-card>
          <v-card-title class="headline">
            <span v-if="banderaActualizar" class="headline">-EDITAR </span>
            <span v-else class="headline">-AGREGAR </span>
            - PRODUCTOS AL INVENTARIO</v-card-title
          >
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs2 sm2 md2>
                  <v-autocomplete
                    v-model="iva"
                    :items="ivas"
                    label="Iva?"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 sm12 md12> </v-flex>
                <v-flex xs4 sm4 md4>
                  <v-autocomplete
                    v-model="codigoProducto"
                    :items="productos"
                    label="Producto"
                    @change="obtenerProductoInfo(codigoProducto)"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs4 sm4 md4>
                  <v-autocomplete
                    v-model="codigoFabricante"
                    :items="fabricantes"
                    label="Laboratorio fabricante"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs4 sm4 md4>
                  <v-autocomplete
                    v-model="codigoProveedor"
                    :items="proveedores"
                    label="Proveedor"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 sm12 md12> </v-flex>
                <v-flex xs3 sm3 md3>
                  <v-text-field
                    disabled
                    v-model="fcajaP"
                    label="Fraccion x caja"
                  ></v-text-field>
                </v-flex>
                <v-flex xs3 sm3 md3>
                  <v-text-field
                    disabled
                    v-model="concentracionP"
                    label="Concentracion"
                  ></v-text-field>
                </v-flex>
                <v-flex xs3 sm3 md3>
                  <v-text-field
                    disabled
                    v-model="presentacionP"
                    label="Presentacion"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12> </v-flex>
                <v-flex xs3 sm3 md3>
                  <v-text-field v-model="codigoBarra" label="Código Barra"></v-text-field>
                </v-flex>
                <v-flex xs3 sm3 md3>
                  <v-text-field v-model="codigoLote"  @change="verificarLote(codigoLote)" label="Código Lote"></v-text-field>
                </v-flex>
                <v-flex xs3 sm3 md3 v-if="!banderaLote">
                  <v-text-field
                    v-model="fechaElaboracion"
                    label="Fecha elaboracion"
                  ></v-text-field>
                </v-flex>
                <v-flex xs3 sm3 md3 v-if="!banderaLote">
                  <v-text-field
                    v-model="fechaCaducidad"
                    label="Fecha caducidad"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 sm12 md12> </v-flex>
                <v-flex xs6 sm6 md6 v-if="!banderaLote">
                  <v-text-field
                    v-model="nombreComercial"
                    label="Nombre Comercial"
                  ></v-text-field>
                </v-flex>
                 <v-flex xs5 sm5 md5 v-if="!banderaLote">
                  <v-text-field
                    v-model="registroSanitario"
                    label="Registro Sanitario"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12> </v-flex>
                <v-flex xs2 sm2 md2 v-if="$store.state.usuario.codigoDistribuidor==undefined">
                  <v-text-field
                    v-model="fraccionesTotales"
                    label="Fracciones totales"
                  ></v-text-field>
                </v-flex>
                <v-flex xs2 sm2 md2 v-else>
                   <div v-if="!banderaLote" >
                  <v-text-field
                    v-model="fraccionesTotales"
                    label="Fracciones totales"
                    readonly
                    disabled
                  ></v-text-field>
                  </div>
                </v-flex>
                <v-flex xs2 sm2 md2 v-if="!banderaLote">
                  <v-text-field
                    v-model="percha"
                    disabled
                    label="Ubicacion en percha"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12> </v-flex>
                <v-flex xs2 sm2 md2>
                  <v-text-field v-model="costoNeto" label="Costo Neto" v-if="!banderaLote"></v-text-field>
                </v-flex>
                <v-flex xs2 sm2 md2>
                  <v-text-field v-model="pvm" label="PVM" v-if="!banderaLote"></v-text-field>
                </v-flex>
                <v-flex xs2 sm2 md2 v-if="!banderaLote">
                  <v-text-field
                    v-model="pvp"
                    label="PVP"
                    @change="calcularPunit()"
                  ></v-text-field>
                </v-flex>
                <v-flex xs2 sm2 md2 v-if="!banderaLote">
                  <v-text-field v-model="punit" label="P. unitario"></v-text-field>
                </v-flex>
                <v-flex xs2 sm2 md2 v-if="!banderaLote">
                  <v-text-field v-model="descuento" label="Descuento"></v-text-field>
                </v-flex>
              </v-layout>
              <v-flex xs12 sm12 md12 v-show="valida">
                <div
                  class="red--text"
                  v-for="v in validaMensaje"
                  :key="v"
                  v-text="v"
                ></div>
              </v-flex>
              <v-btn
                color="white"
                class="success"
                flat
                small
                @click="agregarAinventario()"
              >
                <v-icon>save</v-icon>
                GUARDAR
              </v-btn>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click="(modalInventario = 0), limpiarInventario()"
              color="orange darken-4"
              flat="flat"
              >Cerrar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-flex v-if="$store.state.usuario.codigoDistribuidor==undefined">
         <v-flex xs4 sm4 md4 v-if="banderainsumo">
                  <v-autocomplete
                    v-model="codigoBodega"
                    :items="bodegas"
                    label="Elegir bodega"
                    @change="listarInventario(codigoBodega)"
                  ></v-autocomplete>
                </v-flex>
      </v-flex>
      <v-flex xs12 xl12 sm12 s12 m12
        ><v-text-field
          v-model="search"
          label="Buscar"
          @keyup.enter="buscar(search)"
      
        ></v-text-field
      ></v-flex>
      <!-- TABLA DE INVENTARIO -->
      <v-data-table
        :headers="CAB_inventario"
        :items="ARR_inventario"
        class="elevation-1"
        :items-per-page="5"
      >
        <template v-slot:items="props">
          <td>
            <v-icon v-if="$store.state.usuario.codigoDistribuidor==undefined" small class="mr-2" @click="eliminar_inventario(props.item)"
              >delete</v-icon
            >
            <v-icon small class="mr-2" @click="actualizarProductoInventario(props.item)"
              >edit</v-icon
            >
          </td>
          <td class="grey lighten-1 text-xs-center black--text">
            {{ props.item.codigoProducto.descripcion }}
          </td>
          <td class="grey text-xs-center black--text">
            {{ props.item.nombreComercial }}
          </td>
          <td class="grey darken-1 text-xs-center white--text">
            {{ props.item.codigoBarra }}
          </td>
          <td class="grey darken-2 text-xs-center white--text">
            {{ props.item.codigoLote }}
          </td>
          <td  class="grey darken-2 text-xs-center white--text" v-if="props.item.registroSanitario">{{props.item.registroSanitario}}</td>
          <td v-else class="red--text">No se registra el campo REGISTRO SANITARIO</td>
          <td class="deep-orange lighten-2">
            {{ props.item.fraccionesTotales }}
          </td>
          <td class="deep-orange lighten-3">
            {{ props.item.codigoProducto.fraccionCaja }}
          </td>
          <td class="blue--text">${{ props.item.costoNeto }}</td>
          <td class="blue--text">${{ props.item.pvm }}</td>
          <td class="blue--text">${{ props.item.pvp }}</td>
          <td class="blue--text">${{ props.item.punit }}</td>
          <td class="green--text" v-if="props.item.iva">SI</td>
          <td class="orange--text" v-else>NO</td>
          <td class="deep-purple lighten-4">
            {{ props.item.percha }}
          </td>
          <td class="blue lighten-5">
            {{ props.item.numComprobante }}
          </td>
          <td class="teal lighten-1">
            {{ props.item.codigoFabricante.razonsocial }}
          </td>
          <td class="teal lighten-2">
            {{ props.item.codigoProveedor.razonsocial }}
          </td>
        </template>
        <template slot="no-data">
          <h3>No hay artículos agregados al detalle.</h3>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from "moment";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
export default {
  watch: {},
  props: {},
  data() {
    return {
      concentracionTXT:"",
      banderaLote:false,
      codigoBodega:"",
      bodegas:[],
      percha: "",
      banderainsumo: true,
      search: "",
      valida: 0,
      validaMensaje: [],
      descripcion_tp: "",
      modaltipoproducto: 0,
      ARR_tipoproducto: [],
      CAB_tipoproducto: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Descripcion", value: "descripcion", sortable: true },
      ],
      descripcion_pa: "",
      modalprincipioactivo: 0,
      ARR_principioactivo: [],
      CAB_principioactivo: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Descripcion", value: "descripcion", sortable: true },
      ],
      descripcion_p: "",
      modalpresentacion: 0,
      ARR_presentacion: [],
      CAB_presentacion: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Descripcion", value: "descripcion", sortable: true },
      ],
      descripcion_c: "",
      modalconcentracion: 0,
      ARR_concentracion: [],
      CAB_concentracion: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Descripcion", value: "descripcion", sortable: true },
      ],
      modalproducto: 0,
      ARR_producto: [],
      CAB_producto: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Descripcion", value: "descripcion", sortable: true },
        { text: "FxCaja", value: "fraccionCaja", sortable: false },
        { text: "Contenido Neto", value: "contenidoNeto", sortable: false },
        { text: "Concentracion", value: "detalleConcentracion", sortable: false },
        {
          text: "Presentacion",
          value: "codigoPresentacion.descripcion",
          sortable: false,
        },
        { text: "Principio Actvo.", value: "codigoPrincipioactivo", sortable: false },
        { text: "Tipo producto", value: "codigoTipoproducto", sortable: false },
      ],
      descripcion_p: "",
      fraccionCaja: 0,
      contenidoNeto: "",
      detalleConcentracion: "",
      codigoTipoproducto: "",
      tipoproductos: [],
      codigoPrincipioactivo: "",
      principioactivos: [],
      codigoPresentacion: "",
      presentaciones: [],
      codigoConcentracion: "",
      concentraciones: [],
      idActualizar: "",
      ARR_inventario: [],
      CAB_inventario: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Producto", value: "codigoProducto.descripcion", sortable: true },
        { text: "Nombre Comercial", value: "nombreComercial", sortable: true },
        { text: "Codigo Barra", value: "codigoBarra", sortable: false },
        { text: "Codigo Lote", value: "codigoLote", sortable: false },
           { text: "Registro Sanitario", value: "registroSanitario", sortable: false },
        { text: "Fracciones T.", value: "fraccionesTotales", sortable: false },
        {
          text: "Fracciones * C.",
          value: "codigoProducto.fraccionCaja",
          sortable: false,
        },
        {
          text: "C. NETO",
          value: "costoNeto",
          sortable: false,
        },
        {
          text: "PVM",
          value: "pvm",
          sortable: false,
        },
        {
          text: "PVP",
          value: "pvp",
          sortable: false,
        },
        {
          text: "P. Unit",
          value: "punit",
          sortable: false,
        },
         {
          text: "IVA",
          value: "iva",
          sortable: false,
        },
        { text: "Ubicacion en percha", value: "percha", sortable: false },
        { text: "# comprobante", value: "numComprobante", sortable: false },
        { text: "Lab. Fab.", value: "codigoFabricante.razonsocial", sortable: false },
        { text: "Proveedor", value: "codigoProveedor.razonsocial", sortable: false },
      ],
      modalInventario: 0,
      codigoBarra: "",
      codigoLote: "",
      nombreComercial: "",
      registroSanitario:"",
      fraccionesTotales: 0,
      fechaCaducidad: "",
      fechaElaboracion: "",
      iva: 0,
      ivas: [
        { text: "SI", value: 1 },
        { text: "NO", value: 0 },
      ],
      descuento: 0,
      pvp: 0,
      pvm: 0,
      punit: 0.0,
      costoNeto: 0.0,
      codigoBodega: "",
      codigoFabricante: "",
      codigoProveedor: "",
      codigoProducto: "",
      productos: [],
      proveedores: [],
      fabricantes: [],
      banderaActualizar: 0,
      idInventarioActualizar: "",
      fcajaP: 0,
      presentacionP: "",
      concentracionP: "",
    };
  },
  created() {
    this.listarProductosInventario();
    this.obtenerBodegas();
  },
  methods: {
    verificarLote(codigoLote){
      let me = this;
     
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;
      const resCode = this.obtenerBodega2();
      resCode
        .then((result) => {
          axios
            .get(
              "inventario/queryV?codigoLote=" + codigoLote + "&codigoBodega=" + result,
              configuracion
            )
            .then(function (response) {
              if (response.status == 200) {
                Swal.fire("Aviso", "Ya existe un producto con el codigo de lote: "+codigoLote+" registrado en la base de datos.", "error");
                me.banderaLote=true
             } else{
               me.banderaLote=false
             }
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    listarInventario(codigoB){
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
         axios
            .get("inventario/list?codigoBodega=" + codigoB, configuracion)
            .then(function (response) {
              me.ARR_inventario = response.data;
            })
            .catch(function (error) {
              console.log(error);
            });
      
    },
    obtenerBodegas(){
      if(this.$store.state.usuario.codigoDistribuidor==undefined){
        let me = this;
        let ArrayT = [];
        let header = { Token: this.$store.state.token };
        let configuracion = { headers: header };
        axios
          .get("bodega/list", configuracion)
          .then(function (response) {
            ArrayT = response.data;
            ArrayT.map(function (x) {
            me.bodegas.push({
                text:
                  x.descripcion,
                value: x._id,
              });
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    buscar(code) {
      let me = this;
      me.ARR_inventario = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoUsuario = this.$store.state.usuario._id;
      const resCode = this.obtenerBodega2();
      resCode
        .then((result) => {
          axios
            .get(
              "inventario/busca?data=" + code + "&codigoBodega=" + result,
              configuracion
            )
            .then(function (response) {
              if (response.status == 206) {
                Swal.fire("Aviso", response.data.message, "error");
              } else {
                me.ARR_inventario = response.data;
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    calcularPunit() {
      this.punit = (parseFloat(this.pvp) / parseInt(this.fcajaP)).toFixed(5);
    },

    eliminar_inventario(item) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .delete("inventario/remove?_id=" + item._id, configuracion)
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire(
              "Noticias!",
              "Se elimino correctamente el tipo de producto.",
              "success"
            );
          } else {
            Swal.fire(
              "Ops!",
              "Hubo problemas al intentar eliminar el tipo de producto",
              "err"
            );
          }
          me.listarProductosInventario();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    obtenerProductoInfo(codigoProducto) {
      let me = this;

      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("producto/query?_id=" + codigoProducto, configuracion)
        .then(function (response) {
          me.fcajaP = response.data.fraccionCaja;
          me.concentracionP =
            response.data.detalleConcentracion +
            response.data.codigoConcentracion.descripcion;
          me.presentacionP = response.data.codigoPresentacion.descripcion;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    actualizarProductoInventario(item) {
      this.obetenerProveedores();
      this.obtenerFabricantes();
      this.obtenerProductos();
      this.banderaActualizar = 1;
      this.idInventarioActualizar = item._id;
      this.codigoBarra = item.codigoBarra;
      this.codigoLote = item.codigoLote;
      this.nombreComercial = item.nombreComercial;
      this.registroSanitario=item.registroSanitario;
      this.fraccionesTotales = item.fraccionesTotales;
      this.fechaCaducidad = item.fechaCaducidad;
      this.iva = item.iva;
      this.descuento = item.descuento;
      this.pvp = item.pvp;
      this.pvm = item.pvm;
      this.punit = item.punit;
      this.percha = item.percha;
      this.costoNeto = item.costoNeto;
      this.codigoFabricante = item.codigoFabricante._id;
      this.codigoProveedor = item.codigoProveedor._id;
      this.codigoProducto = item.codigoProducto._id;
      this.obtenerProductoInfo(item.codigoProducto._id);
      this.fechaElaboracion = item.fechaElaboracion;
      this.modalInventario = 1;
    },
    async obtenerBodega2() {
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      if(codigoDistribuidor!=undefined){
         const response = await axios.get(
        "bodega/query?codigoDistribuidor=" + codigoDistribuidor,
        configuracion
      );
      return response.data._id;
      }
     
    },
    listarProductosInventario() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
       let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      if(codigoDistribuidor!=undefined){
      const resCode = this.obtenerBodega2();
      resCode
        .then((result) => {
          axios
            .get("inventario/list?codigoBodega=" + result, configuracion)
            .then(function (response) {
              me.ARR_inventario = response.data;
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
        });
        }
    },
    limpiarInventario() {
      this.idInventarioActualizar = "";
      this.codigoBarra = "";
      this.codigoLote = "";
      this.nombreComercial = "";
      this.registroSanitario="";
      this.fraccionesTotales = 0;
      this.fechaCaducidad = "";
      this.iva = 0;
      this.descuento = 0;
      this.pvp = 0;
      this.pvm = 0;
      this.punit = 0.0;
      this.costoNeto = 0.0;
      this.codigoFabricante = "";
      this.codigoProveedor = "";
      this.codigoProducto = "";
      this.fechaElaboracion = "";
      // this.codigoBodega = "";
      this.banderaLote=false
      this.banderaActualizar=0
      this.fcajaP=""
      this.concentracionP=""
      this.presentacionP=""
      this.percha=""

},
    validar_inventario() {
      this.valida = 0;
      this.validaMensaje = [];
      if (isNaN(this.pvp)) {
        this.validaMensaje.push("PVP debe ser solo numeros");
      }
      if (isNaN(this.costoNeto)) {
        this.validaMensaje.push("COSTO NETO debe ser solo numeros");
      }
      if (isNaN(this.punit)) {
        this.validaMensaje.push("PRECIO UNITARIO debe ser solo numeros");
      }
      if (isNaN(this.descuento)) {
        this.validaMensaje.push("DESCUENTO debe ser solo numeros");
      }
      if (this.pvp.length == 0) {
        this.validaMensaje.push("PVP no puede estar vacío.");
      }
      if (this.costoNeto.length == 0) {
        this.validaMensaje.push("COSTO NETO no puede estar vacío.");
      }
      if (this.pvm.length == 0) {
        this.validaMensaje.push("PVM no puede estar vacío.");
      }
      if (this.punit.length == 0) {
        this.validaMensaje.push("PRECIO UNITARIO no puede estar vacío.");
      }
      if (this.descuento.length == 0) {
        this.validaMensaje.push("DESCUENTO no puede estar vacío.");
      }
      if (this.fechaCaducidad.length == 0) {
        this.validaMensaje.push("FECHA CADUCIDAD no puede estar vacío.");
      }
      if (this.fechaElaboracion.length == 0) {
        this.validaMensaje.push("FECHA ELABORACION no puede estar vacío.");
      }
      if (this.codigoBarra.length == 0) {
        this.validaMensaje.push("Debe ingresar el codigo de barras.");
      }
      if (this.codigoLote.length == 0) {
        this.validaMensaje.push("Debe ingresar el codigo de lote.");
      }
      if (this.nombreComercial.length == 0) {
        this.validaMensaje.push("Debe ingresar el nombre comercial.");
      }
      if(this.registroSanitario.length==0){
        this.validaMensaje.push("Debe ingresar el registro sanitario del producto.");
      }
      if (this.iva.length == 0) {
        this.validaMensaje.push("Debe escoger si el producto graba o no IVA.");
      }
      if (this.codigoFabricante == "") {
        this.validaMensaje.push(
          "Debe escoger un laboratorio fabricante para el producto a agregar."
        );
      }
      if (this.codigoProveedor == "") {
        this.validaMensaje.push(
          "Debe escoger un proveedor para el producto que va a agregar."
        );
      }

      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    agregarAinventario() {
      let me = this;

      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      if (this.validar_inventario()) {
        return;
      }
      const respuesta = this.obtenerBodega2();
         let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      let codigoBB=""
              respuesta
        .then((result) => {
          if(codigoDistribuidor!=undefined){
            codigoBB=result
          }else{
            codigoBB=me.codigoBodega
          }
   
          let nombre = this.nombreComercial;
          let rsani=this.registroSanitario;
          let codi = this.codigoLote;
          if (this.banderaActualizar) {
            axios
              .put(
                "inventario/actualizar",
                {
                  _id: this.idInventarioActualizar,
                  codigoBarra: this.codigoBarra,
                  codigoLote: codi.toUpperCase(),
                  nombreComercial: nombre.toUpperCase(),
                  registroSanitario:rsani.toUpperCase(),
                  fraccionesTotales: this.fraccionesTotales,
                  fechaCaducidad: this.fechaCaducidad,
                  fechaElaboracion: this.fechaElaboracion,
                  iva: this.iva,
                  descuento: this.descuento,
                  pvp: this.pvp,
                  pvm: this.pvm,
                  punit: this.punit,
                  costoNeto: this.costoNeto,
                  codigoUsuario: this.$store.state.usuario._id,
                  codigoBodega: codigoBB,
                  codigoFabricante: this.codigoFabricante,
                  codigoProveedor: this.codigoProveedor,
                  codigoProducto: this.codigoProducto,
                },
                configuracion
              )
              .then(function (response) {
                if (response.status == 200) {
                  Swal.fire(
                    "Noticias!",
                    "Se actualizó correctamente el producto.",
                    "success"
                  );
                   me.listarInventario(codigoBB)
                  me.limpiarInventario();
                  me.modalInventario = 0;
                 
                } else {
                  Swal.fire(
                    "Ops!",
                    "Hubo problemas al intentar actualizar el producto",
                    "err"
                  );
                }

                me.listarProductosInventario();
              })
              .catch(function (error) {
                console.log(error);
              });
          } else {
            axios
              .post(
                "inventario/add",
                {
                  codigoBarra: this.codigoBarra,
                  codigoLote: codi.toUpperCase(),
                  nombreComercial: nombre.toUpperCase(),
                  registroSanitario:rsani.toUpperCase(),
                  fraccionesTotales: this.fraccionesTotales,
                  fechaCaducidad: this.fechaCaducidad,
                  fechaElaboracion: this.fechaElaboracion,
                  iva: this.iva,
                  descuento: this.descuento,
                  pvp: this.pvp,
                  pvm: this.pvm,
                  punit: this.punit,
                  costoNeto: this.costoNeto,
                  codigoUsuario: this.$store.state.usuario._id,
                  codigoBodega: codigoBB,
                  codigoFabricante: this.codigoFabricante,
                  codigoProveedor: this.codigoProveedor,
                  codigoProducto: this.codigoProducto,
                },
                configuracion
              )
              .then(function (response) {
                if (response.status == 200) {
                  Swal.fire(
                    "Noticias!",
                    "Se agregao correctamente al inventario.",
                    "success"
                  );
                  me.limpiarInventario();
                  me.modalInventario = 0;
                } else {
                  Swal.fire(
                    "Ops!",
                    "Hubo problemas al intentar guardar el producto",
                    "err"
                  );
                }
                me.listarProductosInventario();
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    obtenerBodega() {
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoDistribuidor = this.$store.state.usuario.codigoDistribuidor;
      axios
        .get("bodega/query?codigoDistribuidor=" + codigoDistribuidor, configuracion)
        .then(function (response) {
          me.codigoBodega = response.data._id;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    obtenerProductos() {
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("producto/list", configuracion)
        .then(function (response) {
          ArrayT = response.data;
          ArrayT.map(function (x) {
          me.productos.push({
              text:
                x.descripcion +
              " C*:"+x.fraccionCaja,
              value: x._id,
            });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    obetenerProveedores() {
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("proveedor/list", configuracion)
        .then(function (response) {
          ArrayT = response.data;
          ArrayT.map(function (x) {
            me.proveedores.push({ text: x.razonsocial, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    obtenerFabricantes() {
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("fabricante/list", configuracion)
        .then(function (response) {
          ArrayT = response.data;
          ArrayT.map(function (x) {
            me.fabricantes.push({ text: x.razonsocial, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    eliminar_producto(item) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .delete("producto/remove?_id=" + item._id, configuracion)
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire(
              "Noticias!",
              "Se elimino correctamente el tipo de producto.",
              "success"
            );
          } else {
            Swal.fire(
              "Ops!",
              "Hubo problemas al intentar eliminar el tipo de producto",
              "err"
            );
          }
          me.listar_productos();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    cargardatosActualizar(item) {
      this.limpiarproductos();
      this.descripcion_p = item.descripcion;
      this.fraccionCaja = item.fraccionCaja;
      this.contenidoNeto = item.contenidoNeto;
      this.detalleConcentracion = item.detalleConcentracion;
      this.codigoTipoproducto = item.codigoTipoproducto._id;

      this.codigoConcentracion = item.codigoConcentracion._id;
      this.codigoPresentacion = item.codigoPresentacion._id;
      this.idActualizar = item._id;
      if (item.codigoTipoproducto.descripcion == "MEDICINA") {
        this.codigoPrincipioactivo = item.codigoPrincipioactivo._id;
      } else {
        this.banderainsumo = false;
      }
    },
    actualizarProducto() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoUsuario = this.$store.state.usuario._id;
       const dataC = this.ConsultaConcentracion(me.codigoConcentracion)
      let datass = ""
      dataC.then((result) => {
        datass=result
      this.ConsultaConcentracion(me.codigoConcentracion)
      if (this.validar_guardar()) {
        return;
      }
      let codigoPrincipioAc;
      if (this.banderainsumo) {
        codigoPrincipioAc = this.codigoPrincipioactivo;
      } else {
        codigoPrincipioAc = undefined;
      }
      let descripcion = this.descripcion_p;
      axios
        .put("producto/actualizar", {
          _id: this.idActualizar,
           descripcion: descripcion.toUpperCase()+' '+this.detalleConcentracion+datass,
          fraccionCaja: this.fraccionCaja,
          contenidoNeto: this.contenidoNeto,
          detalleConcentracion: this.detalleConcentracion,
          codigoTipoproducto: this.codigoTipoproducto,
          codigoPrincipioactivo: codigoPrincipioAc,
          codigoPresentacion: this.codigoPresentacion,
          codigoConcentracion: this.codigoConcentracion,
          codigoUsuario: this.$store.state.usuario._id,
        })
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire(
              "Noticias!",
              "Se actualizo correctamente el tipo de producto.",
              "success"
            );
          } else {
            Swal.fire("Ops!", "Hubo problemas al intentar actualizar el ingreso", "err");
          }
          me.listar_productos();
          me.limpiarproductos();
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    },
    listar_productos() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("producto/list", configuracion)
        .then(function (response) {
          me.ARR_producto = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    limpiarproductos() {
      this.descripcion_p = "";
      this.fraccionCaja = 0;
      this.contenidoNeto = "";
      this.detalleConcentracion = "";
      this.codigoTipoproducto = "";
      this.codigoPrincipioactivo = "";
      this.codigoPresentacion = "";
      this.codigoConcentracion = "";
      this.banderainsumo = true;
    },

      async ConsultaConcentracion(codigo) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let code = this.$store.state.usuario.codigoDistribuidor;

      const response = await axios.get(
        "concentracion/query?_id=" + codigo,
        configuracion
      );
      return response.data.descripcion;
    },
    guardarProducto() {
      let me = this;
      const dataC = this.ConsultaConcentracion(me.codigoConcentracion)
      let datass = ""
      dataC.then((result) => {
        datass=result
     

      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      if (this.validar_guardar()) {
        return;
      }
      let codigoPrincipioAc;
      if (this.banderainsumo) {
        codigoPrincipioAc = this.codigoPrincipioactivo;
      } else {
        codigoPrincipioAc = undefined;
      }

      let descripcion = this.descripcion_p;
      axios
        .post(
          "producto/add",
          {
            descripcion: descripcion.toUpperCase()+' '+this.detalleConcentracion+datass,
            fraccionCaja: this.fraccionCaja,
            contenidoNeto: this.contenidoNeto,
            detalleConcentracion: this.detalleConcentracion,
            codigoTipoproducto: this.codigoTipoproducto,
            codigoPrincipioactivo: codigoPrincipioAc,
            codigoPresentacion: this.codigoPresentacion,
            codigoConcentracion: this.codigoConcentracion,
            codigoUsuario: this.$store.state.usuario._id,
          },
          configuracion
        )
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire("Noticias!", "Se guardo correctamente el  producto.", "success");
            me.limpiarproductos();
          } else {
            Swal.fire("Ops!", "Hubo problemas al intentar guardar el producto", "err");
          }
          me.listar_productos();
        })
        .catch(function (error) {
          console.log(error);
        });
         })
    },
    validar_guardar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (isNaN(this.fraccionCaja)) {
        this.validaMensaje.push("Fraccion x caja debe ser solo numero.");
      }
      if (this.descripcion_p.length == 0) {
        this.validaMensaje.push("Debe ingresar la descripcion.");
      }
      if (this.contenidoNeto.length == 0) {
        this.validaMensaje.push("Debe ingresar el contenido neto.");
      }
      if (this.detalleConcentracion.length == 0) {
        this.validaMensaje.push(
          "Debe ingresar el detalle de la concentracion. Ej 500,30."
        );
      }
      if (this.codigoTipoproducto == "") {
        this.validaMensaje.push("Debe escoger un tipo de producto.");
      }
      if (this.codigoPresentacion == "") {
        this.validaMensaje.push("Debe escoger un tipo de presentacion.");
      }
      if (this.codigoConcentracion == "") {
        this.validaMensaje.push("Debe escoger una concentracion.");
      }

      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    validarInsumos(item) {
      let me = this;
      this.tipoproductos.forEach((element) => {
        if (element.text == "MEDICINA") {
          if (element.value == item) {
            me.banderainsumo = true;
          } else {
            me.banderainsumo = false;
          }
        }
      });
    },
    ObtenerTipoProductos() {
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("tipoproducto/list", configuracion)
        .then(function (response) {
          ArrayT = response.data;
          ArrayT.map(function (x) {
            me.tipoproductos.push({ text: x.descripcion, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    ObtenerPrincipios() {
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("principioactivo/list", configuracion)
        .then(function (response) {
          ArrayT = response.data;
          ArrayT.map(function (x) {
            me.principioactivos.push({ text: x.descripcion, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    ObtenerConcentraciones() {
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("concentracion/list", configuracion)
        .then(function (response) {
          ArrayT = response.data;
          ArrayT.map(function (x) {
            me.concentraciones.push({ text: x.descripcion, value: x._id });
           
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    ObtenerPresentaciones() {
      let me = this;
      let ArrayT = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("presentacion/list", configuracion)
        .then(function (response) {
          ArrayT = response.data;
          ArrayT.map(function (x) {
            me.presentaciones.push({ text: x.descripcion, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    actualizar_concentracion(item) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoUsuario = this.$store.state.usuario._id;
      axios
        .put("concentracion/actualizar", {
          _id: item._id,
          descripcion: me.descripcion_c(),
          codigoUsuario: codigoUsuario,
        })
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire(
              "Noticias!",
              "Se actualizo correctamente el tipo de producto.",
              "success"
            );
          } else {
            Swal.fire("Ops!", "Hubo problemas al intentar actualizar el ingreso", "err");
          }
          me.listar_concentracion();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    eliminar_concentracion(item) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .delete("concentracion/remove?_id=" + item._id, configuracion)
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire(
              "Noticias!",
              "Se elimino correctamente el tipo de producto.",
              "success"
            );
          } else {
            Swal.fire(
              "Ops!",
              "Hubo problemas al intentar eliminar el tipo de producto",
              "err"
            );
          }
          me.listar_concentracion();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    guardar_concentracion(descripcion) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      if (this.validarc()) {
        return;
      }

      axios
        .post(
          "concentracion/add",
          {
            descripcion: descripcion.toUpperCase(),
            codigoUsuario: this.$store.state.usuario._id,
          },
          configuracion
        )
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire(
              "Noticias!",
              "Se guardo correctamente el tipo de producto.",
              "success"
            );
          } else {
            Swal.fire(
              "Ops!",
              "Hubo problemas al intentar guardar el tipo de producto",
              "err"
            );
          }
          me.listar_concentracion();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listar_concentracion() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("concentracion/list", configuracion)
        .then(function (response) {
          me.ARR_concentracion = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    validarc() {
      this.valida = 0;
      this.validaMensaje = [];

      if (this.descripcion_c.length == 0) {
        this.validaMensaje.push("Debe ingresar la descripcion.");
      }

      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    actualizar_presentacion(item) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoUsuario = this.$store.state.usuario._id;
      axios
        .put("presentacion/actualizar", {
          _id: item._id,
          descripcion: me.descripcion_p,
          codigoUsuario: codigoUsuario,
        })
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire(
              "Noticias!",
              "Se actualizo correctamente el tipo de producto.",
              "success"
            );
          } else {
            Swal.fire("Ops!", "Hubo problemas al intentar actualizar el ingreso", "err");
          }
          me.listar_presentacion();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    eliminar_presentacion(item) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .delete("presentacion/remove?_id=" + item._id, configuracion)
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire(
              "Noticias!",
              "Se elimino correctamente el tipo de producto.",
              "success"
            );
          } else {
            Swal.fire(
              "Ops!",
              "Hubo problemas al intentar eliminar el tipo de producto",
              "err"
            );
          }
          me.listar_presentacion();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    guardar_presentacion(descripcion) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      if (this.validarp()) {
        return;
      }

      axios
        .post(
          "presentacion/add",
          {
            descripcion: descripcion.toUpperCase(),
            codigoUsuario: this.$store.state.usuario._id,
          },
          configuracion
        )
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire(
              "Noticias!",
              "Se guardo correctamente el tipo de producto.",
              "success"
            );
          } else {
            Swal.fire(
              "Ops!",
              "Hubo problemas al intentar guardar el tipo de producto",
              "err"
            );
          }
          me.listar_presentacion();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listar_presentacion() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("presentacion/list", configuracion)
        .then(function (response) {
          me.ARR_presentacion = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    validarp() {
      this.valida = 0;
      this.validaMensaje = [];

      if (this.descripcion_p.length == 0) {
        this.validaMensaje.push("Debe ingresar la descripcion.");
      }

      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    actualizar_principiosactivos(item) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoUsuario = this.$store.state.usuario._id;
      axios
        .put("principioactivo/actualizar", {
          _id: item._id,
          descripcion: me.descripcion_pa,
          codigoUsuario: codigoUsuario,
        })
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire(
              "Noticias!",
              "Se actualizo correctamente el tipo de producto.",
              "success"
            );
          } else {
            Swal.fire("Ops!", "Hubo problemas al intentar actualizar el ingreso", "err");
          }
          me.listar_principiosactivos();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    eliminar_principiosactivos(item) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .delete("principioactivo/remove?_id=" + item._id, configuracion)
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire(
              "Noticias!",
              "Se elimino correctamente el tipo de producto.",
              "success"
            );
          } else {
            Swal.fire(
              "Ops!",
              "Hubo problemas al intentar eliminar el tipo de producto",
              "err"
            );
          }
          me.listar_principiosactivos();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    guardar_principiosactivos(descripcion) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      if (this.validarpa()) {
        return;
      }

      axios
        .post(
          "principioactivo/add",
          {
            descripcion: descripcion.toUpperCase(),
            codigoUsuario: this.$store.state.usuario._id,
          },
          configuracion
        )
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire(
              "Noticias!",
              "Se guardo correctamente el tipo de producto.",
              "success"
            );
          } else {
            Swal.fire(
              "Ops!",
              "Hubo problemas al intentar guardar el tipo de producto",
              "err"
            );
          }
          me.listar_principiosactivos();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listar_principiosactivos() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("principioactivo/list", configuracion)
        .then(function (response) {
          me.ARR_principioactivo = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    validarpa() {
      this.valida = 0;
      this.validaMensaje = [];

      if (this.descripcion_pa.length == 0) {
        this.validaMensaje.push("Debe ingresar la descripcion.");
      }

      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    actualizar_tipoproductos(item) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let codigoUsuario = this.$store.state.usuario._id;
      axios
        .put("tipoproducto/actualizar", {
          _id: item._id,
          descripcion: me.descripcion_tp,
          codigoUsuario: codigoUsuario,
        })
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire(
              "Noticias!",
              "Se actualizo correctamente el tipo de producto.",
              "success"
            );
          } else {
            Swal.fire("Ops!", "Hubo problemas al intentar actualizar el ingreso", "err");
          }
          me.listar_tipoproductos();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    eliminar_tipoproductos(item) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .delete("tipoproducto/remove?_id=" + item._id, configuracion)
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire(
              "Noticias!",
              "Se elimino correctamente el tipo de producto.",
              "success"
            );
          } else {
            Swal.fire(
              "Ops!",
              "Hubo problemas al intentar eliminar el tipo de producto",
              "err"
            );
          }
          me.listar_tipoproductos();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    guardar_tipoproductos(descripcion) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      if (this.validar()) {
        return;
      }

      axios
        .post(
          "tipoproducto/add",
          {
            descripcion: descripcion.toUpperCase(),
            codigoUsuario: this.$store.state.usuario._id,
          },
          configuracion
        )
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire(
              "Noticias!",
              "Se guardo correctamente el tipo de producto.",
              "success"
            );
          } else {
            Swal.fire(
              "Ops!",
              "Hubo problemas al intentar guardar el tipo de producto",
              "err"
            );
          }
          me.listar_tipoproductos();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listar_tipoproductos() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("tipoproducto/list", configuracion)
        .then(function (response) {
          me.ARR_tipoproducto = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];

      if (this.descripcion_tp.length == 0) {
        this.validaMensaje.push("Debe ingresar la descripcion.");
      }

      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    limpiar() {
      this.descripcion_tp = "";
      this.ARR_tipoproducto = [];
      this.descripcion_pa = "";
      this.ARR_principioactivo = [];
      this.descripcion_p = "";
      this.ARR_presentacion = [];
      this.descripcion_c = "";
      this.ARR_concentracion = [];
      this.search = "";
    },
  },
};
</script>

<style></style>
