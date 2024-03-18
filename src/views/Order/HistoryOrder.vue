<script setup>
import {ref} from 'vue'

import {orderService} from '@/api/order.js'
import {Search} from "@element-plus/icons-vue";

const timeValue = ref('')
const defaultTime = ref([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
])

const orderPage = ref({
  pageNum: 1,
  pageSize: 17,
  total : 0,
  pages: 0,
  customerName: '',
  begin: '',
  end: ''
})


const tableData = ref([
  {
    id: '',
    table: '',
    customerName: '',
    allPrice: '',
    description: '',
    createTime: '',
    dishVOList: [
      {
        dish_id: '',
        dish_name: '',
        price: '',
        amount: '',
        totalPrice: ''
      }
    ]
  }
])

const allPrice = ref(0)
const handleCurrentChange = (val) => {
  orderPage.value.pageNum = val
  pageList(false)
}

const handleSizeChange = (val) => {

}

const formatDateTime = (date) => {
  const y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  let d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  let h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  let minute = date.getMinutes()
  minute = minute < 10 ? ('0' + minute) : minute
  let second = date.getSeconds()
  second = second < 10 ? ('0' + second) : second
  return y + '-' + m + '-' + d + 'T' + h + ':' + minute + ':' + second
}

const pageList = async (reset) => {
  if (reset === false) {
    if (timeValue.value.at(0) !== undefined && timeValue.value.at(0) !== '') {
      orderPage.value.begin = formatDateTime(timeValue.value.at(0))
    }
    if (timeValue.value.at(1) !== undefined && timeValue.value.at(1) !== '') {
      orderPage.value.end = formatDateTime(timeValue.value.at(1))
    }
  } else if(reset === true) {
    orderPage.value.pageNum = 1
    orderPage.value.pageSize = 17
    orderPage.value.customerName = ''
  }
  let result = await orderService(orderPage.value)
  tableData.value = result.data.records
  orderPage.value.pageNum = result.data.current
  orderPage.value.pageSize = result.data.size
  orderPage.value.total = result.data.total
  orderPage.value.pages = result.data.pages
  allPrice.value = 0
  tableData.value.forEach((item, index, arr) => {
    allPrice.value += item.allPrice
  } )
}

// created调用
pageList(false)

</script>

<template>
  <div class="demo-date-picker">
    <div class="block">
      <span style="color: #1a8170">日期范围: </span>
      <el-date-picker
          v-model="timeValue"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="至"
          :default-time="defaultTime"
          unlink-panels
      />
      <span style="color: #1a8170;margin-left: 1%">顾客筛选: </span>
      <el-input
          v-model="orderPage.customerName"
          style="width: 240px"
          size="default"
          placeholder="请输入顾客名"
          :prefix-icon="Search"
      />
      <span style="color: #1a8170;margin-left: 1%">总售价:{{ allPrice }}元</span>
      <el-button type="primary" @click="pageList(false)" style="margin-left: 39%">查询</el-button>
      <el-button @click="pageList(true)">重置</el-button>
    </div>
  </div>
  <el-table :data="tableData" style="width: 100%" height="720">
    <el-table-column type="expand">
      <template #default="props">
        <div m="1">
          <p m="t-0 b-2" style="font-size: 16px;color: #1a8170">备注: {{ props.row.description }}</p>
          <h3 style="color: #1a8170">菜品详情</h3>
          <el-table :data="props.row.dishVOList" :border="true">
            <el-table-column label="菜品号" prop="dish_id"/>
            <el-table-column label="菜品名" prop="dish_name"/>
            <el-table-column label="价格/元" prop="price"/>
            <el-table-column label="数量" prop="amount"/>
            <el-table-column label="总价格/元" prop="totalPrice"/>
          </el-table>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="订单号" prop="id"/>
    <el-table-column label="顾客名" prop="customerName"/>
    <el-table-column label="桌号" prop="table"/>
    <el-table-column label="总价格/元" prop="allPrice"/>
    <el-table-column label="下单时间" prop="createTime"/>
  </el-table>
  <div class="bottom">
      <el-pagination
          v-model:current-page="orderPage.pageNum"
          v-model:page-size="orderPage.pageSize"
          :background="true"
          layout="total, prev, pager, next, jumper"
          :total="orderPage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
  </div>
</template>

<style scoped lang="scss">

.bottom {
  margin-top: 0.5%;
}

.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.demo-date-picker .block {
  padding: 30px 0;
  flex-direction: column;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}

</style>