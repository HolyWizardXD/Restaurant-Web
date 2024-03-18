import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from './stores/index'

import 'dayjs/locale/zh-cn';

// 导入element-plus全部组件
import ElementPlus from 'element-plus'
// 导入element-plus全部组件样式
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.use(ElementPlus, {
    locale: zhCn,
})
app.mount('#app')