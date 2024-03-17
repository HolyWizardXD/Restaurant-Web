import { createRouter, createWebHistory } from 'vue-router'
import OrderView from '@/views/Order.vue'
import HomeView from '@/views/Home.vue'
import LoginView from '@/views/Login.vue'
import { useTokenStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/order',
      name: 'order',
      component: OrderView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
})

// 登陆访问拦截
router.beforeEach((to) => {
  const tokenStore = useTokenStore()
  if(!tokenStore.token && to.path !== '/login') return '/login'
  return true
})

export default router
