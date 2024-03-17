<script setup>
import {
  Document,
  Box,
  Service,
  Food,
  Shop,
  User,
} from '@element-plus/icons-vue'

import {useRouter} from 'vue-router'

const router = useRouter()

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}

const order = () => {
  router.push('/order')
}
</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <el-menu
            active-text-color="#ffd04b"
            background-color="#3a8fc4"
            class="el-menu-vertical-demo"
            default-active="2"
            text-color="#fff"
            @open="handleOpen"
            @close="handleClose"
            style="height: 100vh"
        >
          <el-menu-item index="1">
            <el-icon>
              <Document/>
            </el-icon>
            <span>订单中心</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon>
              <Service/>
            </el-icon>
            <span>员工信息</span>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon>
              <User/>
            </el-icon>
            <span>顾客信息</span>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon>
              <Food/>
            </el-icon>
            <span>菜品管理</span>
          </el-menu-item>
          <el-menu-item index="5">
            <el-icon>
              <Box/>
            </el-icon>
            <span>库存管理</span>
          </el-menu-item>
          <el-sub-menu index="6">
            <template #title>
              <el-icon>
                <Shop/>
              </el-icon>
              <span>用户中心</span>
            </template>
            <el-menu-item-group title="Group One">
              <el-menu-item index="1-1">item one</el-menu-item>
              <el-menu-item index="1-2">item two</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group Two">
              <el-menu-item index="1-3">item three</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="1-4">
              <template #title>item four</template>
              <el-menu-item index="1-4-1">item one</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="scss">

.common-layout {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}

</style>