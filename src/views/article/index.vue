<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="Please input nickname" v-model="nickname">
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

    <el-table :data="articlePage.articles" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
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
        :current-page="page"
        :page-sizes="[10,20,30,50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="articlePage.total">
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
// import { ALL_ARTICLES_QUERY } from '@/graphql'
import { ARTICLE_PAGE_QUERY } from '@/api/article'
import { escape2Html } from '@/utils/index'

export default {
  name: 'articles',
  data() {
    return {
      list: null,
      articlePage: [],
      temp: {},
      dialogFormVisible: false,
      // 搜索条件
      listQuery: {
        nickname: '',
        page: 1,
        limit: 10
      },
      page: 1,
      pageSize: 10,
      nickname: '',
      nicknameTmp: '',
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
    // this.fetchData()
  },
  methods: {
    handleFilter() {
      this.page = 1
      // 属性一改变graphql就会立马执行，十分消耗带宽，点击搜索才触发更新
      this.nicknameTmp = this.nickname
      this.getList()
    },
    getList() {
      this.$apollo.queries.articlePage.refetch()
      // const { nickname, page, page_size } = this.listQuery
      // TODO: How to use the query
      /* this.$apollo.query('articlePage', {
        query: ARTICLE_PAGE_QUERY,
        variables: {
          page: 1,
          page_size: 3,
          nickname: '19'
        }
      })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        }) */
    },
    fetchData() {
      // this.listLoading = true
      // getList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.listLoading = false
      // })
    },
    handleUpdate(row) {
      // Copy obj
      const temp = Object.assign({}, row)

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
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    }
  },
  apollo: {
    articlePage: {
      query: ARTICLE_PAGE_QUERY,
      variables() {
        // Use vue reactive properties here
        return {
          page: this.page,
          page_size: this.pageSize,
          nickname: this.nicknameTmp
        }
      }
      // 踩坑：动态参数不能直接这么写，要加上return才可以，参考文档
      // https://akryum.github.io/vue-apollo/guide/apollo/queries.html#reactive-parameters
      /* variables: {
        page: 2,
        page_size: this.pageSize,
        nickname: this.nickname
      } */
    }
  }
}
</script>
