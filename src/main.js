import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from './stores/index'

// 导入element-plus全部组件
import ElementPlus from 'element-plus'
// 导入element-plus全部组件样式
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.use(ElementPlus)
app.mount('#app')