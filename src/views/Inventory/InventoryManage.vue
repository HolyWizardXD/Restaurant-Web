<script setup>
import {Plus, Search} from "@element-plus/icons-vue";
import {ref} from "vue";
import {
  addInventoryService,
  deleteInventoryService,
  inventoryListService,
  updateInventoryService, uploadPictureService
} from "@/api/inventory.js";
import {ElMessage, ElMessageBox} from "element-plus";

// 分页查询条件
const pageData = ref({
  pageNum: 1,
  pageSize: 5,
  material: ''
})
// 新增
const form = ref()
// 修改
const form2 = ref()
// 返回分页信息
const pageInfo = ref({
  current: 0,
  size: 0,
  total: 0,
  pages: 0
})
// 返回分页查询数据
const inventoryTable = ref([
  {
    id: '',
    material: '',
    stock: '',
    pictureUrl: ''
  }
])
// 新增员工数据
const addInventoryData = ref({
  id: 0,
  material: '',
  stock: ''
})
// 修改员工数据
const updateInventoryForm = ref({
  id: 0,
  material: '',
  stock: ''
})
const rules = {
  material: [{required: true, message: '请输入原料名', trigger: 'blur'}],
  stock: [
    {required: true, message: '请输入原料数量', trigger: 'blur'},
    {type: 'number', message: '非法数值', trigger: 'blur'}
  ]
}
// 图片展示地址
const imgUrl = ref('')
// 新增dialog显示
const addDialogFormVisible = ref(false)
// 修改dialog显示
const updateDialogFormVisible = ref(false)
// 上传图片dialog显示
const uploadPictureVisible = ref(false)
// 上传Data
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
// 分页查询原料数据
const getInventory = async () => {
  // 查询请求
  let result = await inventoryListService(pageData.value)
  // 封装数据
  inventoryTable.value = result.data.records
  pageInfo.value.current = result.data.current
  pageInfo.value.size = result.data.size
  pageInfo.value.total = result.data.total
  pageInfo.value.pages = result.data.pages
}
// 关闭之前刷新数据
const handleClose = (done) => {
  clearUploadData()
  done()
  getInventory()
}
// 修改原料dialog
const updateDialog = (row) => {
  updateInventoryForm.value = row
  updateDialogFormVisible.value = true
}
// 修改原料
const updateInventory = async () => {
  // 校验原料信息
  await form2.value.validate()
  // 修改原料请求
  let result = await updateInventoryService(updateInventoryForm.value)
  // 关闭dialog
  updateDialogFormVisible.value = false
  // 刷新数据
  await getInventory()
  // 清空修改数据表单
  updateInventoryForm.value = {
    id: 0,
    material: '',
    stock: ''
  }
  // 提示信息
  ElMessage.success(result.msg ? result.msg : "原料修改成功")
}
// 取消修改原料
const updateInventoryCancel = () => {
  updateDialogFormVisible.value = false
  getInventory()
}
// 新增原料
const addInventory = async () => {
  // 校验原料信息
  await form.value.validate()
  // 新增原料请求
  let result = await addInventoryService(addInventoryData.value)
  // 关闭dialog
  addDialogFormVisible.value = false
  // 清空新增原料表
  addInventoryData.value = {
    id: 0,
    material: '',
    stock: ''
  }
  // 重新查询原料
  await getInventory()
  // 提示信息
  ElMessage.success(result.msg ? result.msg : "新增原料成功")
}
// 删除原料函数
const deleteInventory = async (inventory) => {
  ElMessageBox.confirm(
      '是否确认删除原料?',
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        // 删除请求
        let result = await deleteInventoryService(inventory.id)
        // 重新查询原料
        await getInventory()
        // 提示信息
        ElMessage.success(result.msg ? result.msg : "删除原料成功")
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
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
// 原料名称
const material = ref('')
// 图片预览
const onSelectPicture = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  uploadData.value.file = uploadFile.raw
}
// 上传图片
const uploadPicture = (row) => {
  uploadPictureVisible.value = true
  uploadData.value.id = row.id
  material.value = row.material
  if(row.pictureUrl.search("default") === -1){
    imgUrl.value = row.pictureUrl
  }else {
    imgUrl.value = null
  }
}
// 取消文件上传
const cancelUpload = () => {
  uploadPictureVisible.value = false
  material.value = ''
  imgUrl.value = ''
  clearUploadData()
}
// 确认上传
const uploadPictureConfirm = async () => {
  // 转换为form-data
  const data = new FormData()
  for(let key in uploadData.value){
    data.append(key,uploadData.value[key])
  }
  // 清空上传信息
  clearUploadData()
  // 调用上传服务
  await uploadPictureService(data)
  // 刷新数据
  await getInventory()
  // 关闭dialog
  uploadPictureVisible.value = false
  // 提示
  ElMessage.success("修改图片成功")
}
// 更改分页页数函数 未启用
const handleSizeChange = () => {
}
// 更改当前页函数
const handleCurrentChange = (val) => {
  pageData.value.pageNum = val
  getInventory()
}
// crete
getInventory()
</script>

<template>
  <div class="searchAndAdd">
    <div>
      <el-input
          v-model="pageData.material"
          style="width: 300px"
          size="default"
          placeholder="请输入原料名"
          @keyup.enter="getInventory"
          :prefix-icon="Search"
      >
        <template #append>
          <el-button :icon="Search" @click="getInventory"/>
        </template>
      </el-input>
    </div>
    <div style="margin-right: 12px">
      <el-button type="primary" @click="addDialogFormVisible = true">
        新增
      </el-button>
    </div>
  </div>
  <el-dialog v-model="addDialogFormVisible" title="新增原料" width="500">
    <el-form
        :model="addInventoryData"
        label-position="left"
        label-width="auto"
        :rules="rules"
        ref="form"
    >
      <el-form-item label="原料名" class="dialog_input" prop="material">
        <el-input v-model="addInventoryData.material" placeholder="请输入原料名"/>
      </el-form-item>
      <el-form-item label="库存数量" class="dialog_input" prop="stock">
        <el-input v-model.number="addInventoryData.stock" placeholder="请输入数量,以斤为单位"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addInventory">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="updateDialogFormVisible" title="修改原料" width="500" :before-close="handleClose">
    <el-form
        :model="updateInventoryForm"
        label-position="left"
        label-width="auto"
        :rules="rules"
        ref="form2"
    >
      <el-form-item label="原料名" class="dialog_input" prop="material">
        <el-input v-model="updateInventoryForm.material" placeholder="请输入原料名"/>
      </el-form-item>
      <el-form-item label="库存数量" class="dialog_input" prop="stock">
        <el-input v-model.number="updateInventoryForm.stock" placeholder="请输入数量,以斤为单位"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="updateInventoryCancel">取消</el-button>
        <el-button type="primary" @click="updateInventory">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="uploadPictureVisible" :title="material" width="500" :before-close="handleClose">
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
        <el-button type="primary" @click="uploadPictureConfirm">
          上传
        </el-button>
      </div>
    </template>
  </el-dialog>
  <div>
    <el-table :data="inventoryTable" style="width: 100%" height="775">
      <el-table-column label="原料号" prop="id"/>
      <el-table-column label="原料图片">
        <template #default="props">
          <img :src="props.row.pictureUrl + '?' + Date.now()" class="pictureTwo">
        </template>
      </el-table-column>
      <el-table-column label="原料名" prop="material"/>
      <el-table-column label="数量/斤" prop="stock"/>
      <el-table-column align="right">
        <template #default="props">
          <el-button type="success" @click="uploadPicture(props.row)">更改图片</el-button>
          <el-button type="primary" @click="updateDialog(props.row)">修改</el-button>
          <el-button type="danger" @click="deleteInventory(props.row)">删除</el-button>
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

.uploader .picture {
  width: 178px;
  height: 178px;
  display: block;
}

.pictureTwo {
  width: 128px;
  height: 128px;
  display: block;
  border: solid 1px #3b747e;
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