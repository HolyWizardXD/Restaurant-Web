<script setup>
import {Search} from "@element-plus/icons-vue";
import {ref} from "vue";
import {customerListService, customerOrderService} from "@/api/customer.js";
import {ElMessage} from "element-plus";

// 分页查询条件
const pageData = ref({
  pageNum: 1,
  pageSize: 15,
  customerName: ''
})
// 返回分页信息
const pageInfo = ref({
  current: 0,
  size: 0,
  total: 0,
  pages: 0
})
// 返回顾客信息
const customerTable = ref([
  {
    id: '',
    customerName: '',
    phone: '',
    createTime: ''
  }
])
// 顾客订单数据
const customerOrder = ref({
  customerOrderCount: '',
  customerTotalPrice: ''
})
// 顾客名
const customerName = ref('')
// dialog
const orderInfoDialogVisible = ref(false)
// 获得用户消费信息
const getCustomerOrder = async (row) => {
  // 请求并封装数据
  let result = await customerOrderService(row.id)
  if( result.data.customerOrderCount === 0 && result.data.customerTotalPrice === 0 ){
    ElMessage.error(result.msg? result.msg: "顾客未进行过消费")
  }else {
    customerOrder.value = result.data
    customerName.value = row.customerName
    // 打开dialog
    orderInfoDialogVisible.value = true
  }
}
// 更改分页页数函数 未启用
const handleSizeChange = () => {
}
// 更改当前页函数
const handleCurrentChange = (val) => {
  pageData.value.pageNum = val
  getCustomer()
}
// 关闭dialog
const handleClose = (done) => {
  // 关闭窗口
  done()
  // 清空数据
  customerOrder.value = {
    customerOrderCount: '',
    customerTotalPrice: ''
  }
  customerName.value = ''
}
const closeDialog = () => {
  // 清空数据
  customerOrder.value = {
    customerOrderCount: '',
    customerTotalPrice: ''
  }
  customerName.value = ''
  // 关闭窗口
  orderInfoDialogVisible.value = false
}
const getCustomer = async () => {
  // 查询请求
  let result = await customerListService(pageData.value)
  // 封装数据
  customerTable.value = result.data.records
  pageInfo.value.current = result.data.current
  pageInfo.value.size = result.data.size
  pageInfo.value.total = result.data.total
  pageInfo.value.pages = result.data.pages
}
// create
getCustomer()
</script>

<template>
  <el-dialog
      v-model="orderInfoDialogVisible"
      title="订单信息"
      width="500"
      :before-close="handleClose"
  >
    <span>顾客</span><span class="refColor">{{ customerName }}</span>
    <span>在本店下单</span><span class="refColor">{{ customerOrder.customerOrderCount }}</span>
    <span>次,共消费</span><span class="refColor">{{ customerOrder.customerTotalPrice }}</span>
    <span>元</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="closeDialog">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <div>
    <el-input
        v-model="pageData.customerName"
        style="width: 300px"
        size="default"
        placeholder="请输入顾客名"
        @keyup.enter="getCustomer"
        :prefix-icon="Search"
    >
      <template #append>
        <el-button :icon="Search" @click="getCustomer"/>
      </template>
    </el-input>
  </div>
  <div>
    <el-table :data="customerTable" style="width: 100%" height="775">
      <el-table-column label="顾客号" prop="id"/>
      <el-table-column label="顾客名" prop="customerName"/>
      <el-table-column label="电话" prop="phone"/>
      <el-table-column label="注册日期" prop="createTime"/>
      <el-table-column align="right">
        <template #default="props">
          <el-button type="primary" @click="getCustomerOrder(props.row)">消费记录</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="bottom">
    <el-pagination
        v-model:current-page="pageInfo.current"
        v-model:page-size="pageInfo.size"
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
  margin-top: 0.8%;
}
.refColor{
  color: #3a8fc4
}
</style>