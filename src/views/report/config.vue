<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名" v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
      <el-button class="filter-item" style="margin-left: 10px;" @click="openCreateDialog" type="primary" icon="el-icon-plus">添加</el-button>
      <!-- <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="openMultipleDeleteConfirm">删除</el-button> -->
    </div>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="key" prop="config_key"></el-table-column>
      <el-table-column label="专题名称" prop="config_value"></el-table-column>
      <el-table-column label="说明" prop="config_comment"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.is_active == 'Y'">开启</el-tag>
          <el-tag type="danger" v-else>关闭</el-tag>
          <!-- <el-switch
            v-model="scope.row.is_active"
            active-value="Y"
            inactive-value="N">
          </el-switch> -->
          <!-- <img :src="scope.row.surface" alt="surface" style="width: 100%;"> -->
        </template>
      </el-table-column>
      <!-- <el-table-column label="作者" prop="nickname"></el-table-column> -->
      <el-table-column label="创建日期" prop="created_at"></el-table-column>
      <el-table-column label="修改日期" prop="updated_at"></el-table-column>

      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="openUpdateDialog(scope.row.id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="openDeleteConfirm(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <!-- Form dialog -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="form-container">
        <el-form-item label="key" prop="config_key">
          <el-input v-model="ruleForm.config_key"></el-input>
        </el-form-item>
        <el-form-item label="专题名称" prop="config_value">
          <el-input v-model="ruleForm.config_value"></el-input>
        </el-form-item>
        <el-form-item label="专题说明" prop="config_comment">
          <el-input v-model="ruleForm.config_comment"></el-input>
        </el-form-item>

        <el-form-item label="开启专题">
          <el-switch
            v-model="ruleForm.is_active"
            active-value="Y"
            inactive-value="N">
          </el-switch>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>

        <el-button type="primary" @click="submitCreateForm('ruleForm')" v-if="dialogStatus === 'create'">添 加</el-button>
        <el-button type="primary" @click="submitUpdateForm('ruleForm')" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/config'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import axios from 'axios'
// import MdEditor from '@/components/MarkdownEditor'

export default {
  name: 'config',
  components: { mavonEditor },
  data() {
    return {
      uploadUrl: 'https://dev.traveller.shengxiagn.com/s/no-auth/single-upload',
      multipleSelection: [],
      selectIds: [],
      selectNames: [],
      departments: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      list: null,
      listQuery: {
        name: '',
        page: 1,
        page_size: 10
      },
      total: 0,
      listLoading: true,
      ruleForm: {},
      dialogStatus: 'create',
      dialogFormVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogStatus === 'create' ? '添加' : '编辑'
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  methods: {
    $imgAdd(pos, $file) {
      const formData = new FormData()
      formData.append('file', $file)
      axios({
        url: this.uploadUrl,
        method: 'post',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(res => {
          console.log(res)
          // 将返回的url替换到文本原位置![...](0) -> ![...](url)
          this.$refs.mavonEditor.$img2Url(pos, res.data.Value.OriginPath)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleAvatarSuccess(res, file) {
      // this.temp.surface = URL.createObjectURL(file.raw)
      this.ruleForm.surface = res.Value.OriginPath
    },
    beforeAvatarUpload(file) {
      /* const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M */
      return true
    },
    openDeleteConfirm(row) {
      this.$confirm(`确认删除专题 ${row.title} 吗?`)
        .then(_ => {
          return api.deleteConfig(row.id)
        })
        .then(res => {
          this.getList()
        })
        .catch(_ => {})
    },

    // 多选框选中事件
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.selectIds = val.map(item => {
        return item.posId
      })
      this.selectNames = val.map(item => {
        return item.name
      })
    },
    // 部门选择事件
    handleTreeNodeClick(data) {
      this.ruleForm.deptName = data.label
      this.ruleForm.deptId = data.id
    },
    // 分页事件
    handleSizeChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },

    // 查询事件
    handleFilter() {
      this.getList()
    },

    submitCreateForm(formName) {
      // this.$refs[formName].validate(valid => {
      //   if (valid) {
      const data = Object.assign({}, this.ruleForm)
      api.createConfig(data)
        .then(res => {
          console.log(res)
          this.dialogFormVisible = false
          this.getList()
        })
        .catch(err => {
          console.log(err)
        })
        // } else {
        //   console.log('error submit!!')
        //   return false
        // }
      // })
    },
    submitUpdateForm(formName) {
      // this.$refs[formName].validate(valid => {
      //   if (valid) {
      const data = Object.assign({}, this.ruleForm)
      api.updateConfig(data)
        .then(res => {
          console.log(res)
          this.dialogFormVisible = false
          this.getList()
        })
        .catch(err => {
          console.log(err)
        })
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    },
    resetForm(formName) {
      this.ruleForm = {
        config_key: '',
        config_value: '',
        config_comment: '',
        is_active: 'N'
      }
      this.departmentName = ''
      this.superior = ''
    },
    openCreateDialog() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    openUpdateDialog(id) {
      api.singleConfig(id)
        .then(res => {
          this.ruleForm = res.data
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
        })
        .catch(err => {
          console.log(err)
        })
    },

    getList() {
      this.listLoading = true
      const params = Object.assign({}, this.listQuery)
      api.selectConfig(params)
        .then(res => {
          console.log(res)
          this.list = res.data.data
          this.total = res.data.meta.pagination.total
          this.listLoading = false
        })
        .catch(_ => {

        })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>
