import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
// 持久化
pinia.use(persist)

export default pinia
// 统一暴露store
export * from './modules/token'
export * from './modules/user.js'