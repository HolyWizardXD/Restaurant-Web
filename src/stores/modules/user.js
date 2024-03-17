import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', () => {
    const user = ref({
        id: '',
        username: ''
    })

    const setUser = (id, username) => {
        user.value.id = id
        user.value.username = username
    }

    const removeUser = () => {
        user.value.id = ''
        user.value.username = ''
    }

    return {user, setUser, removeUser}
}, {
    persist: true
})
