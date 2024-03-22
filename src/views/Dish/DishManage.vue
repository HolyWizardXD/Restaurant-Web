<script setup>
import {Search} from "@element-plus/icons-vue";
import {ref, watch} from "vue";
import {addDishService, dishListService} from "@/api/dish.js";
import {ElMessage} from "element-plus";

// 分页查询请求数据
const pageData = ref({
  pageNum: 1,
  pageSize: 5,
  dishName: '',
  classify: ''
})
// 返回分页信息
const pageInfo = ref({
  current: 0,
  size: 0,
  total: 0,
  pages: 0
})
// 请求返回数据
const dishTable = ref([
  {
    id: '',
    dishName: '',
    price: '',
    stock: '',
    classify: '',
    status: '',
    pictureUrl: ''
  }
])
const addDishData = ref({
  id: 0,
  dishName: '',
  price: '',
  stock: '',
  classify: '',
  status: 1
})
// 分类
const classify = ref('')
// 新增
const form = ref()
// 分类选项
const options = [{
  value: '招牌',
  label: '招牌'
}, {
  value: '小菜',
  label: '小菜'
}, {
  value: '主食',
  label: '主食'
}, {
  value: '饮品',
  label: '饮品'
}, {
  value: '杂项',
  label: '杂项'
}, {
  value: '酒',
  label: '酒'
}]

const statusExample = ['无状态','启用','冻结']

const rules = {
  dishName: [{required: true, message: '请输入菜品名', trigger: 'blur'}],
  price: [
    {required: true, message: '请输入菜品价格', trigger: 'blur'},
    {type: 'number', message: '非法数值', trigger: 'blur'}
  ],
  stock: [
    {required: true, message: '请输入菜品数量', trigger: 'blur'},
    {type: 'number', message: '非法数值', trigger: 'blur'}
  ],
  classify: [{required: true, message: '请选择分类', trigger: 'blur'}]
}
// 监听分类
watch(classify, (newValue, oldValue) => {
  pageData.value.classify = newValue
  getDish()
})
// 添加菜品dialog显示
const addDialogVisible = ref(false)
// 修改菜品dialog显示
const updateDialogVisible = ref(false)
// 上传图片dialog显示
const uploadDialogVisible = ref(false)
// 添加菜品
const addDish = async () => {
  // 校验原料信息
  let result = await form.value.validate()
  // 添加菜品
  await addDishService(addDishData.value)
  // 关闭dialog
  addDialogVisible.value = false
  // 重新查询分页数据
  await getDish()
  // 清除data
  addDishData.value = {
    id: 0,
    dishName: '',
    price: '',
    stock: '',
    classify: '',
    status: 1
  }
  // 提示
  ElMessage.success(result.msg? result.msg: "添加菜品成功")
}
// 修改菜品状态函数
const change = async (row) => {
  if (row.id !== '') {

  }
}
// 更改分页页数函数 未启用
const handleSizeChange = () => {
}
// 更改当前页函数
const handleCurrentChange = (val) => {
  pageData.value.pageNum = val
  getDish()
}
// 分页查询菜品列表
const getDish = async () => {
  // 调用分页查询菜品服务
  let result = await dishListService(pageData.value)
  // 封装数据
  dishTable.value = result.data.records
  pageInfo.value.current = result.data.current
  pageInfo.value.size = result.data.size
  pageInfo.value.total = result.data.total
  pageInfo.value.pages = result.data.pages
}
// create
getDish()
</script>

<template>
  <el-dialog v-model="addDialogVisible" title="新增菜品" width="500">
    <el-form
        :model="addDishData"
        label-position="left"
        label-width="auto"
        :rules="rules"
        ref="form"
    >
      <el-form-item label="菜品名" class="dialog_input" prop="dishName">
        <el-input v-model="addDishData.dishName" placeholder="请输入原料名"/>
      </el-form-item>
      <el-form-item label="价格" class="dialog_input" prop="price">
        <el-input v-model.number="addDishData.price" placeholder="请输入价格"/>
      </el-form-item>
      <el-form-item label="数量" class="dialog_input" prop="stock">
        <el-input v-model.number="addDishData.stock" placeholder="请输入数量"/>
      </el-form-item>
      <el-form-item label="分类" class="dialog_input" prop="classify">
        <el-select
            v-model="addDishData.classify"
            placeholder="分类"
            clearable
            style="width: 150px"
        >
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <el-tooltip :content="'状态:' + statusExample.at(addDishData.status)" placement="top">
          <el-switch
              v-model="addDishData.status"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949; margin-left: 100px"
              active-value="1"
              inactive-value="2"
          />
        </el-tooltip>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addDish">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <div class="searchAndAdd">
    <div>
      <el-input
          v-model="pageData.dishName"
          style="width: 300px"
          size="default"
          placeholder="请输入菜品名"
          @keyup.enter="getDish"
          :prefix-icon="Search"
      >
        <template #append>
          <el-button :icon="Search" @click="getDish"/>
        </template>
      </el-input>
      <el-select
          v-model="classify"
          placeholder="分类"
          clearable
          style="width: 240px;margin-left: 10px"
      >
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </div>
    <div style="margin-right: 12px">
      <el-button type="primary" @click="addDialogVisible = true">
        新增
      </el-button>
    </div>
  </div>
  <div>
    <el-table :data="dishTable" style="width: 100%" height="775">
      <el-table-column label="菜品号" prop="id"/>
      <el-table-column label="菜品图片">
        <template #default="props">
          <img :src="props.row.pictureUrl" class="pictureTwo">
        </template>
      </el-table-column>
      <el-table-column label="菜品名" prop="dishName"/>
      <el-table-column label="库存" prop="stock"/>
      <el-table-column label="分类" prop="classify"/>
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
      <el-table-column align="right" width="260">
        <template #default="props">
          <el-button type="success" @click="">更改图片</el-button>
          <el-button type="primary" @click="">修改</el-button>
          <el-button type="danger" @click="">删除</el-button>
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

.pictureTwo {
  width: 128px;
  height: 128px;
  display: block;
  border: solid 1px #3b747e;
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