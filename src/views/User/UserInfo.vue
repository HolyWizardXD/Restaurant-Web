<script setup>
import {ElMessage, ElMessageBox} from "element-plus";
import {useUserStore,useTokenStore} from "@/stores/index.js";
import router from "@/router/index.js";
import {userLogoffService, getUserService} from "@/api/user.js";
import {ref} from "vue";

const userStore = useUserStore()

const tokenStore = useTokenStore()
// 当前状态
const status = ref(0)
// 电话号
const phone = ref('')
// 获得用户信息
const getUser = async () => {
  // 获取用户信息请求
  let result = await getUserService()
  // 封装数据
  status.value = result.data.status
  phone.value = result.data.phone
}
// 注销函数
const logoff = () => {
  ElMessageBox.confirm(
      '以下操作进行后不可更改,是否确认注销账户?',
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        // 调用注销服务
        await userLogoffService(userStore.user.id)
        // 转到登录页
        await router.push('/login')
        // 移除用户缓存
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
// 页面生成时取得用户信息
getUser()

</script>

<template>
  <div style="margin-top: 1%" class="form">
    <el-descriptions title="个人信息" :column="1" size="large">
      <el-descriptions-item label="用户名:" width="100px">{{ userStore.user.username }}</el-descriptions-item>
      <el-descriptions-item label="手机号:" width="100px">{{ phone }}</el-descriptions-item>
      <el-descriptions-item label="状态:" width="100px">
        <el-tag size="small">{{ status === 1?'启用':'冻结' }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <el-button type="danger" @click="logoff">注销</el-button>
  </div>
</template>

<style scoped lang="scss">

.form {
  position: absolute;
  top: 40%;
  left: 53%;
  width: 200px;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

</style>