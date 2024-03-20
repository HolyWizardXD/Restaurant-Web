<script setup>

import {ref} from "vue";

import {updatePasswordService} from '@/api/user.js'
import {useTokenStore, useUserStore} from "@/stores";
import router from "@/router/index.js";
import {ElMessage} from "element-plus";

const form = ref()

const tokenStore = useTokenStore()

const userStore = useUserStore()
// 修改密码表单
const updatePasswordForm = ref({
  oldPassword: '',
  newPassword: '',
  rePassword: ''
})
// 自定义校验密码规则
const checkRePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入确认密码'))
  } else if (value !== updatePasswordForm.value.newPassword) {
    callback(new Error('请确保两次输入的密码一致'))
  } else {
    callback()
  }
}
// 校验密码规则
const rules = {
  oldPassword: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 8, max: 20, message: '密码长度应为8~20位字符', trigger: 'blur'}
  ],
  newPassword: [
    {required: true, message: '请输入新密码', trigger: 'blur'},
    {min: 8, max: 20, message: '密码长度应为8~20位字符', trigger: 'blur'}
  ],
  rePassword: [
    {validator: checkRePassword, trigger: 'blur'}
  ]
}
// 修改密码
const updatePassword = async () => {
  // 校验密码
  await form.value.validate()
  // 修改密码请求
  let result = await updatePasswordService(updatePasswordForm.value)
  // 移除本地数据
  tokenStore.removeToken()
  userStore.removeUser()
  // 重新登录
  await router.push('/login')
  // 消息提示
  ElMessage.success(result.msg?result.msg:"密码修改成功，请重新登录")
}

</script>

<template>
  <div class="form">
    <el-form
        label-position="right"
        label-width="auto"
        :model="updatePasswordForm"
        style="max-width: 600px"
        :rules="rules"
        ref="form"
    >
      <el-form-item class="input" label="原密码" prop="oldPassword">
        <el-input placeholder="请输入原密码" v-model="updatePasswordForm.oldPassword"/>
      </el-form-item>
      <el-form-item class="input" label="新密码" prop="newPassword">
        <el-input placeholder="请输入新密码" v-model="updatePasswordForm.newPassword"/>
      </el-form-item>
      <el-form-item class="input" label="确认密码" prop="rePassword" required>
        <el-input placeholder="请输入确认密码" v-model="updatePasswordForm.rePassword"/>
      </el-form-item>
      <el-form-item style="margin-left: 46%; margin-top: 10%">
        <el-button type="primary" @click="updatePassword">更改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">

.form {
  position: absolute;
  top: 40%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.input {
  margin-top: 8%;
  width: 500px;
}

</style>