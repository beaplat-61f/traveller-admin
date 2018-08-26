<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="Please input content" v-model="listQuery.content">
      </el-input>
      <el-input style="width: 200px;" class="filter-item" placeholder="Please input email" v-model="listQuery.email">
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
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button> -->
    </div>

    <el-table :data="feedbackPage.feedback" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
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
      <el-table-column label="内容" align="center">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱"  width="200">
        <template slot-scope="scope">
          {{ scope.row.email }}
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
        :total="feedbackPage.total">
      </el-pagination>
    </div>

    <el-dialog title="Preview" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="Nickname" prop="Nickname">
          <el-input v-model="temp.nickname"></el-input>
        </el-form-item>
        <el-form-item label="Avatar" prop="Avatar">
          <el-input v-model="temp.avatar"></el-input>
        </el-form-item>
        <!-- <el-form-item label="Content">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="temp.content">
          </el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <!-- <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { FEEDBACK_PAGE_QUERY } from '@/api/feedback'

export default {
  name: 'feedback',
  data() {
    return {
      feedbackPage: {
        feedback: [],
        total: 0
      },
      temp: {},
      dialogFormVisible: false,
      // 搜索条件
      listQuery: {
        page: 1,
        pageSize: 10,
        email: '',
        content: ''
      },
      // page: 1,
      // pageSize: 10,
      nickname: '',
      content: '',
      email: '',
      // nicknameTmp: '',
      total: 100,
      listLoading: false
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
  methods: {
    handleFilter() {
      this.page = 1
      // 属性一改变graphql就会立马执行，十分消耗带宽，点击搜索才触发更新
      // this.nicknameTmp = this.nickname
      this.content = this.listQuery.content
      this.email = this.listQuery.email
      // this.getList()
    },
    getList() {
      // You don't need to re-fetch it, apollo will fetch it auto when the vue data changed
      // this.$apollo.queries.feedbackPage.refetch()
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      // Show the dialog
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
    }
  },
  apollo: {
    feedbackPage: {
      query: FEEDBACK_PAGE_QUERY,
      variables() {
        // Use vue reactive properties here
        return {
          page: this.listQuery.page,
          page_size: this.listQuery.pageSize,
          content: this.content,
          email: this.email
        }
      }
    }
  }
}
</script>
