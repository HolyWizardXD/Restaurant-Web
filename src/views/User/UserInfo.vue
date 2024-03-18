<script setup>

import {ElMessage, ElMessageBox} from "element-plus";

import {useUserStore,useTokenStore} from "@/stores/index.js";
import router from "@/router/index.js";
import {userLogoffService, getUserService} from "@/api/user.js";
import {ref} from "vue";

const userStore = useUserStore()
const tokenStore = useTokenStore()

const status = ref(0)
const phone = ref('')
const getUser = async () => {
  let result = await getUserService()
  status.value = result.data.status
  phone.value = result.data.phone
}

const logoff = () => {
  ElMessageBox.confirm(
      '以下操作进行后不可更改,是否确认注销账户?',
      'Warning',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        await userLogoffService(userStore.user.id)
        router.push('/login')
        userStore.removeUser()
        tokenStore.removeToken()
        ElMessage({
          type: 'warning',
          message: '账户已注销',
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消',
        })
      })
}

getUser()

</script>

<template>
  <div style="margin-top: 1%">
    <el-descriptions title="个人信息">
      <el-descriptions-item label="用户名:">{{ userStore.user.username }}</el-descriptions-item>
      <el-descriptions-item label="手机号:">{{ phone }}</el-descriptions-item>
      <el-descriptions-item label="状态:">
        <el-tag size="small">{{ status === 1?'启用':'冻结' }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>
  </div>
  <div style="margin-top: 1%">
    <el-button type="danger" @click="logoff">注销账户</el-button>
  </div>
</template>

<style scoped lang="scss">

</style>