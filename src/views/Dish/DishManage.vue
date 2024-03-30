<script setup>
import {Plus, Search} from "@element-plus/icons-vue";
import {ref, watch} from "vue";
import {
  addDishService,
  deleteDishService,
  dishListService,
  dishStatusService,
  updateDishService,
  uploadDishService
} from "@/api/dish.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {employeeStatusService} from "@/api/employee.js";
import {deleteInventoryService} from "@/api/inventory.js";

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
// 添加菜品数据
const addDishData = ref({
  id: 0,
  dishName: '',
  price: '',
  stock: '',
  classify: '',
  status: 1
})
// 修改菜品数据
const updateDishData = ref({
  id: '',
  dishName: '',
  price: '',
  stock: '',
  classify: '',
  status: ''
})
// 上传图片数据
const uploadData = ref({
  id: '',
  file: null
})
// 清除上传缓存
const clearUploadData = () => {
  uploadData.value = {
    id: '',
    file: null
  }
}
// 分类
const classify = ref('')
// 新增
const form = ref()
// 修改
const form2 = ref()
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

const statusExample = ['无状态', '启用', '冻结']

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
// 图片展示地址
const imgUrl = ref('')
// 添加菜品
const addDish = async () => {
  // 校验原料信息
  await form.value.validate()
  // 添加菜品
  let result = await addDishService(addDishData.value)
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
  ElMessage.success(result.msg ? result.msg : "添加菜品成功")
}
// 打开修改菜品dialog
const openUpdateDishDialog = (row) => {
  updateDishData.value = row
  updateDialogVisible.value = true
}
// 修改菜品
const updateDish = async () => {
  // 校验菜品信息
  await form2.value.validate()
  // 修改菜品请求
  let result = await updateDishService(updateDishData.value)
  // 关闭dialog
  updateDialogVisible.value = false
  // 清空update
  updateDishData.value = {
    id: '',
    dishName: '',
    price: '',
    stock: '',
    classify: '',
    status: ''
  }
  // 刷新数据
  await getDish()
  // 提示信息
  ElMessage.success(result.msg ? result.msg : "修改菜品成功")
}
// 取消修改菜品
const updateDishCancel = () => {
  updateDialogVisible.value = false
  getDish()
}
// dialog标题
const dishName = ref('')
// 打开upload Dialog
const openUploadDialog = (row) => {
  uploadDialogVisible.value = true
  uploadData.value.id = row.id
  dishName.value = row.dishName
  //判断是否显示默认图片
  if(row.pictureUrl.search("default") === -1){
    imgUrl.value = row.pictureUrl
  }else {
    imgUrl.value = null
  }
}
// 上传图片前校验格式
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== ('image/jpeg') || ('image/jpg') || ('image/png')) {
    ElMessage.error('格式应该为jpg,jpeg或png!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('文件大小不能超过2MB!')
    return false
  }
  return true
}
// 图片预览
const onSelectPicture = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  uploadData.value.file = uploadFile.raw
}
// 上传图片
const upload = async () => {
  // 转换为form-data
  const data = new FormData()
  for(let key in uploadData.value){
    data.append(key,uploadData.value[key])
  }
  // 调用上传服务
  await uploadDishService(data)
  // 清除上传缓存
  clearUploadData()
  // 关闭dialog
  uploadDialogVisible.value = false
  // 提示
  ElMessage.success("修改图片成功")
  // 刷新数据
  await getDish()
}
// 取消图片上传
const cancelUpload = () => {
  uploadDialogVisible.value = false
  // 清空数据
  dishName.value = ''
  imgUrl.value = ''
  // 清除上传缓存
  clearUploadData()
}
// 删除菜品
const deleteDish = async (id) => {
  ElMessageBox.confirm(
      '是否确认删除菜品?',
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
    // 删除请求
    let result = await deleteDishService(id)
    // 重新查询菜品
    await getDish()
    // 提示信息
    ElMessage.success(result.msg ? result.msg : "删除菜品成功")
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消删除',
    })
  })
}
// 修改菜品状态函数
const change = async (row) => {
  if (row.id !== '') {
    await dishStatusService(row.id, row.status)
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
// 关闭之前刷新数据
const handleClose = (done) => {
  // 清除上传缓存
  clearUploadData()
  done()
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
        <el-input v-model="addDishData.dishName" placeholder="请输入菜品名"/>
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
  <el-dialog v-model="updateDialogVisible" title="修改菜品" width="500" :before-close="handleClose">
    <el-form
        :model="updateDishData"
        label-position="left"
        label-width="auto"

        :rules="rules"
        ref="form2"
    >
      <el-form-item label="菜品名" class="dialog_input" prop="dishName">
        <el-input v-model="updateDishData.dishName" placeholder="请输入菜品名"/>
      </el-form-item>
      <el-form-item label="价格" class="dialog_input" prop="price">
        <el-input v-model.number="updateDishData.price" placeholder="请输入价格"/>
      </el-form-item>
      <el-form-item label="数量" class="dialog_input" prop="stock">
        <el-input v-model.number="updateDishData.stock" placeholder="请输入数量"/>
      </el-form-item>
      <el-form-item label="分类" class="dialog_input" prop="classify">
        <el-select
            v-model="updateDishData.classify"
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
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="updateDishCancel">取消</el-button>
        <el-button type="primary" @click="updateDish">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="uploadDialogVisible" :title="dishName" width="500" :before-close="handleClose">
    <div style="margin-left: 30%">
      <el-upload
          class="uploader"
          :show-file-list="false"
          :auto-upload="false"
          :before-upload="beforeAvatarUpload"
          :on-change="onSelectPicture"
      >
        <img v-if="imgUrl" :src="imgUrl" class="picture"/>
        <el-icon v-else class="uploader-icon">
          <Plus/>
        </el-icon>
      </el-upload>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelUpload">取消</el-button>
        <el-button type="primary" @click="upload">
          上传
        </el-button>
      </div>
    </template>
  </el-dialog>
  <div class="searchAndAdd">
    <div style="width: 600px">
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
          <img :src="props.row.pictureUrl + '?' + Date.now() " class="pictureTwo">
        </template>
      </el-table-column>
      <el-table-column label="菜品名" prop="dishName"/>
      <el-table-column label="价格/元" prop="price"/>
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
          <el-button type="success" @click="openUploadDialog(props.row)">更改图片</el-button>
          <el-button type="primary" @click="openUpdateDishDialog(props.row)">修改</el-button>
          <el-button type="danger" @click="deleteDish(props.row.id)">删除</el-button>
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

.uploader .picture {
  width: 178px;
  height: 178px;
  display: block;
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

<style>
.uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>