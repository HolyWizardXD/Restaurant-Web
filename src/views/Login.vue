<script setup>
import {User, Lock, Phone} from "@element-plus/icons-vue";
import {userRegisterService, userLoginService} from '@/api/user.js'
import {ElMessage} from "element-plus";
import {useTokenStore, useUserStore} from "@/stores";
import {ref} from "vue";
import {useRouter} from 'vue-router'

const router = useRouter()

// 当前激活页面
const activeIndex = ref('1')
// 是否是注册页面
const isRegister = ref(false)
// 使用token store
const tokenStore = useTokenStore()
// 使用user store
const userStore = useUserStore()
// 登录校验form
const loginFormVa = ref()
// 注册校验form
const registerFormVa = ref()
// 登录 注册 切换函数
const handleSelect = (key, keyPath) => {
  if (key === '1') {
    isRegister.value = false
  } else if (key === '2') {
    isRegister.value = true
  }
}
// 用户登录表单
const loginForm = ref({
  username: '',
  password: ''
})
// 用户注册表单
const registerForm = ref({
  username: '',
  password: '',
  rePassword: '',
  phone: ''
})
// 自定义校验规则函数
const checkRePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入确认密码'))
  } else if (value !== registerForm.value.password) {
    callback(new Error('请确保两次输入的密码一致'))
  } else {
    callback()
  }
}
// 登录校验规则
const login_rules = {
  username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
  password: [{required: true, message: '请输入密码', trigger: 'blur'}]
}
// 注册校验规则
const register_rules = {
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 6, max: 16, message: '用户名长度应为6~16位字符', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 8, max: 20, message: '密码长度应为8~20位字符', trigger: 'blur'}
  ],
  rePassword: [
    {validator: checkRePassword, trigger: 'blur'}
  ],
  phone: [
    {required: true, message: '请输入手机号', trigger: 'blur'},
    {pattern: /^(?:(?:\+|00)86)?1\d{10}$/, message: '手机号格式错误', trigger: 'blur'}
  ],
}

// 清除用户注册信息函数
const clearRegisterForm = () => {
  registerForm.value = {
    username: '',
    password: '',
    rePassword: '',
    phone: ''
  }
}
// 用户登录函数
const login = async () => {
  // 校验
  await loginFormVa.value.validate()
  // 登陆之前清除user&token缓存
  userStore.removeUser()
  tokenStore.removeToken()
  // 登录请求
  let result = await userLoginService(loginForm.value)
  // 设置token以及user信息
  tokenStore.setToken(result.data.token)
  userStore.setUser(result.data.id, result.data.username)
  // router到主页
  await router.push('/Order/HistoryOrder')
  // 提示
  ElMessage.success(result.msg ? result.msg : "登录成功")
}
// 用户注册函数
const register = async () => {
  // 注册前校验
  await registerFormVa.value.validate()
  // 注册请求
  let result = await userRegisterService(registerForm.value)
  // 清除注册信息
  clearRegisterForm()
  // 清除token
  tokenStore.removeToken()
  // 清除user
  userStore.removeUser()
  // 刷新当前页面
  router.go(0)
  // 提示信息
  ElMessage.success(result.msg ? result.msg : "注册成功")
}

</script>

<template>
  <div class="login">
    <h1 class="gradient-text">
      <img style="width: 80px;position: absolute;margin-top: -1px;margin-left: -80px" src="/src/assets/image/catering.png"/>
      餐饮管理后台
    </h1>
    <div class="form">
      <el-menu
          :default-active="activeIndex"
          class="el-menu-login"
          mode="horizontal"
          @select="handleSelect"
      >
        <el-menu-item index="1" style="border-top-left-radius: 25px;"><p style="font-size: 20px">登录</p></el-menu-item>
        <el-menu-item index="2"><p style="font-size: 20px">注册</p></el-menu-item>
      </el-menu>
      <el-form ref="loginFormVa" size="large" autocomplete="off" v-show="!isRegister" :model="loginForm"
               :rules="login_rules">
        <el-form-item class="login_input" style="margin-top: 10%" prop="username">
          <el-input v-model="loginForm.username" :prefix-icon="User" placeholder="输入用户名"></el-input>
        </el-form-item>
        <el-form-item class="login_input" prop="password">
          <el-input v-model="loginForm.password" :prefix-icon="Lock" placeholder="输入密码" show-password></el-input>
        </el-form-item>
        <el-button type="primary" class="login_button" round @click="login"><p style="font-size: 15px">登录</p>
        </el-button>
      </el-form>
      <el-form ref="registerFormVa" size="large" autocomplete="off" v-show="isRegister" :model="registerForm"
               :rules="register_rules">
        <el-form-item class="register_input" prop="username">
          <el-input v-model="registerForm.username" :prefix-icon="User" placeholder="输入用户名"></el-input>
        </el-form-item>
        <el-form-item class="register_input" prop="password">
          <el-input v-model="registerForm.password" :prefix-icon="Lock" placeholder="输入密码"></el-input>
        </el-form-item>
        <el-form-item class="register_input" prop="rePassword">
          <el-input v-model="registerForm.rePassword" :prefix-icon="Lock" placeholder="确认密码"></el-input>
        </el-form-item>
        <el-form-item class="register_input" prop="phone">
          <el-input v-model="registerForm.phone" :prefix-icon="Phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-button type="primary" class="register_button" round @click="register"><p style="font-size: 15px">注册</p>
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">

.login {
  background: url(@/assets/image/background.jpeg);
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}

.title {
  margin-left: 45%;
  color: rgba(72, 61, 139, 0.8);
}

.el-menu-login {
  background: rgba(255, 255, 255, 0);
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
}

.form {
  background: rgba(255, 255, 255, 0.8);
  width: 500px;
  height: 460px;
  margin-top: 10%;
  margin-left: 65%;
  border-radius: 25px;
  box-shadow: 10px 10px 5px #696969;
}

.login_input {
  margin-left: 15%;
  margin-top: 6%;
  width: 70%;
}

.login_button {
  margin-top: 26%;
  margin-left: 36%;
  width: 30%;
}

.register_input {
  margin-left: 15%;
  margin-top: 6%;
  width: 70%;
}

.register_button {
  margin-top: 2%;
  margin-left: 36%;
  width: 30%;
}

//  开源代码
.gradient-text {
  /* Fallback: Set a background color. */
  background-color: #CA4246;

  /* Create the gradient. */
  background-image: linear-gradient(
          45deg,
          #5870c5 16.666%,
          #4965cc 16.666%,
          #395e96 33.333%,
          #3a8fc4 33.333%,
          rgba(88, 199, 195, 0.57) 50%,
          #318684 50%,
          #3b747e 66.666%,
          #1a8170 66.666%,
          #1b7373 83.333%,
          #2d8396 83.333%);

  /* Set the background size and repeat properties. */
  background-size: 100%;
  background-repeat: repeat;

  /* Use the text as a mask for the background. */
  /* This will show the gradient as a text color rather than element bg. */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  /* Animate the text when loading the element. */
  /* This animates it on page load and when hovering out. */
  animation: rainbow-text-simple-animation-rev 0.75s ease forwards;

}

.gradient-text:hover {
  animation: rainbow-text-simple-animation 0.5s ease-in forwards;
}


/* Move the background and make it smaller. */
/* Animation shown when entering the page and after the hover animation. */
@keyframes rainbow-text-simple-animation-rev {
  0% {
    background-size: 650%;
  }
  40% {
    background-size: 650%;
  }
  100% {
    background-size: 100%;
  }
}

/* Move the background and make it larger. */
/* Animation shown when hovering over the text. */
@keyframes rainbow-text-simple-animation {
  0% {
    background-size: 100%;
  }
  80% {
    background-size: 650%;
  }
  100% {
    background-size: 650%;
  }
}

h1 {
  font-family: "Archivo Black", sans-serif;
  font-weight: normal;
  font-size: 3em;
  text-align: center;
  margin-bottom: 0;
  margin-bottom: -0.25em;
  display: block;
  margin-left: 36%;
  margin-right: auto;
  cursor: pointer;
  width: 605px;
}

</style>
