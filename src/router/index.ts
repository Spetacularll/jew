import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue')
    },
    {
      path: '/returnBatch',
      component: () => import('@/views/ReturnPage.vue')
    },
    {
      path: '/Inbound',
      name: 'Inbound',
      component: () => import('@/views/CInbound.vue')
    },
    {
      path: '/outbound',
      component: () => import('@/views/BOutbound.vue')
    },
    {
      path: '/outbatch',
      component: () => import('@/views/Batch.vue')
    },
    {
      path: '/printer',
      component: () => import('@/views/print.vue')
    },
    {
      path: '/product-details/:barcode',
      component: () => import('@/views/productdetail.vue'),
      props: route => ({ barcode: route.query.barcode })
    },
    {
      path: '/sellcount',
      component: () => import('@/views/sellcount.vue')
    },
    {
      path: '/supplier',
      component: () => import('@/views/Supplier.vue')
    },
    {
      path: '/printing',
      component: () => import('@/views/UPrinter.vue')
    },
    {
      path: '/sort',
      component: () => import('@/views/sort.vue')
    },
    {
      path: '/outrecord',
      component: () => import('@/views/OutRecord.vue')
    },
    {
      path: '/reinbound',
      component: () => import('@/views/Reinbound.vue')
    },
    {
      path: '/editproduct',
      component: () => import('@/views/Editing.vue'),
      props: route => ({ barcode: route.query.barcode })
    },
    {
      path: '/search/:barcode',
      component: () => import('@/views/Search.vue'),
      props: true
    },
    {
      path: '/searchp',
      component: () => import('@/views/Search.vue')
    },
    {
      path: '/label',
      component: () => import('@/views/label.vue')
    },
    {
      path: '/stock',
      component: () => import('@/views/Stock.vue')
    },
    {
      path: '/precord',
      component: () => import('@/views/ProductRecord.vue')
    },
    {
      path: '/login',
      component: () => import('@/views/Login.vue')
    }
  ]
})

export default router
