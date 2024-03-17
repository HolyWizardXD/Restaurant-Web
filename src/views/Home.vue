<script setup>
import {
  Document,
  Box,
  Service,
  Food,
  House,
  SetUp,
  Lock,
  Link,
  User,
  SwitchButton,
} from '@element-plus/icons-vue'

import {ref} from "vue";
import {useRouter} from 'vue-router'
import {useUserStore, useTokenStore} from "@/stores/index.js";
import {userLogoutService} from '@/api/user.js'
import {ElMessage, ElMessageBox} from "element-plus";

const router = useRouter()

const userStore = useUserStore()

const tokenStore = useTokenStore()


const github = () => {
  window.location.href = "https://github.com/HolyWizardXD"
}

const handleOpen = (key, keyPath) => {

}
const handleClose = (key, keyPath) => {

}

const logout = () => {
  ElMessageBox.confirm(
      '是否确定登出账户?',
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        let result = await userLogoutService()
        tokenStore.removeToken()
        userStore.removeUser()
        router.push('/login')
        ElMessage.success(result.msg ? result.msg : "登出成功")
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '登出取消',
        })
      })

}

const handleSelect = (key, keyPath) => {
}

</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <el-menu
            active-text-color="#ffd04b"
            background-color="#3A8FD2"
            text-color="#fff"
            @open="handleOpen"
            @close="handleClose"
            style="height: 100vh"
            router
        >
          <img class="icon" src="../assets/image/catering.png"/>
          <el-menu-item index="/Order/HistoryOrder">
            <el-icon>
              <Document/>
            </el-icon>
            <span>订单中心</span>
          </el-menu-item>
          <el-menu-item index="/Employee/EmployeeInfo">
            <el-icon>
              <Service/>
            </el-icon>
            <span>员工信息</span>
          </el-menu-item>
          <el-menu-item index="/Customer/CustomerInfo">
            <el-icon>
              <User/>
            </el-icon>
            <span>顾客信息</span>
          </el-menu-item>
          <el-menu-item index="/Dish/DishManage">
            <el-icon>
              <Food/>
            </el-icon>
            <span>菜品管理</span>
          </el-menu-item>
          <el-menu-item index="/Inventory/InventoryManage">
            <el-icon>
              <Box/>
            </el-icon>
            <span>库存管理</span>
          </el-menu-item>
          <el-sub-menu index="">
            <template #title>
              <el-icon>
                <House/>
              </el-icon>
              <span>用户中心</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/User/UserInfo">
                <el-icon>
                  <SetUp/>
                </el-icon>
                <span>个人信息</span>
              </el-menu-item>
              <el-menu-item index="/User/UpdatePassword">
                <el-icon>
                  <Lock/>
                </el-icon>
                <span>修改密码</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <button class="learn-more" @click="github">
            <span class="circle" aria-hidden="true">
            <span class="icon arrow"></span>
            </span>
            <span class="button-text">GitHub</span>
          </button>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <el-menu
              class="el-menu-head"
              mode="horizontal"
              @select="handleSelect"
              router
          >
            <h2 class="title">餐饮管理后台</h2>
            <el-sub-menu index="1">
              <template #title>{{ userStore.user.username }}</template>
              <el-menu-item index="/User/UserInfo">
                <el-icon>
                  <Link/>
                </el-icon>
                <span>个人信息</span>
              </el-menu-item>
              <el-menu-item @click="logout">
                <el-icon>
                  <SwitchButton/>
                </el-icon>
                <span>登出账户</span>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-header>
        <el-main>
          <router-view>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="scss">

.el-menu-head {
  flex-direction: row;
  justify-content: space-between;
}

.title {
  margin-top: 0.7%;
  color: #1c4057;
}

.common-layout {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}

.icon {
  width: 50%;
  margin-left: 25%;
}

// 开源
// 底部GitHub
button {
  bottom: 0;
  margin-bottom: 2%;
  margin-left: 2%;
  position: absolute;
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 0;
  vertical-align: middle;
  text-decoration: none;
  background: transparent;
  padding: 0;
  font-size: inherit;
  font-family: inherit;
}

button.learn-more {
  width: 12rem;
  height: auto;
}

button.learn-more .circle {
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  position: relative;
  display: block;
  margin: 0;
  width: 3rem;
  height: 3rem;
  background: rgba(132, 152, 236, 0.82);
  border-radius: 1.625rem;
}

button.learn-more .circle .icon {
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  background: #fff;
}

button.learn-more .circle .icon.arrow {
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  left: 0.625rem;
  width: 1.125rem;
  height: 0.125rem;
  background: none;
}

button.learn-more .circle .icon.arrow::before {
  position: absolute;
  content: "";
  top: -0.29rem;
  right: 0.0625rem;
  width: 0.625rem;
  height: 0.625rem;
  border-top: 0.125rem solid #fff;
  border-right: 0.125rem solid #fff;
  transform: rotate(45deg);
}

button.learn-more .button-text {
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.75rem 0;
  margin: 0 0 0 1.85rem;
  color: #282936;
  font-weight: 700;
  line-height: 1.6;
  text-align: center;
  text-transform: uppercase;
}

button:hover .circle {
  width: 100%;
}

button:hover .circle .icon.arrow {
  background: #fff;
  transform: translate(1rem, 0);
}

button:hover .button-text {
  color: #fff;
}
</style>