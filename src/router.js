import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from './views/Home.vue'
import  Login from './components/Login.vue'

import Proveedores from './components/proveedores.vue'

import Inventario from './components/inventario.vue'

import Facturas from './components/facturacion.vue'
import crearBodegas from './components/crearbodegas.vue'
import crearDistribuidores from './components/creardistribuidores.vue'
import crearFabribantes from './components/crearfabricantes.vue'
import usuarios from './components/usuarios.vue'
import clientes from './components/clientes.vue'
import compras from './components/compras.vue'
import cuarentena from './components/cuarentena.vue'
import asignarperchas from './components/asignacionperchas.vue'
import retenciones from './components/retenciones.vue'
import secuenciales from './components/secuenciales.vue'
import perchas from './components/perchas.vue'
import consultaretenciones from './components/consultaretenciones.vue'
import consultacuentasporpagar from './components/consultacuentasporpagar.vue'
import egresos from './components/egresos.vue'
import SetCredenciales from './components/SetCredenciales.vue'
import Temperatura_Humedad from './components/temp_humedad/Index.vue'
import Vencimiento_Producto from './components/vencimiento_producto/Index.vue'
import ActaEntrega from './components/acta_entrega/Index.vue'
import AddActaEntrega from './components/acta_entrega/Add.vue'
import DetalleActaEntrega from './components/acta_entrega/Detalle.vue'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/egresos',
      name: 'egresos',
      component: egresos,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/temp_humedad',
      name: 'temp_humedad',
      component: Temperatura_Humedad,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
     path: '/consultacuentasporpagar',
     name: 'consultacuentasporpagar',
     component: consultacuentasporpagar,
     meta:{
       contabilidad:true,
       administrador:true,
       guardaalmacen:true,
       compraspublica:true,
       supervisor:true,
       gerente:true,
       facturacion:true,
       quimico:true
     }
   },
     {
      path: '/consultaretenciones',
      name: 'consultaretenciones',
      component: consultaretenciones,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/perchas',
      name: 'perchas',
      component: perchas,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/asignarperchas',
      name: 'asignarperchas',
      component: asignarperchas,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/secuenciales',
      name: 'secuenciales',
      component: secuenciales,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/retenciones',
      name: 'retenciones',
      component: retenciones,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/cuarentena',
      name: 'cuarentena',
      component: cuarentena,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/compras',
      name: 'compras',
      component: compras,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: clientes,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: usuarios,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/crearfabricantes',
      name: 'crearfabricantes',
      component: crearFabribantes,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/creardistribuidores',
      name: 'creardistribuidores',
      component: crearDistribuidores,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/crearbodegas',
      name: 'crearbodegas',
      component: crearBodegas,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/inventario',
      name: 'inventario',
      component: Inventario,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/proveedores',
      name: 'proveedores',
      component: Proveedores,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/facturas',
      name: 'facturas',
      component: Facturas,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta:{
        libre:true
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/set-credenciales',
      name: 'set-credenciales',
      component: SetCredenciales,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/vencimiento_productos',
      name: 'vencimiento_productos',
      component: Vencimiento_Producto,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/acta_entrega',
      name: 'acta_entrega',
      component: ActaEntrega,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/add_acta_entrega',
      name: 'add_acta_entrega',
      component: AddActaEntrega,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
    {
      path: '/detalle_acta_entrega/:acta_id',
      name: 'detalle_acta_entrega',
      component: DetalleActaEntrega,
      meta:{
        contabilidad:true,
        administrador:true,
        guardaalmacen:true,
        compraspublica:true,
        supervisor:true,
        gerente:true,
        facturacion:true,
        quimico:true
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)) {
    next()
  }else if (store.state.usuario && store.state.usuario.rol=='609ed2679b1f0569cef1bf4d') {
    if (to.matched.some(record => record.meta.administrador)) {
      next()
    }
  }
  else if (store.state.usuario && store.state.usuario.rol=='609ed45086d0416b4a050c57') {
    if (to.matched.some(record => record.meta.gerente)) {
      next()
    }
  }
  else if (store.state.usuario && store.state.usuario.rol=='609ed47286d0416b4a050c58') {
    if (to.matched.some(record => record.meta.guardaalmacen)) {
      next()
    }
  }
  else if (store.state.usuario && store.state.usuario.rol=='609ed47b86d0416b4a050c59') {
    if (to.matched.some(record => record.meta.contabilidad)) {
      next()
    }
  }
  else if (store.state.usuario && store.state.usuario.rol=='609ed48086d0416b4a050c5a') {
    if (to.matched.some(record => record.meta.compraspublica)) {
      next()
    }
  }
  else if (store.state.usuario && store.state.usuario.rol=='609ed48786d0416b4a050c5b') {
    if (to.matched.some(record => record.meta.supervisor)) {
      next()
    }
  }
  else if (store.state.usuario && store.state.usuario.rol=='60c0e96c13a9bc08b085f378') {
    if (to.matched.some(record => record.meta.facturacion)) {
      next()
    }
  }
  else if (store.state.usuario && store.state.usuario.rol=='6425b4e63015a625b227f4b7') {
    if (to.matched.some(record => record.meta.facturacion)) {
      next()
    }
  }
  else{
    router.push({ path: 'login' }).catch(()=>{});
  }
})

export default router
