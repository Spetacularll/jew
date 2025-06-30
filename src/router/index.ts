import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Inbound from '@/views/Inbound.vue'
import Login from '@/views/Login.vue'
import Outbound from '@/views/Outbound.vue'
import OutRecord from '@/views/OutRecord.vue'
import Editing from '@/views/Editing.vue'
import Stock from '@/views/Stock.vue'
import ProductRecord from '@/views/ProductRecord.vue'
import Supplier from '@/views/Supplier.vue'
import NInbound from '../views/NInbound.vue'
import CInbound from '../views/CInbound.vue'
import Printer from '@/components/printer.vue'
import Aprinter from '@/views/Aprinter.vue'
import UPrinter from '@/views/UPrinter.vue'
import BOutbound from '@/views/BOutbound.vue'
import Sort from '@/views/sort.vue'
import Reinbound from '@/views/Reinbound.vue'
import print from '@/views/print.vue'
import Batch from '@/views/Batch.vue'
import ReturnPage from '@/views/ReturnPage.vue'
import Productdetail from '@/views/productdetail.vue'
import Sellcount from '@/views/sellcount.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/returnBatch',
      component: ReturnPage
    },
    {
      path: '/Inbound',
      name: 'Inbound',
      component: CInbound
    },
    {
      path:'/outbound',
      component: BOutbound
    },{
      path:'/outbatch',
      component:Batch
    },
    {
      path: '/printer',
      component: print
    },
    {
      path: '/product-details/:barcode',
      component: Productdetail,
      props: (route) => ({ barcode: route.query.barcode }) // 将 barcode 作为 prop 传入
    },
    {
      path: '/sellcount',
      component: Sellcount
    },
    {
      path: '/supplier',
      component: Supplier

    },
    {
      path: '/printing',
      component: UPrinter
    },
    {
      path: '/sort',
      component: Sort
    },
    {
      path:'/outrecord',
      component:OutRecord
    },
    {
      path: '/reinbound',
      component: Reinbound
    },
    {
      path: '/editproduct',
      component: Editing,
      props: (route) => ({ barcode: route.query.barcode }) // 将 barcode 作为 prop 传入
    },
    {
      path: '/search/:barcode',
      component: () => import('../views/Search.vue'),props:true
    },
    {
      path:'/searchp',
      component: () => import('../views/Search.vue')
    },
    {
      path: '/label',
      component: () => import('../views/label.vue')
    },
    {
      path: '/stock',
      component: Stock
    },
    {
      path:'/precord',
      component:ProductRecord
    },
    {
      path: '/login',
      component :Login
    }
  ]
})

export default router
