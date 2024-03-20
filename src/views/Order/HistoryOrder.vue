<script setup>
import {ref} from 'vue'

import {DiningOutService, orderService} from '@/api/order.js'
import {Search} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
// date函数
let date = new Date()
// 定义默认查询订单时间范围数据
const timeValue = ref([
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59),
])
// 默认时间数据
const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
]
// 分页查询条件
const orderPage = ref({
  pageNum: 1,
  pageSize: 17,
  customerName: '',
  begin: '',
  end: ''
})
// 返回的分页信息
const pageInfo = ref({
  pageNum: 0,
  pageSize: 0,
  total: 0,
  pages: 0
})
// 分页查询订单数据
const tableData = ref([
  {
    id: '',
    table: '',
    customerName: '',
    allPrice: '',
    description: '',
    createTime: '',
    status: 1,
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
// 所有价格数据
const allPrice = ref(0)
// 更改当前页分页查询函数
const handleCurrentChange = (val) => {
  orderPage.value.pageNum = val
  pageList(false)
}
// 更改每页数量分页查询函数 未启用
const handleSizeChange = (val) => {

}
// 时间转换 js date转换为java LocalDateTime
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
// 分页查询请求函数
const pageList = async (reset) => {
  // 判断是否为重置查询
  if (reset === false) {
    // 判断是否使用按时间查询 转换date
    if (timeValue.value[0] !== undefined) {
      orderPage.value.begin = formatDateTime(timeValue.value[0])
    }
    if (timeValue.value[1] !== undefined) {
      orderPage.value.end = formatDateTime(timeValue.value[1])
    }
  } else if (reset === true) {
    // 重置分页查询条件
    orderPage.value.pageNum = 1
    orderPage.value.pageSize = 17
    orderPage.value.customerName = ''
    timeValue.value = [
      new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
      new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59),
    ]
    orderPage.value.begin = formatDateTime(timeValue.value[0])
    orderPage.value.end = formatDateTime(timeValue.value[1])
  }
  // 查询请求
  let result = await orderService(orderPage.value)
  // 封装返回数据
  tableData.value = result.data.records
  pageInfo.value.pageNum = result.data.current
  pageInfo.value.pageSize = result.data.size
  pageInfo.value.total = result.data.total
  pageInfo.value.pages = result.data.pages
  allPrice.value = 0
  // 计算总价格
  tableData.value.forEach((item, index, arr) => {
    allPrice.value += item.allPrice
  })
}
// 出餐函数
const DiningOut = async (orderId) => {
  let result = await DiningOutService(orderId)
  ElMessage.success(result.msg ? result.msg : "出餐成功")
  await pageList(false)
}
// 初始调用
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
          @keyup.enter="pageList(false)"
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
    <el-table-column label="出餐">
      <template #default="scope">
        <el-button
            v-if="scope.row.status === 0"
            style="transform: translate(-15%,0%)"
            @click="DiningOut(scope.row.id)"
            type="success"
        >出餐
        </el-button>
        <span v-if="scope.row.status === 1">已出餐</span>
      </template>
    </el-table-column>
  </el-table>
  <div class="bottom">
    <el-pagination
        v-model:current-page="pageInfo.pageNum"
        v-model:page-size="pageInfo.pageSize"
        :background="true"
        layout="total, prev, pager, next, jumper"
        :total="pageInfo.total"
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