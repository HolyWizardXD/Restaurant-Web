<script setup>
import {
  employeeListService,
  employeeStatusService,
  addEmployeeService,
  updateEmployeeService
} from '@/api/employee.js'
import {ref} from "vue";
import {Search} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
// 分页查询条件
const pageData = ref({
  pageNum: 1,
  pageSize: 15,
  employeeName: ''
})
// 返回分页信息
const pageInfo = ref({
  current: 0,
  size: 0,
  total: 0,
  pages: 0
})
// 校验员工新增相关form必备引用定义
const form = ref()
// 校验员工修改相关form必备引用定义
const form2 = ref()
// 新增员工和修改员工校验
const rules = {
  employeeName: [{required: true, message: '请输入员工名', trigger: 'blur'}],
  salary: [
    {required: true, message: '请输入员工薪资', trigger: 'blur'},
    {type: 'number', message: '非法薪资数值', trigger: 'blur'}
  ],
  phone: [
    {required: true, message: '请输入手机号', trigger: 'blur'},
    {pattern: /^(?:(?:\+|00)86)?1\d{10}$/, message: '手机号格式错误', trigger: 'blur'}
  ]
}
// 员工分页查询数据
const employeeData = ref([
  {
    id: '',
    employeeName: '',
    salary: '',
    phone: '',
    status: ''
  }
])
// 更新员工表单
const updateEmployeeForm = ref({
  id: '',
  employeeName: '',
  salary: '',
  phone: ''
})
// 新增员工数据表单
const employeeForm = ref({
  id: 0,
  employeeName: '',
  salary: '',
  phone: ''
})
// 分页查询员工函数
const getEmployee = async () => {
  // 查询请求
  let result = await employeeListService(pageData.value)
  // 封装数据
  employeeData.value = result.data.records
  pageInfo.value.current = result.data.current
  pageInfo.value.size = result.data.size
  pageInfo.value.total = result.data.total
  pageInfo.value.pages = result.data.pages
}
// 修改员工状态函数
const change = async (row) => {
  if (row.id !== '') {
    await employeeStatusService(row.id, row.status)
  }
}
// 新增员工dialog显示
const dialogFormVisible = ref(false)
// 修改员工dialog显示
const dialogFormVisible2 = ref(false)

// 新增员工dialog函数
const dialog = () => {
  dialogFormVisible.value = true
}
// 新增员工函数
const addEmployee = async () => {
  // 校验员工信息
  await form.value.validate()
  // 新增员工请求
  let result = await addEmployeeService(employeeForm.value)
  // 关闭dialog
  dialogFormVisible.value = false
  // 清空新增员工表
  employeeForm.value = {
    id: 0,
    employeeName: '',
    salary: '',
    phone: ''
  }
  // 重新查询员工
  await getEmployee()
  // 提示信息
  ElMessage.success(result.msg ? result.msg : "新增员工成功")
}
// 关闭之前刷新数据
const handleClose = (done) => {
  done()
  getEmployee()
}
// 修改员工信息dialog显示
const dialog2 = (row) => {
  updateEmployeeForm.value = row
  dialogFormVisible2.value = true
}
// 修改员工信息函数
const updateEmployee = async () => {
  // 校验员工信息
  await form2.value.validate()
  // 修改员工信息请求
  let result = await updateEmployeeService(updateEmployeeForm.value)
  // 关闭dialog
  dialogFormVisible2.value = false
  // 刷新数据
  await getEmployee()
  // 清空修改表单
  updateEmployeeForm.value = {
    id: '',
    employeeName: '',
    salary: '',
    phone: ''
  }
  // 提示信息
  ElMessage.success(result.msg ? result.msg : "员工修改成功")
}
// 取消修改员工信息函数
const updateEmployeeCancel = () => {
  dialogFormVisible2.value = false
  getEmployee()
}
// 更改分页页数函数 未启用
const handleSizeChange = () => {}
// 更改当前页函数
const handleCurrentChange = (val) => {
  pageData.value.pageNum = val
  getEmployee()
}
// 启动网页时分页查询
getEmployee()

</script>

<template>
  <div class="searchAndAdd">
    <div>
      <el-input
          v-model="pageData.employeeName"
          style="width: 300px"
          size="default"
          placeholder="请输入员工名"
          @keyup.enter="getEmployee"
          :prefix-icon="Search"
      >
        <template #append>
          <el-button :icon="Search" @click="getEmployee"/>
        </template>
      </el-input>
    </div>
    <div style="margin-right: 14px">
      <el-button type="primary" @click="dialog">
        新增
      </el-button>
    </div >
  </div>
  <el-dialog v-model="dialogFormVisible" title="新增员工" width="500">
    <el-form
        :model="employeeForm"
        label-position="left"
        label-width="auto"
        :rules="rules"
        ref="form"
    >
      <el-form-item label="员工名" class="dialog_input" prop="employeeName">
        <el-input v-model="employeeForm.employeeName" placeholder="请输入员工名"/>
      </el-form-item>
      <el-form-item label="员工薪资" class="dialog_input" prop="salary">
        <el-input v-model.number="employeeForm.salary" placeholder="请输入员工薪资"/>
      </el-form-item>
      <el-form-item label="电话" class="dialog_input" prop="phone">
        <el-input v-model="employeeForm.phone" placeholder="请输入员工电话"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addEmployee">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogFormVisible2" title="修改员工" width="500" :before-close="handleClose">
    <el-form
        :model="updateEmployeeForm"
        label-position="left"
        label-width="auto"
        :rules="rules"
        ref="form2"
    >
      <el-form-item label="员工名" class="dialog_input" prop="employeeName">
        <el-input v-model="updateEmployeeForm.employeeName" placeholder="请输入员工名"/>
      </el-form-item>
      <el-form-item label="员工薪资" class="dialog_input" prop="salary">
        <el-input v-model.number="updateEmployeeForm.salary" placeholder="请输入员工薪资"/>
      </el-form-item>
      <el-form-item label="电话" class="dialog_input" prop="phone">
        <el-input v-model="updateEmployeeForm.phone" placeholder="请输入员工电话"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="updateEmployeeCancel">取消</el-button>
        <el-button type="primary" @click="updateEmployee">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <div>
    <el-table :data="employeeData" style="width: 100%" height="775">
      <el-table-column label="员工号" prop="id"/>
      <el-table-column label="员工名" prop="employeeName"/>
      <el-table-column label="薪资/月" prop="salary"/>
      <el-table-column label="电话" prop="phone"/>
      <el-table-column label="冻结/启用">
        <template #default="scope">
          <el-switch
              v-model="scope.row.status"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949;margin-right: 12px"
              :active-value="1"
              :inactive-value="2"
              @change="change(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="right" width="100px">
        <template #default="props">
          <el-button type="primary" @click="dialog2(props.row)">修改</el-button>
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

.searchAndAdd {
  flex-direction: row;
  display: flex;
  justify-content: space-between;
}

.dialog_input {
  margin-top: 25px;
  margin-left: 50px;
  width: 360px;
}

.bottom {
  margin-top: 0.8%;
}

</style>