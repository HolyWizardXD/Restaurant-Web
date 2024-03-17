<script setup>
import { orderService } from '@/api/order.js'
import { ref } from 'vue'

const orderPageData = ref({
  pageNum: 1,
  pageSize: 10,
  customerName: '',
  begin: '',
  end: ''
})
  
const orderList = async()=>{
  let result = await orderService(orderPageData.value);
}
</script>

<template>
  <el-button type="primary" @click="orderList">Primary</el-button>
</template>
