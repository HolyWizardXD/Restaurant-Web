import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', () => {
    // 定义用户
    const user = ref({
        id: '',
        username: ''
    })
    // 设置用户
    const setUser = (id, username) => {
        user.value.id = id
        user.value.username = username
    }
    // 删除用户
    const removeUser = () => {
        user.value.id = ''
        user.value.username = ''
    }

    return {user, setUser, removeUser}
}, {
    persist: true
})
