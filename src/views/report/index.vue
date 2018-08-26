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
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="封面">
        <template slot-scope="scope">
          <img :src="scope.row.surface" alt="surface" style="width: 100%;">
        </template>
      </el-table-column>
      <el-table-column label="作者" prop="nickname"></el-table-column>
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
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- <el-input v-model="ruleForm.content"></el-input> -->
          <md-editor id='contentEditor' ref="contentEditor" v-model='ruleForm.content' :height="300" :zIndex='20'></md-editor>
        </el-form-item>

        <el-form-item label="封面">
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

        <el-form-item label="作者">
          <el-input v-model="ruleForm.author"></el-input>
        </el-form-item>

        <!-- <el-form-item label="头像">
          <el-input v-model="ruleForm.avatar"></el-input>
        </el-form-item> -->

        <el-form-item label="昵称">
          <el-input v-model="ruleForm.nickname"></el-input>
        </el-form-item>

        <el-form-item label="账号">
          <el-input v-model="ruleForm.account"></el-input>
        </el-form-item>

        <el-form-item label="专题">
          <el-input v-model="ruleForm.topic"></el-input>
        </el-form-item>

        <el-form-item label="显示">
          <!-- <el-switch v-model="ruleForm.active"></el-switch> -->
          <el-switch
            v-model="ruleForm.is_active"
            active-value="Y"
            inactive-value="N">
          </el-switch>
        </el-form-item>

        <!-- <el-form-item label="部门" prop="deptName">
          <el-input v-model="ruleForm.deptName" disabled=""></el-input>
          <el-popover
            placement="right"
            width="400"
            trigger="click">
            <el-tree :data="departments" :props="defaultProps" @node-click="handleTreeNodeClick" node-key="id" :default-expand-all="true"></el-tree>
            <el-button slot="reference">选择部门</el-button>
          </el-popover>
        </el-form-item> -->
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
import * as api from '@/api/report'
import MdEditor from '@/components/MarkdownEditor'

export default {
  name: 'report',
  components: { MdEditor },
  data() {
    return {
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
          return api.deleteReport(row.id)
        })
        .then(res => {
          this.getList()
        })
        .catch(_ => {})
    },
    openMultipleDeleteConfirm() {
      const names = this.selectNames.join()
      const length = this.selectNames.length
      if (length === 0) {
        this.$confirm('请选择删除的岗位')
        return false
      }
      this.$confirm(`确认删除岗位 ${names} 共 ${length} 个岗位吗?`)
        .then(_ => {
          const data = this.selectIds
          // console.log(data, JSON.stringify(data))
          return api.deleteReport(data)
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
      api.createReport(data)
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
      api.updateReport(data)
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
        title: '',
        content: '# 盛夏光年旅行者一号',
        surface: '',
        author: 6205,
        avatar: 'https://dev.traveller.shengxiagn.com/cdn/traveller-picture/avatar/2018-07-22/b3ac9da6498148e3b4070f635e83a528_avatar.jpg',
        nickname: '李逍遥',
        account: 'b3ac9da6498148e3b4070f635e83a528',
        topic: '国庆专题',
        is_active: 'Y'
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
      api.singleReport(id)
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
      api.selectReport(params)
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
