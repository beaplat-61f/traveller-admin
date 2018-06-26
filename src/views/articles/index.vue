<template>
  <div class="app-container">
    <el-table :data="allArticles" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="内容">
        <template slot-scope="scope">
          <span>{{ scope.row.content | emojiFilter }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="作者" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.traveller_user_nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="位置">
        <template slot-scope="scope">
          <span>{{ scope.row.traveller_location_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
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
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog title="Preview" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="Author" prop="title">
          <el-input v-model="temp.traveller_user_nickname"></el-input>
        </el-form-item>
        <el-form-item label="Location" prop="location">
          <el-input v-model="temp.traveller_location_name"></el-input>
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
// import { getList } from '@/api/table'
import { ALL_ARTICLES_QUERY } from '@/graphql'
import { escape2Html } from '@/utils/index'

export default {
  data() {
    return {
      list: null,
      allArticles: [],
      temp: {},
      dialogFormVisible: false,
      // 搜索条件
      listQuery: {
        page: 1,
        limit: 20
      },
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
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // this.listLoading = true
      // getList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.listLoading = false
      // })
    },
    handleUpdate(row) {
      // Copy obj
      let temp = Object.assign({}, row)

      /* eslint-disable no-undef */
      temp.content = escape2Html(twemoji.parse(temp.content))

      // let temp = document.createElement("div")
      // temp.innerHTML = tempa.content
      // tempa.content = temp.innerText || temp.textContent

      this.temp = temp
      // Show the dialog
      this.dialogFormVisible = true
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      // this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      // this.getList()
    }
  },
  apollo: {
    allArticles: {
      query: ALL_ARTICLES_QUERY
    }
  }
}
</script>
