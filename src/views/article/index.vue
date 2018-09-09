<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="昵称" v-model="listQuery.nickname">
      </el-input>
      <!-- <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.importance" :placeholder="$t('table.importance')">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" :placeholder="$t('table.type')">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
        </el-option>
      </el-select>
      <el-select @change='handleFilter' style="width: 140px" class="filter-item" v-model="listQuery.sort">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select> -->
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="success" icon="el-icon-plus" @click="openCreateDialog">添加</el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button> -->
    </div>

    <el-table :data="articlePage.row" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          <!-- {{ scope.$index }} -->
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="内容">
        <template slot-scope="scope">
          <span>{{ scope.row.content | emojiFilter }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="作者" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.traveller_user_nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="位置">
        <template slot-scope="scope">
          <span>{{ scope.row.traveller_location_name }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="封面图" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.surface" alt="surface" width="100">
        </template>
      </el-table-column> -->
      <el-table-column label="创建日期" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改日期" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">Preview</el-button>
          <!-- <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="articlePage.total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogType === 'create' ? '新增' : '查看'" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" class="form-container">
        <el-form-item label="作者" prop="title">
          <el-input v-if="dialogType === 'update'" v-model="temp.traveller_user_nickname"></el-input>
          <el-select
            v-model="temp.traveller_user_account"
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
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="temp.traveller_location_name"></el-input>
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
            <img v-if="temp.surface" :src="temp.surface" class="avatar" alt="surface">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="发布日期">
          <el-date-picker
            v-model="temp.created_at"
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
            v-model="textarea">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogType === 'create'" type="primary" @click="createData">新增</el-button>
        <el-button v-else type="primary" @click="updateData">修改</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { ARTICLE_PAGE_QUERY, CREATE_ARTICLE_MUTATION } from '@/api/article'
import { USER_QUERY } from '@/api/user'
import * as api from '@/api/article'
// import { escape2Html } from '@/utils/index'

export default {
  name: 'articles',
  data() {
    return {
      articles: [],
      articlePage: {
        row: [],
        total: 0
      },
      userPage: {
        row: [],
        total: 0
      },
      temp: {},
      createTemp: {},
      dialogType: 'create',
      dialogFormVisible: false,
      // 搜索条件
      listQuery: {
        nickname: '',
        page: 1,
        pageSize: 10
      },
      // page: 1,
      // pageSize: 10,
      nickname: '',
      // select搜索昵称
      nicknameQuery: '',
      // nicknameTmp: '',
      total: 100,
      value11: '',
      imageUrl: '',
      listLoading: false,
      options: [],
      value9: [],
      list: [],
      loading: false
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
    },
    emojiFilter(content) {
      /* eslint-disable no-undef */
      return twemoji.parse(content)
    }
  },
  // created() {
  // },
  mounted() {
    this.list = this.states.map(item => {
      return { value: item, label: item }
    })
  },
  methods: {
    createData() {
      const variables = Object.assign({}, this.createTemp)
      this.$apollo
        .mutate({
          mutation: CREATE_ARTICLE_MUTATION,
          variables
        })
        .then(res => {
          // 重定向到登录页面
          console.log(res)
          // this.$router.replace('/login')
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleFilter() {
      this.page = 1
      // 属性一改变graphql就会立马执行，十分消耗带宽，点击搜索才触发更新
      // this.nicknameTmp = this.nickname
      this.nickname = this.listQuery.nickname
      // this.getList()
    },
    getList() {
      // You don't need to re-fetch it, apollo will fetch it auto when the vue data changed
      // this.$apollo.queries.articlePage.refetch()

      // api.selectPreArticle()
      //   .then(res => {
      //     console.log(res)
      //     //
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
    },
    resetTemp() {
      this.temp = {
        traveller_user_nickname: '',
        traveller_location_name: '',
        surface: '',
        created_at: ''
      }
    },
    resetCreateTemp() {
      this.createTemp = {
        traveller_user_account: '',
        traveller_location_name: '',
        surface: '',
        published_at: ''
      }
    },
    openCreateDialog() {
      this.resetTemp()
      this.dialogType = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      // Copy obj
      // let temp = Object.assign({}, row)
      // console.log(temp)
      // /* eslint-disable no-undef */
      // temp.content = escape2Html(twemoji.parse(temp.content))
      // console.log(temp)
      // console.log(row)
      const obj = Object.assign({}, row)
      // console.log(a)
      obj.content = twemoji.parse(obj.content)
      // console.log(a)
      // row.content = escape2Html(twemoji.parse(row.content))
      // console.log(row)
      this.temp = obj
      // Show the dialog
      this.dialogType = 'update'
      this.dialogFormVisible = true
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      // 不需要手动触发getList方法，属性一变化graphql会自动执行
      // this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      // this.getList()
    },
    handleAvatarSuccess(res, file) {
      console.log(res, file)
      // this.temp.surface = URL.createObjectURL(file.raw)
      this.temp.surface = res.Value.OriginPath
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    remoteMethod(query) {
      if (query !== '') {
        console.log(query)
        this.loading = true
        this.nicknameQuery = query
        this.options = this.userPage.row
        this.loading = false
        /* setTimeout(() => {
          this.loading = false
          this.options = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200) */
      } else {
        this.options = []
      }
    }
  }
  // apollo: {
  //   articlePage: {
  //     query: ARTICLE_PAGE_QUERY,
  //     variables() {
  //       // Use vue reactive properties here
  //       return {
  //         page: this.listQuery.page,
  //         page_size: this.listQuery.pageSize,
  //         nickname: this.nickname
  //       }
  //     }
  //     // 踩坑：动态参数不能直接这么写，要加上return才可以，参考文档
  //     // https://akryum.github.io/vue-apollo/guide/apollo/queries.html#reactive-parameters
  //     /* variables: {
  //       page: 2,
  //       page_size: this.pageSize,
  //       nickname: this.nickname
  //     } */
  //   },
  //   userPage: {
  //     query: USER_QUERY,
  //     variables() {
  //       return {
  //         page: 1,
  //         page_size: 5,
  //         nickname: this.nicknameQuery
  //       }
  //     }
  //   }
  // }
}
</script>
<style>
  /* .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    display: block;
  } */
</style>
