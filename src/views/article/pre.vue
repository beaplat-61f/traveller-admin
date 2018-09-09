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
      <el-table-column label="位置" prop="traveller_location_name"></el-table-column>
      <!-- <el-table-column label="专题名称" prop="config_value"></el-table-column> -->

      <el-table-column label="封面">
        <template slot-scope="scope">
          <img :src="scope.row.surface" alt="surface" style="width: 100%;">
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.has_published == 1">已发布</el-tag>
          <el-tag type="danger" v-else>未发布</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布日期" prop="published_at"></el-table-column>
      <el-table-column label="内容" prop="content" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column label="创建日期" prop="created_at"></el-table-column>
      <el-table-column label="修改日期" prop="updated_at"></el-table-column> -->

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
      <el-form ref="dataForm" :model="ruleForm" label-position="left" label-width="70px" class="form-container">
        <!-- <el-form-item label="作者" prop="title">
          <el-input v-if="dialogType === 'update'" v-model="ruleForm.traveller_user_nickname"></el-input>
          <el-select
            v-model="ruleForm.traveller_user_account"
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.nickname"
              :value="item.account">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="位置" prop="location">
          <el-input v-model="ruleForm.traveller_location_name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="Content">
          {{ temp.content }}
        </el-form-item> -->
        <el-form-item label="图片">
          <!-- <img v-if="dialogType === 'update'" :src="temp.surface" alt="surface" width="330"> -->
          <el-upload
            class="avatar-uploader"
            action="https://dev.traveller.shengxiagn.com/s/no-auth/single-upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="ruleForm.surface" :src="ruleForm.surface" class="avatar" alt="surface">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="发布日期">
          <el-date-picker
            v-model="ruleForm.published_at"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="内容">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            rows="10"
            v-model="ruleForm.content">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button v-if="dialogType === 'create'" type="primary" @click="createData">新增</el-button>
        <el-button v-else type="primary" @click="updateData">修改</el-button> -->
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCreateForm('ruleForm')" v-if="dialogStatus === 'create'">添 加</el-button>
        <el-button type="primary" @click="submitUpdateForm('ruleForm')" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/article'
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
      this.$confirm(`确认删除 ${row.id} 吗?`)
        .then(_ => {
          return api.deletePreArticle(row.id)
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
      api.createPreArticle(data)
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
      api.updatePreArticle(data)
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
        traveller_location_name: '',
        surface: '',
        content: '',
        published_at: ''
      }
    },
    openCreateDialog() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    openUpdateDialog(id) {
      api.singlePreArticle(id)
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
      api.selectPreArticle(params)
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
