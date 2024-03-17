import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '@/views/Home.vue'
import LoginView from '@/views/Login.vue'
import {useTokenStore} from '@/stores'
import CustomerInfoVue from '@/views/Customer/CustomerInfo.vue'
import DishManageVue from '@/views/Dish/DishManage.vue'
import EmployeeInfoVue from '@/views/Employee/EmployeeInfo.vue'
import InventoryManageVue from '@/views/Inventory/InventoryManage.vue'
import HistoryOrderVue from '@/views/Order/HistoryOrder.vue'
import UpdatePasswordVue from '@/views/User/UpdatePassword.vue'
import UserInfoVue from '@/views/User/UserInfo.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            children: [
                {path: '/Customer/CustomerInfo', component: CustomerInfoVue},
                {path: '/Dish/DishManage', component: DishManageVue},
                {path: '/Employee/EmployeeInfo', component: EmployeeInfoVue},
                {path: '/Inventory/InventoryManage', component: InventoryManageVue},
                {path: '/Order/HistoryOrder', component: HistoryOrderVue},
                {path: '/User/UpdatePassword', component: UpdatePasswordVue},
                {path: '/User/UserInfo', component: UserInfoVue}
            ]
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
    if (!tokenStore.token && to.path !== '/login') return '/login'
    return true
})

export default router
